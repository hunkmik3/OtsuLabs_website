import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import styles from "@/app/privacy-policy/privacy-policy.module.css";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("cookiesPolicy"));

export default function CookiesPolicyPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Cookies Policy</h1>
                <p>
                    Otsu Labs uses essential cookies and similar technologies to keep this website functional and improve
                    performance. These technologies help us understand usage patterns and maintain a stable user experience.
                </p>
                <p>
                    By continuing to use this website, you agree to this cookies policy. If you need additional details,
                    contact <a href="mailto:contact@otsulabs.com">contact@otsulabs.com</a>.
                </p>
            </main>
        </div>
    );
}
