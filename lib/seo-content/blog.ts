import type { BlogPostContentModel, RawBlogPostContentModel } from "@/lib/seo-content/types";

const normalizeSeoFields = (item: RawBlogPostContentModel): BlogPostContentModel["seo"] => ({
    slug: item.slug,
    seoTitle: item.seoTitle || item.title,
    metaDescription: item.seoDescription || item.excerpt,
    canonicalUrl: item.canonical,
    noindex: item.noindex ?? false,
    nofollow: item.nofollow ?? false,
    ogTitle: item.ogTitle || item.seoTitle || item.title,
    ogDescription: item.ogDescription || item.seoDescription || item.excerpt,
    ogImage: item.ogImage || item.seoImage,
    includeInSitemap: item.includeInSitemap ?? true,
    schemaType: item.schemaType || "article",
});

const toBlogPostContentModel = (raw: RawBlogPostContentModel): BlogPostContentModel => {
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

const rawPosts: RawBlogPostContentModel[] = [
    {
        slug: "what-is-anime-style-animation",
        title: "What Is Anime-Style Animation and Why Brands Use It",
        primaryKeyword: "what is anime style animation",
        searchIntent: "informational",
        excerpt:
            "A practical guide to anime-style animation for marketing teams, product owners, and game studios deciding whether this style fits their launch goals.",
        publishedAt: "2026-03-14",
        updatedAt: "2026-03-14",
        readingMinutes: 7,
        intro:
            "Anime-style animation is no longer niche fan content. For games, startups, and digital brands, it has become a high-attention storytelling format that blends emotion, velocity, and character-driven identity.",
        sections: [
            {
                heading: "What defines anime-style animation in commercial work?",
                paragraphs: [
                    "In production terms, anime-style animation combines stylized character design, expressive posing, cinematic framing, and deliberate pacing to create emotional momentum.",
                    "For commercial campaigns, the key is not copying a specific show aesthetic. It is adapting anime language to brand voice, product message, and audience expectations.",
                ],
                bullets: [
                    "Character-first storytelling",
                    "Cinematic composition and dramatic transitions",
                    "Memorable color scripting and mood direction",
                    "Motion designed for both long-form and short-form edits",
                ],
            },
            {
                heading: "When anime-style animation works best",
                paragraphs: [
                    "This style performs best when your campaign needs worldbuilding, community identity, or emotional retention beyond pure feature explanation.",
                    "It is especially effective for game reveals, IP launches, and startup narratives where tone and memorability matter as much as clarity.",
                ],
            },
            {
                heading: "How to brief an anime-style studio",
                paragraphs: [
                    "A strong brief should include your campaign objective, target audience, distribution channels, timing constraints, and visual references that match the mood you want.",
                    "If you can define your launch timeline and core conversion action early, the studio can design a production plan that avoids expensive late revisions.",
                ],
            },
        ],
        relatedServiceSlugs: ["anime-animation-studio", "commercial-animation"],
        relatedWorkSlugs: ["pixelmon", "ronin-labs"],
        ctaTitle: "Need anime-style animation for your next campaign?",
        ctaDescription: "Talk to Otsu Labs about scope, timeline, and the right production format for your launch.",
        ctaLabel: "Discuss Your Project",
        seoTitle: "What Is Anime-Style Animation? A Practical Guide for Brands and Game Teams",
        seoDescription:
            "Learn what anime-style animation is, when it works best, and how to brief a studio for campaigns, game trailers, and product storytelling.",
        seoImage: "/images/home/selected_works_1.png",
    },
    {
        slug: "how-much-does-animation-cost",
        title: "How Much Does Animation Cost? Budgeting for Studio-Quality Production",
        primaryKeyword: "how much does animation cost",
        searchIntent: "commercial-investigation",
        excerpt:
            "Understand the biggest cost drivers in animation production and how to scope a realistic budget without compromising launch quality.",
        publishedAt: "2026-03-14",
        updatedAt: "2026-03-14",
        readingMinutes: 8,
        intro:
            "Animation pricing varies because production scope varies. Duration alone does not define cost. Complexity, revisions, visual style, and delivery requirements often have greater budget impact.",
        sections: [
            {
                heading: "The 5 biggest cost drivers",
                paragraphs: [
                    "Most budgets are shaped by five factors: concept complexity, asset count, shot count, animation fidelity, and delivery variants.",
                    "When these are defined early, teams avoid cost drift and can compare proposals fairly.",
                ],
                bullets: [
                    "Creative complexity and number of scenes",
                    "Character/environment design workload",
                    "Level of animation detail and effects",
                    "Revision rounds and approval process",
                    "Export variants for social, web, and paid media",
                ],
            },
            {
                heading: "How to budget by campaign stage",
                paragraphs: [
                    "Early-stage startups often begin with one hero asset plus cutdowns. Growth teams may add variant systems for paid media testing. Established brands usually require broader deliverable sets with strict review workflows.",
                    "Choosing the right package for your stage is often more effective than asking for maximum scope from day one.",
                ],
            },
            {
                heading: "How to get an accurate quote",
                paragraphs: [
                    "Provide your objective, target runtime, channels, launch date, and examples of quality level. This allows studios to quote based on real production assumptions.",
                    "If timeline is tight, ask for phase-based options: hero deliverable first, then optional expansion assets.",
                ],
            },
        ],
        relatedServiceSlugs: ["product-animation", "2d-animation-production"],
        relatedWorkSlugs: ["nova-thera", "aether-studios"],
        ctaTitle: "Want a realistic budget and timeline for your animation project?",
        ctaDescription: "Send your brief and target launch date. We can propose a scoped plan with clear milestone options.",
        ctaLabel: "Get a Cost Estimate",
        seoTitle: "How Much Does Animation Cost? Budget Guide for Startups, Games, and Brands",
        seoDescription:
            "Learn animation pricing factors, budget ranges, and how to scope studio-quality production for launch campaigns and trailers.",
        seoImage: "/images/home/hero_banner.png",
    },
    {
        slug: "how-to-make-a-game-trailer",
        title: "How to Make a Game Trailer That Converts Viewers Into Players",
        primaryKeyword: "how to make a game trailer",
        searchIntent: "informational",
        excerpt:
            "A production-first framework for making game trailers that combine story, pacing, and platform strategy for launch impact.",
        publishedAt: "2026-03-14",
        updatedAt: "2026-03-14",
        readingMinutes: 9,
        intro:
            "Great game trailers do not just look good. They are structured to build curiosity, show payoff, and drive a clear next action at the right moment.",
        sections: [
            {
                heading: "Start with trailer objective, not shots",
                paragraphs: [
                    "Before editing or animation, decide the trailer's job: reveal, launch conversion, update hype, or community re-engagement.",
                    "Each objective changes pacing, information density, and call-to-action placement.",
                ],
            },
            {
                heading: "Use a simple high-performing trailer structure",
                paragraphs: [
                    "Most high-performing trailers follow an arc: hook, world signal, escalation, payoff, and final CTA.",
                    "This structure keeps retention while still delivering brand and gameplay identity.",
                ],
                bullets: [
                    "0–3s hook: visual or emotional interruption",
                    "3–12s world + tone setup",
                    "12–30s escalation and key moments",
                    "30s+ climax and action CTA",
                ],
            },
            {
                heading: "Build for platform context",
                paragraphs: [
                    "A trailer for Steam page conversion and one for short-form social rarely share the same cut. Plan derivatives from the start.",
                    "Designing a master + variant workflow early saves cost and improves campaign consistency.",
                ],
            },
        ],
        relatedServiceSlugs: ["game-trailer-animation", "anime-animation-studio"],
        relatedWorkSlugs: ["pixelmon", "nova-thera"],
        ctaTitle: "Preparing a reveal or launch trailer?",
        ctaDescription: "We can help you structure the story and production pipeline to maximize watch-time and conversion.",
        ctaLabel: "Plan My Trailer",
        seoTitle: "How to Make a Game Trailer: Structure, Pacing, and Production Workflow",
        seoDescription:
            "Learn how to plan and produce a game trailer with stronger hooks, story pacing, and channel-ready variants for launch campaigns.",
        seoImage: "/images/home/feature_image.png",
    },
];

const posts: BlogPostContentModel[] = rawPosts.map(toBlogPostContentModel);

export const getAllBlogPosts = (): BlogPostContentModel[] => posts;

export const getBlogPostBySlug = (slug: string): BlogPostContentModel | undefined =>
    posts.find((post) => post.slug === slug);
