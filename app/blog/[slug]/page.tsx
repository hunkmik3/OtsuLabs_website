import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsWithCmsFallback } from "@/lib/cms/fallback";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/seo-content/blog";
import { getServiceBySlug } from "@/lib/seo-content/services";
import styles from "./blog-post.module.css";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { buildSeoSchema } from "@/lib/seo/schema";
import { getBlogPostSeoFields } from "@/lib/seo/adapters";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    if (!isExpandedContentPublic()) {
        return [];
    }

    return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    const isPublic = isExpandedContentPublic();

    if (!isPublic) {
        return buildSeoMetadata({
            path: `/blog/${slug}`,
            displayTitle: "Article Not Available",
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

    if (!post) {
        return buildSeoMetadata({
            path: `/blog/${slug}`,
            displayTitle: "Article Not Found",
            displayDescription: "Requested article could not be found.",
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
        path: `/blog/${post.slug}`,
        displayTitle: post.title,
        displayDescription: post.excerpt,
        seo: getBlogPostSeoFields(post),
        pageImage: post.seo.ogImage,
        forceNoindex: !isPublic,
        forceNofollow: !isPublic,
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    if (!isExpandedContentPublic()) {
        notFound();
    }

    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) {
        notFound();
    }

    const allProjects = await getProjectsWithCmsFallback();
    const relatedWork = post.relatedWorkSlugs
        .map((workSlug) => allProjects.find((project) => project.slug === workSlug))
        .filter((project): project is NonNullable<typeof project> => !!project);

    const relatedServices = post.relatedServiceSlugs
        .map((serviceSlug) => getServiceBySlug(serviceSlug))
        .filter((service): service is NonNullable<typeof service> => !!service);

    const seo = getBlogPostSeoFields(post);
    const schema = buildSeoSchema({
        path: `/blog/${post.slug}`,
        title: post.title,
        description: seo.metaDescription || post.excerpt,
        seo,
        pageImage: seo.ogImage,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
    });

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

                <article className={styles.article}>
                    <p className={styles.meta}>
                        {post.readingMinutes} min read · Published {post.publishedAt}
                    </p>
                    <h1 className={styles.title}>{post.title}</h1>
                    <p className={styles.intro}>{post.intro}</p>

                    {post.sections.map((section) => (
                        <section key={section.heading} className={styles.contentSection}>
                            <h2>{section.heading}</h2>
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                            {section.bullets && section.bullets.length > 0 ? (
                                <ul>
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}
                </article>

                <section className={styles.relatedSection}>
                    <h2>Related services</h2>
                    <ul className={styles.relatedList}>
                        {relatedServices.map((service) => (
                            <li key={service.slug}>
                                <Link href={`/services/${service.slug}`}>{service.name}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.relatedSection}>
                    <h2>Related work</h2>
                    <div className={styles.relatedWorkGrid}>
                        {relatedWork.map((project) => (
                            <Link key={project.slug} href={`/work/${project.slug}`} className={styles.relatedWorkCard}>
                                <img src={project.image} alt={project.projectTitle} className={styles.relatedWorkImage} />
                                <h3>{project.projectTitle}</h3>
                                <p>{project.scope}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.ctaPanel}>
                    <h2>{post.ctaTitle}</h2>
                    <p>{post.ctaDescription}</p>
                    <Link href="/contact" className={styles.ctaButton}>
                        {post.ctaLabel}
                    </Link>
                </section>
            </main>
        </div>
    );
}
