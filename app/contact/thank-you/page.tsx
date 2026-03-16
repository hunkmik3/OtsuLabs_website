import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import Link from "next/link";
import styles from "./thank-you.module.css";

export const metadata: Metadata = buildSeoMetadata(getStaticPageSeo("contactThankYou"));

export default function ContactThankYouPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <p className={styles.eyebrow}>Contact</p>
                <h1 className={styles.title}>Thanks, we got your message.</h1>
                <p className={styles.description}>
                    Our team will review your request and get back to you with next steps.
                </p>
                <div className={styles.actions}>
                    <Link href="/work" className={styles.button}>
                        Explore Work
                    </Link>
                    <Link href="/" className={styles.buttonSecondary}>
                        Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
}
