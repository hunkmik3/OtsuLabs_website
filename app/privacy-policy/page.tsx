import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import FooterSection from "@/components/FooterSection";
import styles from "./privacy-policy.module.css";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("privacyPolicy"));

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Privacy Policy</h1>
                <p>
                    We respect your privacy and will not collect personal information on this website without your
                    permission. Any information you provide will be confidential, following data protection laws. We
                    will not sell or disclose your information to others.
                </p>
                <p>
                    This site uses cookies to give you the best possible user experience. Cookies are stored in your
                    browser and help us recognize you when you come back. They also assist our team in understanding
                    which parts of the site you find most helpful.
                </p>
                <p>
                    This Privacy Policy statement applies to our website (www.otsulabs.com) only, and we are not
                    responsible for other websites&apos; content or privacy practices.
                </p>
                <p>
                    We may update this Privacy Policy from time to time to notify about changes in our practices or
                    for other operational, legal, or regulatory reasons. All the changes will be reflected on this page.
                </p>
                <p>
                    Thank you for visiting our website! If you have any questions, feel free to reach out:{" "}
                    <a href="mailto:contact@otsulabs.com">contact@otsulabs.com</a>.
                </p>
            </main>
            <FooterSection />
        </div>
    );
}
