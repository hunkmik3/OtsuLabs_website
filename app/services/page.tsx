import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPriorityServices } from "@/lib/seo-content/services";
import styles from "./services.module.css";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import { buildSeoSchema } from "@/lib/seo/schema";

export function generateMetadata(): Metadata {
    const isPublic = isExpandedContentPublic();
    const source = getStaticPageSeo("services");

    return buildSeoMetadata({
        ...source,
        forceNoindex: !isPublic,
        forceNofollow: !isPublic,
    });
}

export default function ServicesPage() {
    if (!isExpandedContentPublic()) {
        notFound();
    }

    const services = getPriorityServices();
    const source = getStaticPageSeo("services");

    const schema = buildSeoSchema({
        path: source.path,
        title: source.displayTitle,
        description: source.displayDescription,
        seo: source.seo,
        pageImage: source.pageImage,
    });

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

                <section className={styles.hero}>
                    <p className={styles.eyebrow}>Services</p>
                    <h1 className={styles.title}>Animation Services Built for Launch Results</h1>
                    <p className={styles.description}>
                        Otsu Labs partners with games, startups, and brands to produce anime-style animation that
                        balances visual impact with campaign performance.
                    </p>
                </section>

                <section className={styles.gridSection} aria-label="Service pages">
                    <div className={styles.grid}>
                        {services.map((service) => (
                            <article key={service.slug} className={styles.card}>
                                <p className={styles.keywordLabel}>Primary keyword: {service.primaryKeyword}</p>
                                <h2 className={styles.cardTitle}>{service.name}</h2>
                                <p className={styles.cardDescription}>{service.heroIntro}</p>
                                <p className={styles.intent}>Intent: {service.searchIntent}</p>
                                <Link href={`/services/${service.slug}`} className={styles.cardCta}>
                                    Explore Service
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
