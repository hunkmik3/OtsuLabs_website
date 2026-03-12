import Image from "next/image";
import styles from "./mentions.module.css";

export default function MentionsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.badge}>MENTIONS</div>

            <div className={styles.textBlock}>
                <h2 className={styles.heading}>Annecy 2025</h2>
                <p className={styles.description}>
                    Proudly represented Vietnam at<br />
                    Annecy 2025, including as a panelist<br />
                    at the WIA World Summit.
                </p>
            </div>

            <div className={styles.imageRow}>
                <div className={styles.imageLeft}>
                    <Image
                        src="/images/about/image/mention_image.png"
                        alt="Annecy 2025 - OtsuLabs artwork left"
                        width={1920}
                        height={554}
                        className={styles.imageLeftImg}
                    />
                </div>
                <div className={styles.imageRight}>
                    <Image
                        src="/images/about/image/mention_image.png"
                        alt="Annecy 2025 - OtsuLabs artwork right"
                        width={1920}
                        height={554}
                        className={styles.imageRightImg}
                    />
                </div>
            </div>
        </section>
    );
}
