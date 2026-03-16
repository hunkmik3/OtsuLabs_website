import styles from "./project.module.css";

interface PostExplorationGallerySectionProps {
    primaryImage: string;
    secondaryImage: string;
    caption: string;
}

export default function PostExplorationGallerySection({
    primaryImage,
    secondaryImage,
    caption,
}: PostExplorationGallerySectionProps) {
    if (!primaryImage && !secondaryImage) {
        return null;
    }

    return (
        <section className={styles.postExplorationSection}>
            <div className={`${styles.postExplorationGallery} ${styles.postExplorationGalleryNoTopMargin}`}>
                {primaryImage && (
                    <div className={styles.postExplorationPrimary}>
                        <img
                            src={primaryImage}
                            alt="Primary concept artwork"
                            className={styles.postExplorationPrimaryImage}
                        />
                        {caption && <p className={styles.postExplorationCaption}>{caption}</p>}
                    </div>
                )}
                {secondaryImage && (
                    <div className={styles.postExplorationSecondary}>
                        <img
                            src={secondaryImage}
                            alt="Secondary concept artwork"
                            className={styles.postExplorationSecondaryImage}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
