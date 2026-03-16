import type { RawServiceContentModel, ServiceContentModel } from "@/lib/seo-content/types";

const normalizeSeoFields = (item: RawServiceContentModel): ServiceContentModel["seo"] => ({
    slug: item.slug,
    seoTitle: item.seoTitle || item.name,
    metaDescription: item.seoDescription || item.heroIntro,
    canonicalUrl: item.canonical,
    noindex: item.noindex ?? false,
    nofollow: item.nofollow ?? false,
    ogTitle: item.ogTitle || item.seoTitle || item.name,
    ogDescription: item.ogDescription || item.seoDescription || item.heroIntro,
    ogImage: item.ogImage || item.seoImage,
    includeInSitemap: item.includeInSitemap ?? true,
    schemaType: item.schemaType || "service",
});

const toServiceContentModel = (raw: RawServiceContentModel): ServiceContentModel => {
    const {
        seoTitle: _seoTitle,
        seoDescription: _seoDescription,
        seoImage: _seoImage,
        canonical: _canonical,
        noindex: _noindex,
        nofollow: _nofollow,
        ogTitle: _ogTitle,
        ogDescription: _ogDescription,
        ogImage: _ogImage,
        includeInSitemap: _includeInSitemap,
        schemaType: _schemaType,
        ...rest
    } = raw;

    void _seoTitle;
    void _seoDescription;
    void _seoImage;
    void _canonical;
    void _noindex;
    void _nofollow;
    void _ogTitle;
    void _ogDescription;
    void _ogImage;
    void _includeInSitemap;
    void _schemaType;

    return {
        ...rest,
        seo: normalizeSeoFields(raw),
    };
};

const rawServices: RawServiceContentModel[] = [
    {
        slug: "anime-animation-studio",
        name: "Anime Animation Studio Services",
        primaryKeyword: "anime animation studio",
        searchIntent: "commercial-investigation",
        heroTitle: "Anime-Style Animation Studio for Story-Driven Campaigns",
        heroIntro:
            "Otsu Labs helps games, startups, and brands produce anime-style stories that feel cinematic, character-led, and conversion-ready.",
        serviceDefinition:
            "This service is ideal when you need a full anime-style partner from concept and storyboard through final compositing and delivery.",
        useCases: [
            "Brand campaigns that need an anime narrative instead of a generic ad cut.",
            "IP launches where character identity and emotional tone drive retention.",
            "Community growth campaigns for web3, gaming, and entertainment products.",
        ],
        deliverables: [
            "Creative treatment and script alignment",
            "Storyboard and keyframe direction",
            "Animation and compositing",
            "Versioned exports for paid social and landing pages",
        ],
        process: [
            {
                title: "Creative Alignment",
                description:
                    "We align narrative goals, audience intent, and performance constraints before visual production starts.",
            },
            {
                title: "Pre-Production",
                description:
                    "We build visual language, character direction, and scene planning to lock the style and pacing early.",
            },
            {
                title: "Production and Finish",
                description:
                    "We execute animation, lighting, effects, and delivery formats with QC for campaign and platform readiness.",
            },
        ],
        whyOtsu: [
            "Anime-native visual direction, not just anime-inspired filters.",
            "Pipeline built for both cinematic quality and launch deadlines.",
            "Experience supporting high-visibility releases in games and digital products.",
        ],
        relatedWorkSlugs: ["pixelmon", "ronin-labs", "aether-studios"],
        relatedBlogSlugs: ["what-is-anime-style-animation", "how-to-make-a-game-trailer"],
        ctaTitle: "Need an anime-style partner for your next launch?",
        ctaDescription: "Share your brief and timeline. We will propose a production plan that fits your campaign goals.",
        ctaLabel: "Talk to Otsu Labs",
        seoTitle: "Anime Animation Studio Services for Games, Startups, and Brands",
        seoDescription:
            "Otsu Labs is an anime animation studio delivering concept-to-final production for game launches, startup campaigns, and brand storytelling.",
        seoImage: "/images/home/selected_works_1.png",
    },
    {
        slug: "game-trailer-animation",
        name: "Game Trailer Animation",
        primaryKeyword: "game trailer animation studio",
        searchIntent: "transactional",
        heroTitle: "Game Trailer Animation That Turns Worlds Into Watch-Time",
        heroIntro:
            "We produce anime-style game trailers engineered for launch windows, community hype, and platform-native distribution.",
        serviceDefinition:
            "A focused service for teams that need reveal trailers, launch trailers, and ongoing cinematic promo cuts with strong narrative framing.",
        useCases: [
            "Reveal or announcement trailers before alpha/beta milestones.",
            "Launch trailers for Steam, Epic, App Store, and social.",
            "Seasonal updates and lore-driven community videos.",
        ],
        deliverables: [
            "Trailer concept and beat board",
            "Storyboard + animatic timing",
            "Final trailer master and social cutdowns",
            "Thumbnail-ready key visuals",
        ],
        process: [
            {
                title: "Trailer Strategy",
                description:
                    "We map trailer structure around gameplay pillars, emotional beats, and CTA moments for publish platforms.",
            },
            {
                title: "Visual Build",
                description:
                    "We design scenes, transitions, and action rhythm to keep audience attention from first frame to final card.",
            },
            {
                title: "Delivery Optimization",
                description:
                    "We output master files and derivatives for launch channels with timing and readability tuned per format.",
            },
        ],
        whyOtsu: [
            "Strong game marketing understanding, not just animation execution.",
            "Battle-tested pacing for teaser, reveal, and launch trailer formats.",
            "Clear handoff workflow with product, community, and publishing teams.",
        ],
        relatedWorkSlugs: ["pixelmon", "nova-thera", "aether-studios"],
        relatedBlogSlugs: ["how-to-make-a-game-trailer", "how-much-does-animation-cost"],
        ctaTitle: "Planning a game trailer for your next milestone?",
        ctaDescription: "Send your target date and channels. We can scope a trailer package around your release plan.",
        ctaLabel: "Request Trailer Scope",
        seoTitle: "Game Trailer Animation Studio | Anime-Style Reveal and Launch Trailers",
        seoDescription:
            "Create high-impact game trailers with Otsu Labs. We produce anime-style reveal and launch trailers for studios, startups, and web3 games.",
        seoImage: "/images/home/hero_banner.png",
    },
    {
        slug: "product-animation",
        name: "Product Animation Studio",
        primaryKeyword: "product animation studio",
        searchIntent: "transactional",
        heroTitle: "Product Animation for Launches, Features, and Brand Storytelling",
        heroIntro:
            "We help product teams explain value quickly with anime-style motion content designed for conversion and memorability.",
        serviceDefinition:
            "This service combines narrative direction and production execution to make product features easy to understand and hard to forget.",
        useCases: [
            "New feature announcements and launch campaigns.",
            "Landing page hero videos for startup products.",
            "Brand storytelling clips for paid social and community channels.",
        ],
        deliverables: [
            "Message architecture and script support",
            "Explainer storyboard + visual plan",
            "Product animation master with platform cutdowns",
            "Loopable short-form assets for ads",
        ],
        process: [
            {
                title: "Message Distillation",
                description:
                    "We translate product complexity into a concise story arc tied to audience pain points and value outcomes.",
            },
            {
                title: "Visual Prototyping",
                description:
                    "We prototype scenes and motion language so teams can approve tone, clarity, and pacing before final production.",
            },
            {
                title: "Production Rollout",
                description:
                    "We finalize animation with a delivery set designed for website, paid media, and lifecycle marketing touchpoints.",
            },
        ],
        whyOtsu: [
            "Strong narrative clarity for technical and product-heavy messaging.",
            "Anime-style craft that elevates brand recall.",
            "Reusable asset strategy across multiple launch channels.",
        ],
        relatedWorkSlugs: ["ronin-labs", "nova-thera", "pixelmon"],
        relatedBlogSlugs: ["how-much-does-animation-cost", "what-is-anime-style-animation"],
        ctaTitle: "Need product animation that actually explains and converts?",
        ctaDescription: "Tell us your product stage and launch goal. We will map the right animation format and scope.",
        ctaLabel: "Start a Product Brief",
        seoTitle: "Product Animation Studio for Startups, Apps, and Digital Brands",
        seoDescription:
            "Otsu Labs creates anime-style product animation for launches, feature storytelling, and conversion-focused brand campaigns.",
        seoImage: "/images/home/feature_image.png",
    },
    {
        slug: "commercial-animation",
        name: "Commercial Animation Studio",
        primaryKeyword: "commercial animation studio",
        searchIntent: "transactional",
        heroTitle: "Commercial Animation Studio for Performance and Brand Lift",
        heroIntro:
            "We design anime-style commercials that blend narrative craft with campaign-ready structure for paid and organic channels.",
        serviceDefinition:
            "Use this service when you need high-quality animated ads that can scale from hero spots to short-form variants.",
        useCases: [
            "Brand campaigns with a hero commercial plus cutdown variants.",
            "Performance ad sets that need stronger creative differentiation.",
            "Cross-channel commercial assets for product and entertainment launches.",
        ],
        deliverables: [
            "Campaign concept and script adaptation",
            "Hero commercial production",
            "Short-form cutdowns (6s/15s/30s)",
            "Creative package for paid media teams",
        ],
        process: [
            {
                title: "Campaign Framing",
                description:
                    "We map audience segments, ad hooks, and platform constraints to build a practical production plan.",
            },
            {
                title: "Hero Spot Production",
                description:
                    "We craft the flagship commercial with cinematic quality and clear message hierarchy.",
            },
            {
                title: "Variant System",
                description:
                    "We create reusable edits and creative variants for paid social testing and ongoing optimization.",
            },
        ],
        whyOtsu: [
            "Commercial storytelling with anime craft and marketing awareness.",
            "Delivery formats built for real campaign operations.",
            "Creative consistency from hero asset to performance variants.",
        ],
        relatedWorkSlugs: ["pixelmon", "aether-studios", "nova-thera"],
        relatedBlogSlugs: ["what-is-anime-style-animation", "how-much-does-animation-cost"],
        ctaTitle: "Looking for commercial animation with stronger creative impact?",
        ctaDescription: "We can scope your hero commercial and paid-social variants in one production plan.",
        ctaLabel: "Book a Discovery Call",
        seoTitle: "Commercial Animation Studio | Anime-Style Animated Ads and Campaigns",
        seoDescription:
            "Partner with Otsu Labs for anime-style commercial animation, from hero campaign spots to short-form ad cutdowns.",
        seoImage: "/images/home/banner_production.png",
    },
    {
        slug: "2d-animation-production",
        name: "2D Animation Production",
        primaryKeyword: "2d animation studio",
        searchIntent: "commercial-investigation",
        heroTitle: "2D Animation Production Pipeline From Concept to Final Delivery",
        heroIntro:
            "Our 2D pipeline supports teams that need a dependable animation partner with clear stages, quality control, and delivery discipline.",
        serviceDefinition:
            "This service is built for clients that need full production support across pre-production, animation, compositing, and final mastering.",
        useCases: [
            "Studios that need an external production partner for peak periods.",
            "Startups requiring end-to-end execution without building an internal team.",
            "Brands launching animated campaigns with strict timelines.",
        ],
        deliverables: [
            "Production plan and milestone mapping",
            "Pre-production package (boards, keyframes, style direction)",
            "Animation + compositing outputs",
            "Master delivery and distribution variants",
        ],
        process: [
            {
                title: "Planning and Scope",
                description:
                    "We break scope into clear phases with approvals and risk checkpoints before major production spend.",
            },
            {
                title: "Execution",
                description:
                    "Our team runs animation, effects, and finishing with transparent reviews and milestone handoffs.",
            },
            {
                title: "Finalization",
                description:
                    "We finalize masters, QA the outputs, and provide platform-ready versions for launch operations.",
            },
        ],
        whyOtsu: [
            "End-to-end ownership from brief to final export.",
            "Production transparency with practical review cycles.",
            "Reliable delivery without sacrificing visual quality.",
        ],
        relatedWorkSlugs: ["pixelmon", "nova-thera", "aether-studios", "ronin-labs"],
        relatedBlogSlugs: ["how-much-does-animation-cost", "how-to-make-a-game-trailer"],
        ctaTitle: "Need a full 2D production partner, not just one-off execution?",
        ctaDescription: "Send your scope and deadline. We will recommend a phased pipeline and delivery timeline.",
        ctaLabel: "Get Production Plan",
        seoTitle: "2D Animation Studio Pipeline for Games, Startups, and Brands",
        seoDescription:
            "Otsu Labs provides end-to-end 2D animation production with anime-style direction, from pre-production to final mastering.",
        seoImage: "/images/home/hero_banner.png",
    },
];

const services: ServiceContentModel[] = rawServices.map(toServiceContentModel);

export interface ServiceSummary {
    slug: string;
    name: string;
    primaryKeyword: string;
}

export const getAllServices = (): ServiceContentModel[] => services;

export const getPriorityServices = (): ServiceContentModel[] => services.slice(0, 5);

export const getServiceBySlug = (slug: string): ServiceContentModel | undefined =>
    services.find((service) => service.slug === slug);

export const getServiceSummaries = (): ServiceSummary[] =>
    services.map((service) => ({
        slug: service.slug,
        name: service.name,
        primaryKeyword: service.primaryKeyword,
    }));

export const getRelatedServicesForWork = (workSlug: string): ServiceSummary[] =>
    services
        .filter((service) => service.relatedWorkSlugs.includes(workSlug))
        .map((service) => ({
            slug: service.slug,
            name: service.name,
            primaryKeyword: service.primaryKeyword,
        }));
