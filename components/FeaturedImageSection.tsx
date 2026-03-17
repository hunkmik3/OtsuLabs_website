import Image from "next/image";
import styles from "./featured-image.module.css";
import ScrollReveal from "./ScrollReveal";

export default function FeaturedImageSection() {
    return (
        <section className={styles.section}>
            <ScrollReveal animation="scale" duration={1} threshold={0.1}>
            <div className={styles.imageContainer}>
                <img
                    src="/images/home/feature_image.png"
                    alt="Featured Content"
                    className={styles.placeholderImage}
                />

                {/* Desktop layout */}
                <div className={`${styles.textOverlay} ${styles.desktopOverlay}`}>
                    <div className={styles.row}>
                        <span className={styles.pill}>Just a bunch</span>
                        <span className={styles.pill}>of anime nerds 🐱</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.pill}>making content for</span>
                        <span className={styles.pill}>the modern-day audience.</span>
                    </div>
                </div>

                {/* Mobile layout - zigzag */}
                <div className={`${styles.textOverlay} ${styles.mobileOverlay}`}>
                    <div className={styles.rowLeft}>
                        <span className={styles.pill}>Just a bunch</span>
                    </div>
                    <div className={styles.rowRight}>
                        <span className={styles.pill}>of anime nerds 🐱</span>
                    </div>
                    <div className={styles.rowRight}>
                        <span className={styles.pill}>making content for</span>
                    </div>
                    <div className={styles.rowLeft}>
                        <span className={styles.pill}>the modern-day audience.</span>
                    </div>
                </div>
            </div>
            </ScrollReveal>
        </section>
    );
}
