'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './work-showcase.module.css';
import { projects } from '@/lib/projects';

export default function WorkShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [leftPinned, setLeftPinned] = useState(true);
    const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement | null>(null);
    const leftColRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        projectRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsTransitioning(true);
                            setTimeout(() => {
                                setActiveIndex(index);
                                setTimeout(() => setIsTransitioning(false), 50);
                            }, 150);
                        }
                    });
                },
                { threshold: 0.6 }
            );

            observer.observe(ref);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionBottom = rect.bottom;
            setLeftPinned(sectionBottom > window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const active = projects[activeIndex];

    return (
        <section className={styles.section} ref={sectionRef}>
            {/* Left Column - Sticky Info Panel */}
            <div
                ref={leftColRef}
                className={styles.leftColumn}
                style={leftPinned ? undefined : { position: 'absolute', bottom: 0, top: 'auto' }}
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
                            [{active.scope}]: {active.aboutDescription}
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
                        className={styles.projectCard}
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
                    </div>
                ))}
            </div>
        </section>
    );
}
