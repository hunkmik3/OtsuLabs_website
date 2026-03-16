'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './project.module.css';
import type { ExplorationSlide } from '@/lib/projects';

interface PreProductionSectionProps {
    preProductionDescription: string;
    characterSheetText: string;
    characterSheetImages: { src: string; label?: string }[];
    explorationSlides: ExplorationSlide[];
}

export default function PreProductionSection({
    preProductionDescription,
    characterSheetText,
    characterSheetImages,
    explorationSlides,
}: PreProductionSectionProps) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [scrolledLeft, setScrolledLeft] = useState(false);
    const [scrolledEnd, setScrolledEnd] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const velocityRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const momentumRef = useRef<number | null>(null);

    const updateScrollState = () => {
        const gallery = galleryRef.current;
        if (!gallery) return;
        const { scrollLeft, scrollWidth, clientWidth } = gallery;
        setScrolledLeft(scrollLeft > 10);
        setScrolledEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    };

    const cancelMomentum = () => {
        if (momentumRef.current !== null) {
            cancelAnimationFrame(momentumRef.current);
            momentumRef.current = null;
        }
    };

    const applyMomentum = () => {
        const gallery = galleryRef.current;
        if (!gallery) return;
        velocityRef.current *= 0.95;
        if (Math.abs(velocityRef.current) < 0.5) {
            momentumRef.current = null;
            return;
        }
        gallery.scrollLeft -= velocityRef.current;
        updateScrollState();
        momentumRef.current = requestAnimationFrame(applyMomentum);
    };

    const startDrag = (pageX: number) => {
        const gallery = galleryRef.current;
        if (!gallery) return;
        cancelMomentum();
        isDraggingRef.current = true;
        startXRef.current = pageX - gallery.offsetLeft;
        scrollLeftRef.current = gallery.scrollLeft;
        lastXRef.current = pageX;
        lastTimeRef.current = Date.now();
        velocityRef.current = 0;
    };

    const moveDrag = (pageX: number) => {
        const gallery = galleryRef.current;
        if (!gallery || !isDraggingRef.current) return;
        const x = pageX - gallery.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;
        gallery.scrollLeft = scrollLeftRef.current - walk;
        updateScrollState();

        const now = Date.now();
        const dt = now - lastTimeRef.current;
        if (dt > 0) {
            velocityRef.current = ((pageX - lastXRef.current) / dt) * 15;
        }
        lastXRef.current = pageX;
        lastTimeRef.current = now;
    };

    const endDrag = () => {
        isDraggingRef.current = false;
        if (Math.abs(velocityRef.current) > 1) {
            momentumRef.current = requestAnimationFrame(applyMomentum);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveSlide((prev) => (prev + 1) % explorationSlides.length);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 200);
        }, 5000);

        return () => clearInterval(interval);
    }, [explorationSlides.length]);

    useEffect(() => {
        updateScrollState();
    }, [characterSheetImages.length]);

    useEffect(() => {
        return () => cancelMomentum();
    }, []);

    const currentSlide = explorationSlides[activeSlide];

    return (
        <section className={styles.preProductionSection}>
            <div className={styles.preProductionHeader}>
                <h2 className={styles.preProductionTitle}>{preProductionDescription}</h2>
                <span className={styles.preProductionBadge}>Pre-Production</span>
            </div>

            <div className={styles.characterSheetRow}>
                <div className={styles.characterSheetLeft}>
                    <p className={styles.characterSheetLabel}>Character Sheet</p>
                    <p className={styles.characterSheetText}>{characterSheetText}</p>
                </div>
                <div className={`${styles.characterGalleryWrapper}${scrolledLeft ? ` ${styles.scrolledLeft}` : ''}${scrolledEnd ? ` ${styles.scrolledEnd}` : ''}`}>
                    <div
                        ref={galleryRef}
                        className={styles.characterGallery}
                        onScroll={updateScrollState}
                        onMouseDown={(e) => startDrag(e.pageX)}
                        onMouseMove={(e) => {
                            if (!isDraggingRef.current) return;
                            e.preventDefault();
                            moveDrag(e.pageX);
                        }}
                        onMouseUp={endDrag}
                        onMouseLeave={endDrag}
                        onTouchStart={(e) => startDrag(e.touches[0].pageX)}
                        onTouchMove={(e) => {
                            if (!isDraggingRef.current) return;
                            moveDrag(e.touches[0].pageX);
                        }}
                        onTouchEnd={endDrag}
                    >
                        {characterSheetImages.map((img, i) => (
                            <div key={i} className={styles.characterCard}>
                                <img
                                    src={img.src}
                                    alt={img.label || `Character ${i + 1}`}
                                    className={styles.characterImage}
                                    draggable={false}
                                />
                                {img.label && (
                                    <span className={styles.characterLabel}>{img.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.explorationCard}>
                <div className={styles.explorationImageWrapper}>
                    <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        className={`${styles.explorationImage} ${isTransitioning ? styles.explorationImageHidden : ''}`}
                    />
                </div>
                <div className={styles.explorationFooter}>
                    <div className={styles.explorationInfo}>
                        <h3 className={styles.explorationTitle}>{currentSlide.title}</h3>
                        <p className={styles.explorationDesc}>{currentSlide.description}</p>
                    </div>
                    <span className={styles.explorationPagination}>
                        {activeSlide + 1}/{explorationSlides.length}
                    </span>
                </div>
            </div>
        </section>
    );
}
