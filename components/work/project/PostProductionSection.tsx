'use client';

import { useState } from 'react';
import styles from './project.module.css';

export interface PostProductionScene {
    label: string;
    image: string;
    duration: string;
}

interface PostProductionSectionProps {
    title: string;
    terms: string;
    scenes: PostProductionScene[];
}

export default function PostProductionSection({
    title,
    terms,
    scenes,
}: PostProductionSectionProps) {
    const [activeSceneIndex, setActiveSceneIndex] = useState(0);
    const [hoveredSceneIndex, setHoveredSceneIndex] = useState<number | null>(null);
    const safeScenes = scenes.length > 0 ? scenes : [{ label: 'Scene 1', image: '', duration: '00:00:00' }];
    const displaySceneIndex = hoveredSceneIndex ?? activeSceneIndex;
    const activeScene = safeScenes[displaySceneIndex] || safeScenes[0];

    return (
        <section className={styles.postProductionSection}>
            <div className={styles.postProductionTop}>
                <div className={styles.postProductionLeft}>
                    <h2 className={styles.postProductionTitle}>{title}</h2>
                    <div className={styles.postProductionBadgeRow}>
                        <span className={`${styles.postProductionBadge} badge-animate`}>Post-Production</span>
                        <p className={styles.postProductionTerms}>{terms}</p>
                    </div>
                </div>
                <div className={styles.postProductionRight}>
                    <button
                        type="button"
                        className={styles.postProductionArrow}
                        aria-label="Jump to animation highlights"
                    >
                        ↓
                    </button>
                </div>
            </div>

            <div className={styles.postProductionMedia}>
                {activeScene.image ? (
                    <img
                        src={activeScene.image}
                        alt={activeScene.label}
                        className={styles.postProductionImage}
                    />
                ) : (
                    <div className={styles.postProductionImageFallback} />
                )}
            </div>

            <div className={styles.postProductionBottom}>
                <div className={styles.postProductionTabs}>
                    {safeScenes.map((scene, index) => (
                        <button
                            key={`${scene.label}-${index}`}
                            type="button"
                            className={`${styles.postProductionTab} ${index === displaySceneIndex ? styles.postProductionTabActive : ''}`}
                            onClick={() => {
                                setActiveSceneIndex(index);
                                setHoveredSceneIndex(null);
                            }}
                            onMouseEnter={() => setHoveredSceneIndex(index)}
                            onMouseLeave={() => setHoveredSceneIndex(null)}
                            onFocus={() => setHoveredSceneIndex(index)}
                            onBlur={() => setHoveredSceneIndex(null)}
                            aria-pressed={index === activeSceneIndex}
                        >
                            {scene.label}
                        </button>
                    ))}
                </div>
                <div className={styles.postProductionMeta}>
                    <span className={styles.postProductionMetaLabel}>Animation Highlights</span>
                    <span className={styles.postProductionMetaDuration}>{activeScene.duration}</span>
                </div>
            </div>
        </section>
    );
}
