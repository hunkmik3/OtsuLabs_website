import styles from './project.module.css';

const scopeEmojis = ['🎬', '🎨', '🎞️', '🎬', '📋', '🎬', '🎬', '🎬'];

interface AboutProjectSectionProps {
    aboutDescription: string;
    scopeOfWork: string[];
    scopeImages: { top: [string, string]; bottom: string };
}

export default function AboutProjectSection({ aboutDescription, scopeOfWork, scopeImages }: AboutProjectSectionProps) {
    return (
        <section className={styles.aboutSection}>
            <div className={styles.aboutRow}>
                <div className={styles.aboutBadgeCol}>
                    <span className={`${styles.aboutBadge} badge-animate`}>About Projects</span>
                </div>
                <p className={styles.aboutDescription}>{aboutDescription}</p>
            </div>

            <div className={styles.scopeBadge}>
                <span className={`${styles.aboutBadge} badge-animate`}>Scope of Work</span>
            </div>
            <div className={styles.scopeList}>
                {scopeOfWork.map((item, i) => (
                    <span key={i} className={styles.scopeItem}>
                        {item}
                        {i < scopeOfWork.length - 1 && (
                            <span className={styles.scopeSeparator}>
                                {scopeEmojis[i % scopeEmojis.length]}
                            </span>
                        )}
                    </span>
                ))}
            </div>

            <div className={styles.imageGrid}>
                <div className={styles.imageGridTop}>
                    <img src={scopeImages.top[0]} alt="Project work 1" className={styles.gridImage} />
                    <img src={scopeImages.top[1]} alt="Project work 2" className={styles.gridImage} />
                </div>
                <img src={scopeImages.bottom} alt="Project work 3" className={styles.gridImageBottom} />
            </div>
        </section>
    );
}
