import Image from "next/image";
import styles from "./who-we-are.module.css";
import ScrollReveal from "../ScrollReveal";

export default function WhoWeAreSection() {
    return (
        <section className={styles.section}>
            <ScrollReveal>
                <div className={styles.badge}>WHO WE ARE</div>

                <h1 className={styles.heading}>
                    <span className={styles.headingDesktop}>
                        Animators, artists,<br />
                        storytellers, producers,<br />
                        and just weebs.
                    </span>
                    <span className={styles.headingMobile}>
                        Animators, artists,<br />
                        storytellers,<br />
                        producers, and just<br />
                        weebs.
                    </span>
                </h1>
            </ScrollReveal>

            <div className={styles.content}>
                <ScrollReveal delay={0.1}>
                <div className={styles.textColumn}>
                    <p className={styles.paragraph}>
                        <span className={styles.textDesktop}>
                            We are a group of independent<br />
                            creators pushing the boundaries of<br />
                            visual storytelling.
                        </span>
                        <span className={styles.textMobile}>
                            We are a group of independent creators pushing the
                            boundaries of visual storytelling.
                        </span>
                    </p>
                    <p className={styles.paragraph}>
                        <span className={styles.textDesktop}>
                            Across borders and backgrounds,<br />
                            we&apos;re bound by one obsession: anime.<br />
                            Lots of cultures, one creative force.
                        </span>
                        <span className={styles.textMobile}>
                            Across borders and backgrounds, we&apos;re bound by one
                            obsession: anime. Lots of cultures, one creative force.
                        </span>
                    </p>
                </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2} animation="scale" className={styles.imageColumn}>
                    <Image
                        src="/images/about/image/about_banner.png"
                        alt="OtsuLabs team at work"
                        width={1200}
                        height={900}
                        className={styles.image}
                        priority
                    />
                </ScrollReveal>
            </div>
        </section>
    );
}
