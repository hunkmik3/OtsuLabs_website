import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import styles from "@/app/privacy-policy/privacy-policy.module.css";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("terms"));

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Terms of Use</h1>
                <p>
                    The content on this website is provided for informational purposes. All creative assets, branding,
                    and project materials remain the property of Otsu Labs or the respective rights holders unless
                    otherwise stated.
                </p>
                <p>
                    By using this website, you agree not to misuse the content or attempt unauthorized access to any
                    system connected to this service. For questions, email{" "}
                    <a href="mailto:contact@otsulabs.com">contact@otsulabs.com</a>.
                </p>
            </main>
        </div>
    );
}
