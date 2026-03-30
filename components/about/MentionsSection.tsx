import Image from "next/image";
import styles from "./mentions.module.css";
import ScrollReveal from "../ScrollReveal";

export default function MentionsSection() {
    return (
        <section className={styles.section}>
            <ScrollReveal animation="fade">
                <div className={`${styles.badge} badge-animate`}>MENTIONS</div>

                <div className={styles.textBlock}>
                    <h2 className={styles.heading}>Annecy 2025</h2>
                    <p className={styles.description}>
                        <span className={styles.descDesktop}>
                            Proudly represented Vietnam at<br />
                            Annecy 2025, including as a panelist<br />
                            at the WIA World Summit.
                        </span>
                        <span className={styles.descMobile}>
                            Proudly represented Vietnam at Annecy 2025,<br />
                            including as a panelist at the WIA World Summit.
                        </span>
                    </p>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
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
            </ScrollReveal>
        </section>
    );
}
