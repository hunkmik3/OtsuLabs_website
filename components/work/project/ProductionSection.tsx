import styles from './project.module.css';

interface ProductionSectionProps {
    description: string;
    videoSrc: string;
    projectTitle: string;
    duration: string;
}

export default function ProductionSection({
    description,
    videoSrc,
    projectTitle,
    duration,
}: ProductionSectionProps) {
    const descriptionLines = description.split('\n');

    return (
        <section className={styles.productionSection}>
            <div className={styles.productionHeader}>
                <span className={`${styles.productionBadge} badge-animate`}>Production</span>
                <h2 className={styles.productionDescription}>
                    {descriptionLines.map((line, i) => (
                        <span key={`${line}-${i}`} className={styles.productionDescriptionLine}>
                            {line}
                            {i < descriptionLines.length - 1 && <br />}
                        </span>
                    ))}
                </h2>
            </div>

            <div className={styles.productionMedia}>
                <video
                    src={videoSrc}
                    className={styles.productionVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                />

                <div className={styles.productionOverlay}>
                    <span className={styles.productionOverlayItem}>{projectTitle.toUpperCase()}</span>
                    <span className={styles.productionOverlayItem}>{duration}</span>
                    <span className={`${styles.productionOverlayItem} ${styles.productionOverlayCollection}`}>OTSU LABS COLLECTION</span>
                </div>
            </div>
        </section>
    );
}
