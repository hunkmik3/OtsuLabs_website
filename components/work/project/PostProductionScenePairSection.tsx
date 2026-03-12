import styles from './project.module.css';

interface PostProductionScenePairSectionProps {
    leftImage: string;
    rightImage: string;
    caption: string;
}

export default function PostProductionScenePairSection({
    leftImage,
    rightImage,
    caption,
}: PostProductionScenePairSectionProps) {
    return (
        <section className={styles.postProductionScenePairSection}>
            <div className={styles.postProductionScenePairGrid}>
                <div className={styles.postProductionScenePairLeft}>
                    <img
                        src={leftImage}
                        alt="Scene preview left"
                        className={styles.postProductionScenePairLeftImage}
                    />
                </div>

                <div className={styles.postProductionScenePairRight}>
                    <div className={styles.postProductionScenePairRightMedia}>
                        <img
                            src={rightImage}
                            alt="Scene preview right"
                            className={styles.postProductionScenePairRightImage}
                        />
                    </div>
                    <p className={styles.postProductionScenePairCaption}>{caption}</p>
                </div>
            </div>
        </section>
    );
}
