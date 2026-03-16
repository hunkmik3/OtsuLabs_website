'use client';

import { CSSProperties, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './work-showcase.module.css';
import type { ProjectData } from '@/lib/projects';

interface WorkShowcaseProps {
    projects: ProjectData[];
}

export default function WorkShowcase({ projects }: WorkShowcaseProps) {
    const WHEEL_INTENT_THRESHOLD = 72;
    const WHEEL_RESET_GAP_MS = 220;
    const SNAP_POST_COOLDOWN_MS = 260;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [leftPinned, setLeftPinned] = useState(true);
    const [releaseTop, setReleaseTop] = useState(0);
    const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement | null>(null);
    const leftColRef = useRef<HTMLDivElement | null>(null);
    const activeIndexRef = useRef(0);
    const leftPinnedRef = useRef(true);
    const transitionTimerRef = useRef<number | null>(null);
    const holdTimerRef = useRef<number | null>(null);
    const holdUntilRef = useRef(0);
    const finalTouchLockedRef = useRef(false);
    const bodyOverflowRef = useRef('');
    const htmlOverflowRef = useRef('');
    const snapLockRef = useRef(false);
    const snapTargetYRef = useRef<number | null>(null);
    const snapSettleRafRef = useRef<number | null>(null);
    const snapFallbackTimerRef = useRef<number | null>(null);
    const snapCooldownUntilRef = useRef(0);
    const wheelIntentRef = useRef(0);
    const lastWheelTsRef = useRef(0);
    const lastWheelDirectionRef = useRef(0);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        const unlockSnapLock = () => {
            snapLockRef.current = false;
            snapTargetYRef.current = null;
            snapCooldownUntilRef.current = Date.now() + SNAP_POST_COOLDOWN_MS;

            if (snapSettleRafRef.current !== null) {
                window.cancelAnimationFrame(snapSettleRafRef.current);
                snapSettleRafRef.current = null;
            }
            if (snapFallbackTimerRef.current !== null) {
                window.clearTimeout(snapFallbackTimerRef.current);
                snapFallbackTimerRef.current = null;
            }
        };

        const getTriggerY = () => {
            const header = document.querySelector('header');
            const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
            return headerBottom + 24;
        };

        const getCurrentCardIndexAtTrigger = (triggerY: number) => {
            let nextIndex = 0;
            const touchTolerance = 6;

            for (let i = 0; i < projectRefs.current.length; i += 1) {
                const cardRef = projectRefs.current[i];
                if (!cardRef) continue;
                if (cardRef.getBoundingClientRect().top <= triggerY + touchTolerance) {
                    nextIndex = i;
                } else {
                    break;
                }
            }

            return Math.min(nextIndex, projects.length - 1);
        };

        const normalizeWheelDelta = (event: WheelEvent) => {
            if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                return event.deltaY * 16;
            }
            if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
                return event.deltaY * window.innerHeight;
            }
            return event.deltaY;
        };

        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();

            // Switch info when a card top "touches" the trigger line below the fixed header.
            const triggerY = getTriggerY();
            const nextIndex = getCurrentCardIndexAtTrigger(triggerY);

            // Release left column only when the last card reaches the same trigger line.
            const lastCardRef = projectRefs.current[projectRefs.current.length - 1];
            const lastCardTop = lastCardRef?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
            const shouldReleaseLeftColumn = lastCardTop <= triggerY;

            if (shouldReleaseLeftColumn && leftPinnedRef.current) {
                const nextReleaseTop = Math.max(0, -rect.top);
                setReleaseTop(nextReleaseTop);
                setLeftPinned(false);
                leftPinnedRef.current = false;
            } else if (!shouldReleaseLeftColumn && !leftPinnedRef.current) {
                setLeftPinned(true);
                leftPinnedRef.current = true;
            }

            // At the final touch point, hold scroll briefly before allowing further scroll.
            if (shouldReleaseLeftColumn && !finalTouchLockedRef.current) {
                finalTouchLockedRef.current = true;
                holdUntilRef.current = Date.now() + 520;
                bodyOverflowRef.current = document.body.style.overflow;
                htmlOverflowRef.current = document.documentElement.style.overflow;
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                if (holdTimerRef.current) {
                    window.clearTimeout(holdTimerRef.current);
                }

                holdTimerRef.current = window.setTimeout(() => {
                    document.body.style.overflow = bodyOverflowRef.current;
                    document.documentElement.style.overflow = htmlOverflowRef.current;
                    holdUntilRef.current = 0;
                    holdTimerRef.current = null;
                }, 520);
            } else if (!shouldReleaseLeftColumn) {
                finalTouchLockedRef.current = false;
            }

            if (nextIndex === activeIndexRef.current) return;

            if (transitionTimerRef.current) {
                window.clearTimeout(transitionTimerRef.current);
            }

            activeIndexRef.current = nextIndex;
            setIsTransitioning(true);
            transitionTimerRef.current = window.setTimeout(() => {
                setActiveIndex(nextIndex);
                setIsTransitioning(false);
                transitionTimerRef.current = null;
            }, 120);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        const handleWheel = (event: WheelEvent) => {
            // Hard-stop during the final touch hold.
            if (Date.now() < holdUntilRef.current) {
                event.preventDefault();
                return;
            }

            if (!sectionRef.current) return;

            // Apply a slight slow-scroll effect while inside the showcase zone.
            const sectionRect = sectionRef.current.getBoundingClientRect();
            const triggerY = getTriggerY();
            const headerBottom = triggerY - 24;
            const isInShowcaseRange =
                sectionRect.top <= headerBottom + 24 &&
                sectionRect.bottom >= window.innerHeight * 0.18;

            if (!isInShowcaseRange) return;

            const deltaY = normalizeWheelDelta(event);
            const direction = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
            if (direction === 0) return;
            const now = Date.now();

            // Reset accumulated gesture when wheel stream pauses.
            if (now - lastWheelTsRef.current > WHEEL_RESET_GAP_MS) {
                wheelIntentRef.current = 0;
                lastWheelDirectionRef.current = 0;
            }
            lastWheelTsRef.current = now;

            // Reset accumulation when user changes direction.
            if (lastWheelDirectionRef.current !== 0 && lastWheelDirectionRef.current !== direction) {
                wheelIntentRef.current = 0;
            }
            lastWheelDirectionRef.current = direction;

            const currentIndex = getCurrentCardIndexAtTrigger(triggerY);
            const targetIndex = Math.min(
                projects.length - 1,
                Math.max(0, currentIndex + direction)
            );

            // Let native page scroll continue when user tries to move past bounds.
            if (targetIndex === currentIndex) return;

            event.preventDefault();
            if (now < snapCooldownUntilRef.current) return;
            if (snapLockRef.current) return;

            // Trackpad gestures emit many tiny deltas; wheel mice on Windows often use line deltas.
            // Normalize then use a lighter threshold for non-pixel delta modes.
            const intentThreshold =
                event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? WHEEL_INTENT_THRESHOLD : 24;

            wheelIntentRef.current += Math.abs(deltaY);
            if (wheelIntentRef.current < intentThreshold) return;
            wheelIntentRef.current = 0;

            snapLockRef.current = true;

            const targetCard = projectRefs.current[targetIndex];
            if (targetCard) {
                const targetTop = Math.round(
                    window.scrollY + targetCard.getBoundingClientRect().top - (headerBottom + 24)
                );
                snapTargetYRef.current = Math.max(0, targetTop);
                window.scrollTo({ top: snapTargetYRef.current, behavior: 'smooth' });
            }

            if (snapSettleRafRef.current !== null) {
                window.cancelAnimationFrame(snapSettleRafRef.current);
            }
            const waitUntilSettled = () => {
                if (snapTargetYRef.current === null) {
                    unlockSnapLock();
                    return;
                }

                const remaining = Math.abs(window.scrollY - snapTargetYRef.current);
                if (remaining <= 3) {
                    unlockSnapLock();
                    return;
                }

                snapSettleRafRef.current = window.requestAnimationFrame(waitUntilSettled);
            };
            snapSettleRafRef.current = window.requestAnimationFrame(waitUntilSettled);

            // Safety fallback in case browser blocks smooth scroll settling events.
            if (snapFallbackTimerRef.current !== null) {
                window.clearTimeout(snapFallbackTimerRef.current);
            }
            snapFallbackTimerRef.current = window.setTimeout(() => {
                unlockSnapLock();
            }, 1200);
        };
        const blockTouchWhileHolding = (event: TouchEvent) => {
            if (Date.now() < holdUntilRef.current) {
                event.preventDefault();
            }
        };
        const blockKeyWhileHolding = (event: KeyboardEvent) => {
            if (Date.now() >= holdUntilRef.current) return;
            if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
                event.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchmove', blockTouchWhileHolding, { passive: false });
        window.addEventListener('keydown', blockKeyWhileHolding);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchmove', blockTouchWhileHolding);
            window.removeEventListener('keydown', blockKeyWhileHolding);
            if (transitionTimerRef.current) {
                window.clearTimeout(transitionTimerRef.current);
            }
            unlockSnapLock();
            if (holdTimerRef.current) {
                window.clearTimeout(holdTimerRef.current);
            }
            document.body.style.overflow = bodyOverflowRef.current;
            document.documentElement.style.overflow = htmlOverflowRef.current;
        };
    }, [projects.length]);

    if (projects.length === 0) {
        return (
            <section className={styles.section} ref={sectionRef}>
                <div className={styles.leftColumn}>
                    <div className={styles.infoPanel}>
                        <h1 className={styles.projectTitle}>No projects available.</h1>
                    </div>
                </div>
            </section>
        );
    }

    const active = projects[Math.min(activeIndex, projects.length - 1)];
    const releasedStyle = !leftPinned
        ? ({ ['--left-column-release-top' as string]: `${releaseTop}px` } as CSSProperties)
        : undefined;

    return (
        <section className={styles.section} ref={sectionRef}>
            {/* Left Column - Sticky Info Panel */}
            <div
                ref={leftColRef}
                className={`${styles.leftColumn} ${!leftPinned ? styles.leftColumnReleased : ''}`}
                style={releasedStyle}
            >
                <div className={styles.infoPanel}>
                    <h1
                        className={`${styles.projectTitle} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
                    >
                        {active.projectTitle}
                    </h1>

                    <div
                        className={`${styles.details} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
                    >
                        <span className={styles.badge}>CLIENT&apos;S NAME</span>
                        <p className={styles.clientName}>{active.client}</p>

                        <span className={styles.badge}>SCOPE</span>
                        <p className={styles.scopeText}>
                            [{active.scope}]
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Scrolling Project Images */}
            <div className={styles.rightColumn}>
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        ref={(el) => { projectRefs.current[index] = el; }}
                        className={`${styles.projectCard} ${index === projects.length - 1 ? styles.projectCardLast : ''}`}
                    >
                        <Link href={`/work/${project.slug}`} className={styles.cardLink}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={project.image}
                                    alt={project.client}
                                    className={styles.projectImage}
                                />
                                <div className={styles.imageOverlay}>
                                    <p className={styles.overlayText}>
                                        Information: {project.aboutDescription}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className={styles.mobileCardInfo}>
                            <h2 className={styles.mobileCardTitle}>{project.projectTitle}</h2>
                            <span className={styles.badge}>CLIENT&apos;S NAME</span>
                            <p className={styles.clientName}>{project.client}</p>
                            <span className={styles.badge}>SCOPE</span>
                            <p className={styles.scopeText}>[{project.scope}]</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
