import type { SeoFields } from "@/lib/seo/types";

export type StaticSeoPageKey =
    | "home"
    | "about"
    | "work"
    | "contact"
    | "privacyPolicy"
    | "cookiesPolicy"
    | "terms"
    | "services"
    | "blog"
    | "contactThankYou";

interface StaticPageSeoDefinition {
    key: StaticSeoPageKey;
    path: string;
    displayTitle: string;
    displayDescription: string;
    pageImage?: SeoFields["ogImage"];
    seo: Partial<SeoFields>;
    requiresExpandedContentPublic?: boolean;
}

const staticPages: Record<StaticSeoPageKey, StaticPageSeoDefinition> = {
    home: {
        key: "home",
        path: "/",
        displayTitle: "Anime-Style Animation Studio",
        displayDescription:
            "Otsu Labs creates anime-style product animation, game trailers, and anime commercials for games, startups, and brands.",
        seo: {
            slug: "",
            schemaType: "webPage",
            includeInSitemap: true,
        },
        pageImage: "/images/home/hero_banner.png",
    },
    about: {
        key: "about",
        path: "/about",
        displayTitle: "About",
        displayDescription:
            "Meet Otsu Labs, an anime-focused animation studio delivering production-ready visual storytelling for brands, games, and startups.",
        seo: {
            slug: "about",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    work: {
        key: "work",
        path: "/work",
        displayTitle: "Work",
        displayDescription:
            "Explore Otsu Labs animation portfolio: anime commercials, game trailers, product animation, and end-to-end production case studies.",
        seo: {
            slug: "work",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    contact: {
        key: "contact",
        path: "/contact",
        displayTitle: "Contact",
        displayDescription:
            "Contact Otsu Labs for anime-style animation projects, including product animation, game trailers, and commercial campaigns.",
        seo: {
            slug: "contact",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    privacyPolicy: {
        key: "privacyPolicy",
        path: "/privacy-policy",
        displayTitle: "Privacy Policy",
        displayDescription:
            "Read the Otsu Labs privacy policy for website usage, contact data, and communication handling.",
        seo: {
            slug: "privacy-policy",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    cookiesPolicy: {
        key: "cookiesPolicy",
        path: "/cookies-policy",
        displayTitle: "Cookies Policy",
        displayDescription: "Review how Otsu Labs uses cookies and related technologies on this website.",
        seo: {
            slug: "cookies-policy",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    terms: {
        key: "terms",
        path: "/terms",
        displayTitle: "Terms of Use",
        displayDescription: "Read the terms governing use of the Otsu Labs website and related communications.",
        seo: {
            slug: "terms",
            schemaType: "webPage",
            includeInSitemap: true,
        },
    },
    services: {
        key: "services",
        path: "/services",
        displayTitle: "Services",
        displayDescription:
            "Explore Otsu Labs services: anime animation, game trailer production, product animation, and commercial animation for games, startups, and brands.",
        seo: {
            slug: "services",
            schemaType: "webPage",
            includeInSitemap: true,
        },
        requiresExpandedContentPublic: true,
    },
    blog: {
        key: "blog",
        path: "/blog",
        displayTitle: "Blog",
        displayDescription:
            "Insights from Otsu Labs on anime-style animation, game trailer production, pricing strategy, and production workflows.",
        seo: {
            slug: "blog",
            schemaType: "webPage",
            includeInSitemap: true,
        },
        requiresExpandedContentPublic: true,
    },
    contactThankYou: {
        key: "contactThankYou",
        path: "/contact/thank-you",
        displayTitle: "Thank You",
        displayDescription: "Thank you for contacting Otsu Labs. Our team will get back to you soon.",
        seo: {
            slug: "contact/thank-you",
            schemaType: "webPage",
            noindex: true,
            nofollow: true,
            includeInSitemap: false,
        },
    },
};

export const getStaticPageSeo = (key: StaticSeoPageKey): StaticPageSeoDefinition => staticPages[key];

export const getAllStaticPageSeo = (): StaticPageSeoDefinition[] => Object.values(staticPages);

export const getSitemapStaticPageSeo = (options?: { includeExpandedContent?: boolean }) => {
    const includeExpandedContent = options?.includeExpandedContent ?? false;

    return getAllStaticPageSeo().filter((page) => {
        const includeInSitemap = page.seo.includeInSitemap ?? true;
        if (!includeInSitemap) return false;
        if (page.requiresExpandedContentPublic && !includeExpandedContent) return false;
        if (page.seo.noindex) return false;
        return true;
    });
};

