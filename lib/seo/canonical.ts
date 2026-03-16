interface ResolveCanonicalInput {
    canonicalUrl?: string;
    path?: string;
    slug?: string;
    prefix?: string;
}

const normalizePath = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "/";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return withSlash === "/" ? "/" : withSlash.replace(/\/+$/, "");
};

export const resolveCanonicalPath = ({
    canonicalUrl,
    path,
    slug,
    prefix = "",
}: ResolveCanonicalInput): string => {
    if (canonicalUrl && canonicalUrl.trim().length > 0) {
        return normalizePath(canonicalUrl);
    }

    if (path && path.trim().length > 0) {
        return normalizePath(path);
    }

    if (slug && slug.trim().length > 0) {
        return normalizePath(`${prefix}/${slug}`);
    }

    return "/";
};

