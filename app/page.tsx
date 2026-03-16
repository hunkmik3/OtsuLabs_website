import type { Metadata } from "next";
import styles from "./page.module.css";
import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import IntroductionSection from "@/components/IntroductionSection";
import VideoSection from "@/components/VideoSection";
import SelectedWorksSection from "@/components/SelectedWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FeaturedImageSection from "@/components/FeaturedImageSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("home"));

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HeroSection />
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
