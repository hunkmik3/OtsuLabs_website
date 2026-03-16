import { toAbsoluteUrl } from "@/lib/seo/site";
import type { SeoImageValue } from "@/lib/seo/types";

export const DEFAULT_SITE_OG_IMAGE_PATH = "/og-image.png";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const resolveImagePath = (value?: SeoImageValue): string | undefined => {
    if (!value) return undefined;
    if (isNonEmptyString(value)) return value.trim();
    if (typeof value === "object" && isNonEmptyString(value.src)) return value.src.trim();
    return undefined;
};

export const resolveOgImagePath = ({
    ogImage,
    pageImage,
    fallbackImage = DEFAULT_SITE_OG_IMAGE_PATH,
}: {
    ogImage?: SeoImageValue;
    pageImage?: SeoImageValue;
    fallbackImage?: string;
}): string => {
    const fromSeo = resolveImagePath(ogImage);
    if (fromSeo) return fromSeo;

    const fromPage = resolveImagePath(pageImage);
    if (fromPage) return fromPage;

    return fallbackImage;
};

export const resolveOgImageAbsoluteUrl = (pathOrUrl: string): string => {
    return toAbsoluteUrl(pathOrUrl);
};

