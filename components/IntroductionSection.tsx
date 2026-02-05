import Image from "next/image";
import styles from "./introduction.module.css";

export default function IntroductionSection() {
    return (
        <section className={styles.introSection}>
            <div className={styles.introContent}>
                <div className={styles.introTextWrapper}>
                    <span className={styles.badge}>INTRODUCTION</span>
                    <p className={styles.introText}>
                        We are a lab for world class <br />storytelling. Thousands of <br />seconds of animation <br />shipped. 100M+ views <br />and climbing.
                    </p>
                </div>

                {/* Character image */}
                <div className={styles.introImageWrapper}>
                    <Image
                        src="/images/home/banner_production.png"
                        alt="Animation production"
                        width={1110}
                        height={1139}
                        className={styles.introImage}
                    />
                </div>
            </div>
        </section>
    );
}
