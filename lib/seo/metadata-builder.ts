import type { Metadata } from "next";
import { resolveCanonicalPath } from "@/lib/seo/canonical";
import { resolveOgImageAbsoluteUrl, resolveOgImagePath } from "@/lib/seo/og";
import type { SeoFields, SeoSchemaType, SeoImageValue } from "@/lib/seo/types";

export interface SeoMetadataSource {
    path: string;
    displayTitle: string;
    displayDescription: string;
    seo: Partial<SeoFields>;
    pageImage?: SeoImageValue;
    forceNoindex?: boolean;
    forceNofollow?: boolean;
}

const asNonEmptyString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : "";

const resolveOpenGraphType = (schemaType: SeoSchemaType | undefined): "website" | "article" => {
    if (schemaType === "article") return "article";
    return "website";
};

export const buildSeoMetadata = (source: SeoMetadataSource): Metadata => {
    const title = asNonEmptyString(source.seo.seoTitle) || source.displayTitle;
    const description = asNonEmptyString(source.seo.metaDescription) || source.displayDescription;
    const canonical = resolveCanonicalPath({
        canonicalUrl: source.seo.canonicalUrl,
        path: source.path,
        slug: source.seo.slug,
    });
    const ogTitle = asNonEmptyString(source.seo.ogTitle) || title;
    const ogDescription = asNonEmptyString(source.seo.ogDescription) || description;
    const ogImagePath = resolveOgImagePath({
        ogImage: source.seo.ogImage,
        pageImage: source.pageImage,
    });
    const ogImage = resolveOgImageAbsoluteUrl(ogImagePath);

    const noindex = !!source.forceNoindex || !!source.seo.noindex;
    const nofollow = !!source.forceNofollow || !!source.seo.nofollow;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        robots: {
            index: !noindex,
            follow: !noindex && !nofollow,
        },
        openGraph: {
            type: resolveOpenGraphType(source.seo.schemaType),
            url: canonical,
            title: ogTitle,
            description: ogDescription,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [ogImage],
        },
    };
};

