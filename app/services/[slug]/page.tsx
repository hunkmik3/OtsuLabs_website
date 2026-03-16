import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsWithCmsFallback } from "@/lib/cms/fallback";
import { getAllBlogPosts } from "@/lib/seo-content/blog";
import { getAllServices, getServiceBySlug } from "@/lib/seo-content/services";
import styles from "./service-detail.module.css";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { buildSeoSchema } from "@/lib/seo/schema";
import { getServiceSeoFields } from "@/lib/seo/adapters";

interface ServiceDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    if (!isExpandedContentPublic()) {
        return [];
    }

    return getAllServices().map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    const isPublic = isExpandedContentPublic();

    if (!isPublic) {
        return buildSeoMetadata({
            path: `/services/${slug}`,
            displayTitle: "Service Not Available",
            displayDescription: "This page is not currently available.",
            seo: {
                slug,
                noindex: true,
                nofollow: true,
                includeInSitemap: false,
                schemaType: "webPage",
            },
            forceNoindex: true,
            forceNofollow: true,
        });
    }

    if (!service) {
        return buildSeoMetadata({
            path: `/services/${slug}`,
            displayTitle: "Service Not Found",
            displayDescription: "Requested service page could not be found.",
            seo: {
                slug,
                noindex: true,
                nofollow: true,
                includeInSitemap: false,
                schemaType: "webPage",
            },
            forceNoindex: true,
            forceNofollow: true,
        });
    }

    return buildSeoMetadata({
        path: `/services/${service.slug}`,
        displayTitle: service.heroTitle,
        displayDescription: service.heroIntro,
        seo: getServiceSeoFields(service),
        pageImage: service.seo.ogImage,
        forceNoindex: !isPublic,
        forceNofollow: !isPublic,
    });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    if (!isExpandedContentPublic()) {
        notFound();
    }

    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) {
        notFound();
    }

    const allProjects = await getProjectsWithCmsFallback();
    const relatedWork = service.relatedWorkSlugs
        .map((workSlug) => allProjects.find((project) => project.slug === workSlug))
        .filter((project): project is NonNullable<typeof project> => !!project);

    const relatedPosts = getAllBlogPosts().filter((post) => service.relatedBlogSlugs.includes(post.slug));

    const seo = getServiceSeoFields(service);
    const schema = buildSeoSchema({
        path: `/services/${service.slug}`,
        title: service.name,
        description: seo.metaDescription || service.heroIntro,
        seo,
        pageImage: seo.ogImage,
        serviceType: service.primaryKeyword,
    });

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

                <section className={styles.hero}>
                    <p className={styles.eyebrow}>Service</p>
                    <h1 className={styles.title}>{service.heroTitle}</h1>
                    <p className={styles.intro}>{service.heroIntro}</p>
                    <p className={styles.definition}>{service.serviceDefinition}</p>
                </section>

                <section className={styles.panel}>
                    <h2 className={styles.sectionHeading}>Common use cases</h2>
                    <ul className={styles.list}>
                        {service.useCases.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.panel}>
                    <h2 className={styles.sectionHeading}>Workflow</h2>
                    <ol className={styles.processList}>
                        {service.process.map((step) => (
                            <li key={step.title}>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={styles.twoCol}>
                    <article className={styles.panel}>
                        <h2 className={styles.sectionHeading}>Deliverables</h2>
                        <ul className={styles.list}>
                            {service.deliverables.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    <article className={styles.panel}>
                        <h2 className={styles.sectionHeading}>Why choose Otsu Labs</h2>
                        <ul className={styles.list}>
                            {service.whyOtsu.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                </section>

                <section className={styles.panel}>
                    <h2 className={styles.sectionHeading}>Related work</h2>
                    <div className={styles.relatedGrid}>
                        {relatedWork.map((project) => (
                            <Link key={project.slug} href={`/work/${project.slug}`} className={styles.relatedCard}>
                                <img src={project.image} alt={project.projectTitle} className={styles.relatedImage} />
                                <div>
                                    <p className={styles.relatedTitle}>{project.projectTitle}</p>
                                    <p className={styles.relatedMeta}>{project.scope}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.panel}>
                    <h2 className={styles.sectionHeading}>Read next</h2>
                    <ul className={styles.linkList}>
                        {relatedPosts.map((post) => (
                            <li key={post.slug}>
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.ctaPanel}>
                    <h2>{service.ctaTitle}</h2>
                    <p>{service.ctaDescription}</p>
                    <Link href="/contact" className={styles.ctaButton}>
                        {service.ctaLabel}
                    </Link>
                </section>
            </main>
        </div>
    );
}
