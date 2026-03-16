import { getCmsConfig } from "@/lib/cms/config";

const LOCAL_SITE_URL = "http://localhost:3000";

const normalizeUrl = (candidate: string | undefined): string => {
    const value = candidate?.trim();
    if (!value) return LOCAL_SITE_URL;
    try {
        return new URL(value).toString().replace(/\/+$/, "");
    } catch {
        return LOCAL_SITE_URL;
    }
};

export const getSiteUrl = (): string => {
    const cmsBaseUrl = getCmsConfig().app.baseUrl;
    return normalizeUrl(cmsBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || LOCAL_SITE_URL);
};

export const getSiteUrlObject = (): URL => {
    return new URL(getSiteUrl());
};

export const toAbsoluteUrl = (path: string): string => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const safePath = path.startsWith("/") ? path : `/${path}`;
    return new URL(safePath, `${getSiteUrl()}/`).toString();
};
