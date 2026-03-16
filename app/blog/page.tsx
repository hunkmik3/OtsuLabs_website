import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts } from "@/lib/seo-content/blog";
import styles from "./blog.module.css";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getStaticPageSeo } from "@/lib/seo/page-seo";
import { buildSeoSchema } from "@/lib/seo/schema";

export function generateMetadata(): Metadata {
    const isPublic = isExpandedContentPublic();
    const source = getStaticPageSeo("blog");

    return buildSeoMetadata({
        ...source,
        forceNoindex: !isPublic,
        forceNofollow: !isPublic,
    });
}

export default function BlogPage() {
    if (!isExpandedContentPublic()) {
        notFound();
    }

    const posts = getAllBlogPosts();
    const source = getStaticPageSeo("blog");
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
                    <p className={styles.eyebrow}>Blog</p>
                    <h1 className={styles.title}>Animation Insights for Teams Preparing Their Next Launch</h1>
                    <p className={styles.description}>
                        Practical guides from Otsu Labs on anime-style production, game trailer strategy, and campaign-ready
                        animation planning.
                    </p>
                </section>

                <section className={styles.grid} aria-label="Blog articles">
                    {posts.map((post) => (
                        <article key={post.slug} className={styles.card}>
                            <p className={styles.meta}>
                                {post.readingMinutes} min read · Keyword: {post.primaryKeyword}
                            </p>
                            <h2 className={styles.cardTitle}>
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className={styles.cardExcerpt}>{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                                Read article
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}
