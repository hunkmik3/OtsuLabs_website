import type { SeoFields, SeoSchemaType } from "@/lib/seo/types";

export interface RawSeoContentFields {
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: string;
    canonical?: string;
    noindex?: boolean;
    nofollow?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    includeInSitemap?: boolean;
    schemaType?: SeoSchemaType;
}

export interface ServiceProcessStep {
    title: string;
    description: string;
}

export interface ServiceContentModel {
    slug: string;
    name: string;
    primaryKeyword: string;
    searchIntent: "transactional" | "commercial-investigation";
    heroTitle: string;
    heroIntro: string;
    serviceDefinition: string;
    useCases: string[];
    deliverables: string[];
    process: ServiceProcessStep[];
    whyOtsu: string[];
    relatedWorkSlugs: string[];
    relatedBlogSlugs: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    seo: SeoFields;
}

export interface RawServiceContentModel extends Omit<ServiceContentModel, "seo">, RawSeoContentFields {}

export interface BlogBodySection {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface BlogPostContentModel {
    slug: string;
    title: string;
    primaryKeyword: string;
    searchIntent: "informational" | "commercial-investigation";
    excerpt: string;
    publishedAt: string;
    updatedAt: string;
    readingMinutes: number;
    intro: string;
    sections: BlogBodySection[];
    relatedServiceSlugs: string[];
    relatedWorkSlugs: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    seo: SeoFields;
}

export interface RawBlogPostContentModel extends Omit<BlogPostContentModel, "seo">, RawSeoContentFields {}

