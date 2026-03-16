export type SeoSchemaType =
    | "creativeWork"
    | "caseStudy"
    | "article"
    | "service"
    | "videoObject"
    | "webPage";

export interface SeoImageAsset {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

export type SeoImageValue = string | SeoImageAsset;

export interface SeoFields {
    seoTitle?: string;
    metaDescription?: string;
    slug: string;
    canonicalUrl?: string;
    noindex?: boolean;
    nofollow?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SeoImageValue;
    includeInSitemap?: boolean;
    schemaType?: SeoSchemaType;
}

