import Image from "next/image";
import styles from "./featured-image.module.css";

export default function FeaturedImageSection() {
    return (
        <section className={styles.section}>
            <div className={styles.imageContainer}>
                <img
                    src="/images/home/feature_image.png"
                    alt="Featured Content"
                    className={styles.placeholderImage}
                />

                <div className={styles.textOverlay}>
                    <div className={styles.row}>
                        <span className={styles.pill}>Just a bunch</span>
                        <span className={styles.pill}>of anime nerds 🐱</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.pill}>making content for</span>
                        <span className={styles.pill}>the modern-day audience.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
