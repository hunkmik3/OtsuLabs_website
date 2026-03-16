import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import styles from "./privacy-policy.module.css";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("privacyPolicy"));

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Privacy Policy</h1>
                <p>
                    Otsu Labs respects your privacy. If you contact us through this website, we only use your submitted
                    information to respond to your request and discuss project-related communication.
                </p>
                <p>
                    We do not sell personal data. We may use analytics and infrastructure providers to operate and improve
                    website performance. For privacy requests, email <a href="mailto:contact@otsulabs.com">contact@otsulabs.com</a>.
                </p>
            </main>
        </div>
    );
}
