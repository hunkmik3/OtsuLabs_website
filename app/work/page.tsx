import styles from "./work.module.css";
import contactStyles from "@/components/contact.module.css";
import WorkShowcase from "@/components/work/WorkShowcase";
import FooterSection from "@/components/FooterSection";

export default function WorkPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <WorkShowcase />
                <section className={`${contactStyles.section} ${contactStyles.sectionSpacingRegular}`}>
                    <button className={`${contactStyles.submitButton} ${contactStyles.submitButtonNoTopMargin}`}>
                        <div className={contactStyles.marqueeTrack}>
                            <div className={contactStyles.marqueeText}>
                                <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline />
                            </div>
                            <div className={contactStyles.marqueeText} aria-hidden="true">
                                <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline /> <span className={contactStyles.marqueeItem}>Let&apos;s roll</span> <video src="/images/home/otsu cat.mp4" className={contactStyles.videoIcon} autoPlay loop muted playsInline />
                            </div>
                        </div>
                    </button>
                </section>
                <FooterSection />
            </main>
        </div>
    );
}
