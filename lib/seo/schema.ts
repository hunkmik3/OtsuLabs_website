import { resolveCanonicalPath } from "@/lib/seo/canonical";
import { resolveOgImageAbsoluteUrl, resolveOgImagePath } from "@/lib/seo/og";
import { toAbsoluteUrl } from "@/lib/seo/site";
import type { SeoFields, SeoImageValue, SeoSchemaType } from "@/lib/seo/types";

export interface SeoSchemaSource {
    path: string;
    title: string;
    description: string;
    seo: Partial<SeoFields>;
    pageImage?: SeoImageValue;
    publishedAt?: string;
    updatedAt?: string;
    serviceType?: string;
}

const asSchemaType = (value: SeoSchemaType | undefined): SeoSchemaType => value || "webPage";

const buildBaseFields = (source: SeoSchemaSource) => {
    const url = resolveCanonicalPath({
        canonicalUrl: source.seo.canonicalUrl,
        path: source.path,
        slug: source.seo.slug,
    });
    const ogImagePath = resolveOgImagePath({
        ogImage: source.seo.ogImage,
        pageImage: source.pageImage,
    });

    return {
        url: toAbsoluteUrl(url),
        image: resolveOgImageAbsoluteUrl(ogImagePath),
    };
};

export const buildSeoSchema = (source: SeoSchemaSource): Record<string, unknown> => {
    const schemaType = asSchemaType(source.seo.schemaType);
    const base = buildBaseFields(source);

    if (schemaType === "article") {
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: source.title,
            description: source.description,
            datePublished: source.publishedAt,
            dateModified: source.updatedAt || source.publishedAt,
            mainEntityOfPage: base.url,
            image: [base.image],
            author: {
                "@type": "Organization",
                name: "Otsu Labs",
            },
            publisher: {
                "@type": "Organization",
                name: "Otsu Labs",
            },
        };
    }

    if (schemaType === "service") {
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            name: source.title,
            description: source.description,
            serviceType: source.serviceType,
            provider: {
                "@type": "Organization",
                name: "Otsu Labs",
                url: toAbsoluteUrl("/"),
            },
            areaServed: "Global",
            url: base.url,
            image: [base.image],
        };
    }

    if (schemaType === "videoObject") {
        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: source.title,
            description: source.description,
            url: base.url,
            thumbnailUrl: [base.image],
            uploadDate: source.updatedAt || source.publishedAt,
            publisher: {
                "@type": "Organization",
                name: "Otsu Labs",
                url: toAbsoluteUrl("/"),
            },
        };
    }

    if (schemaType === "creativeWork" || schemaType === "caseStudy") {
        return {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: source.title,
            description: source.description,
            url: base.url,
            image: [base.image],
            creator: {
                "@type": "Organization",
                name: "Otsu Labs",
                url: toAbsoluteUrl("/"),
            },
        };
    }

    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: source.title,
        description: source.description,
        url: base.url,
        image: [base.image],
    };
};

