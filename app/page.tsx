import Image from "next/image";
import styles from "./page.module.css";
import ClientsSection from "@/components/ClientsSection";
import IntroductionSection from "@/components/IntroductionSection";
import VideoSection from "@/components/VideoSection";
import SelectedWorksSection from "@/components/SelectedWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FeaturedImageSection from "@/components/FeaturedImageSection";
import ContactSection from "@/components/ContactSection";

import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/home/Hero Section.png"
              alt="Hero Banner"
              width={1440}
              height={900}
              className={styles.heroImage}
              priority
            />
          </div>
        </section>
        <ClientsSection />
        <IntroductionSection />
        <VideoSection />
        <SelectedWorksSection />
        <CapabilitiesSection />
        <FeaturedImageSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}
