import styles from "./contact.module.css";
import ScrollReveal from "./ScrollReveal";

export default function ContactSection() {
    return (
        <section className={styles.section}>
            <ScrollReveal>
                <div className={styles.badge}>LET US KNOW</div>
            </ScrollReveal>

            <div className={styles.content}>
                <ScrollReveal delay={0.1}>
                    <h2 className={styles.heading}>
                        Start a conversation<br />
                        about a new business<br />
                        or media inquiries.
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div className={styles.formWrapper}>
                        <form className={styles.form} id="contactForm">
                            <input type="text" placeholder="YOUR NAME" className={styles.input} />
                            <input type="email" placeholder="YOUR EMAIL" className={styles.input} />
                            <input type="text" placeholder="HOW CAN WE HELP?" className={styles.input} />

                            <div className={styles.fileUpload}>
                                <span className={styles.paperclip}>📎</span>
                                <span>UPLOAD FILE</span>
                            </div>
                        </form>
                    </div>
                </ScrollReveal>
            </div>

            <button className={styles.submitButton} type="submit" form="contactForm">
                <div className={styles.marqueeTrack}>
                    <div className={styles.marqueeText}>
                        <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline />
                    </div>
                    <div className={styles.marqueeText} aria-hidden="true">
                        <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline /> <span className={styles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={styles.videoIcon} autoPlay loop muted playsInline />
                    </div>
                </div>
            </button>
        </section>
    );
}
