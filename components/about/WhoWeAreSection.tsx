import Image from "next/image";
import styles from "./who-we-are.module.css";

export default function WhoWeAreSection() {
    return (
        <section className={styles.section}>
            <div className={styles.badge}>WHO WE ARE</div>

            <h1 className={styles.heading}>
                Animators, artists,<br />
                storytellers, producers,<br />
                and just weebs.
            </h1>

            <div className={styles.content}>
                <div className={styles.textColumn}>
                    <p className={styles.paragraph}>
                        We are a group of independent<br />
                        creators pushing the boundaries of<br />
                        visual storytelling.
                    </p>
                    <p className={styles.paragraph}>
                        Across borders and backgrounds,<br />
                        we&apos;re bound by one obsession: anime.<br />
                        Lots of cultures, one creative force.
                    </p>
                </div>
                <div className={styles.imageColumn}>
                    <Image
                        src="/images/about/image/about_banner.png"
                        alt="OtsuLabs team at work"
                        width={1200}
                        height={900}
                        className={styles.image}
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
