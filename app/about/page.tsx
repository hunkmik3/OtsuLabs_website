import styles from "./about.module.css";
import contactStyles from "@/components/contact.module.css";
import WhoWeAreSection from "@/components/about/WhoWeAreSection";
import MentionsSection from "@/components/about/MentionsSection";
import OtsuHasPackedSection from "@/components/about/OtsuHasPackedSection";
import LeadershipTeamSection from "@/components/about/LeadershipTeamSection";
import FooterSection from "@/components/FooterSection";

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <WhoWeAreSection />
                <MentionsSection />
                <OtsuHasPackedSection />
                <LeadershipTeamSection />
                <section className={contactStyles.section} style={{ padding: '350px 48px 100px' }}>
                    <button className={contactStyles.submitButton} style={{ marginTop: 0 }}>
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
