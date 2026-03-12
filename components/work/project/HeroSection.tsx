'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './project.module.css';

interface HeroSectionProps {
    projectTitle: string;
    date: string;
    client: string;
    heroVideo: string;
    animationDuration: string;
}

export default function HeroSection({ projectTitle, date, client, heroVideo, animationDuration }: HeroSectionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState('00:00:00');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const t = video.currentTime;
            const mins = Math.floor(t / 60).toString().padStart(2, '0');
            const secs = Math.floor(t % 60).toString().padStart(2, '0');
            const frames = Math.floor((t % 1) * 30).toString().padStart(2, '0');
            setCurrentTime(`${mins}:${secs}:${frames}`);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    return (
        <section className={styles.hero}>
            <video
                ref={videoRef}
                className={styles.heroVideo}
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
            />
            <div className={styles.heroOverlay}>
                <div className={styles.heroInfoCard}>
                    <span className={styles.viewFullVideo}>View Full Video</span>
                    <h1 className={styles.heroTitle}>{projectTitle}</h1>
                    <div className={styles.heroMeta}>
                        <div className={styles.heroMetaItem}>
                            <span className={styles.heroMetaLabel}>Date</span>
                            <span className={styles.heroMetaValue}>{date}</span>
                        </div>
                        <div className={styles.heroMetaItem}>
                            <span className={styles.heroMetaLabel}>Client</span>
                            <span className={styles.heroMetaValue}>{client}</span>
                        </div>
                    </div>
                </div>
            </div>
            <span className={styles.animationTime}>
                [{currentTime}] - Animation Time
            </span>
        </section>
    );
}
