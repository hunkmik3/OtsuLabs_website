import { createItemId, createSectionId } from "@/lib/cms/ids";
import type {
    CmsProjectDocument,
    MediaAsset,
    ProjectBasicInfo,
    ProjectSeoMeta,
    ProjectSection,
    PublishStatus,
} from "@/lib/cms/types";

export const NOVATHERA_TEMPLATE_VERSION = "1.0.0";

const image = (src: string, alt: string): MediaAsset => ({
    src,
    alt,
    type: "image",
});

const video = (src: string, alt: string, poster?: string): MediaAsset => ({
    src,
    alt,
    type: "video",
    ...(poster ? { poster } : {}),
});

const NOVATHERA_BASIC_INFO: ProjectBasicInfo = {
    title: "Nova Thera: Initiation",
    subtitle: "Pixelmon™ Official Anime Teaser",
    clientName: "Nova Thera: Initiation",
    dateLabel: "[OCTOBER, 2025]",
    animationDuration: "00:00:36",
    scopeSummary: "Character design, Storyboard, Color script, Lighting Mood, Script Writing, Concept art, Full production, Visual effects, Sound design",
    workCardImage: image("/images/home/selected_works_1.png", "Nova Thera preview"),
    workCardOverlayText:
        "Pixelmon™ Official Anime Teaser. Crafted with passion by our studio, this teaser marks the beginning of a journey, a glimpse into the heart of Pixelmon as you’ve never seen before.",
};

const NOVATHERA_SEO: ProjectSeoMeta = {
    seoTitle: "Nova Thera: Initiation | Otsu Labs",
    metaDescription:
        "Pixelmon™ Official Anime Teaser. Crafted with passion by our studio, this teaser marks the beginning of a journey, a glimpse into the heart of Pixelmon as you’ve never seen before.",
    ogTitle: "Nova Thera: Initiation | Otsu Labs",
    ogDescription:
        "Pixelmon™ Official Anime Teaser. Crafted with passion by our studio, this teaser marks the beginning of a journey, a glimpse into the heart of Pixelmon as you’ve never seen before.",
    ogImage: image("/images/home/selected_works_1.png", "Nova Thera key visual"),
    canonicalUrl: "/work/pixelmon",
    noindex: false,
    nofollow: false,
    includeInSitemap: true,
    schemaType: "caseStudy",
};

const createNovatheraSections = (): ProjectSection[] => [
    {
        id: createSectionId("hero"),
        type: "hero",
        enabled: true,
        order: 0,
        content: {
            titleText: "Nova Thera: Initiation",
            viewFullVideoLabel: "View Full Video",
            animationTimeLabel: "Animation Time",
            media: video("/images/projects/Nova%20Thera/novathrea_initiation.mp4", "Nova Thera hero video"),
            metaItems: [
                { label: "Date", value: "[OCTOBER, 2025]" },
                { label: "Client", value: "Nova Thera: Initiation" },
            ],
        },
    },
    {
        id: createSectionId("aboutProject"),
        type: "aboutProject",
        enabled: true,
        order: 1,
        content: {
            badgeLabel: "About Projects",
            description:
                "Pixelmon™ Official Anime Teaser. Crafted with passion by our studio, this teaser marks the beginning of a journey, a glimpse into the heart of Pixelmon as you’ve never seen before.",
            scopeBadgeLabel: "Scope of Work",
            scopeItems: [
                "Character design",
                "Storyboard",
                "Color script",
                "Lighting Mood",
                "Script Writing",
                "Concept art",
                "Full production",
                "Visual effects",
                "Sound design",
            ],
            scopeGallery: {
                top: [
                    image("/images/projects/Nova%20Thera/novatheraintiation1.png", "Scope of work image 1"),
                    image("/images/projects/Nova%20Thera/novatheraintiation2.png", "Scope of work image 2"),
                ],
                bottom: image("/images/projects/Nova%20Thera/novatheraintiation3.png", "Scope of work image 3"),
            },
        },
    },
    {
        id: createSectionId("preProduction"),
        type: "preProduction",
        enabled: true,
        order: 2,
        content: {
            badgeLabel: "Pre-Production",
            headerText: "A short description of development process goes like this.",
            characterSheet: {
                label: "Character Sheet",
                text: "[Place holder]\nWe build worlds,\ncreate memorable\ncharacters and craft\nanimations that\nawaken people's\ninner weeb.",
                items: [
                    {
                        id: createItemId("character"),
                        media: image("/images/projects/images_global/nova model 1.png", "Character sheet 1"),
                        label: "[NAME OF CHARACTER]",
                    },
                    {
                        id: createItemId("character"),
                        media: image("/images/projects/images_global/nova model2 .png", "Character sheet 2"),
                        label: "[NAME OF CHARACTER]",
                    },
                    {
                        id: createItemId("character"),
                        media: image("/images/projects/images_global/novamodal3.png", "Character sheet 3"),
                        label: "[NAME OF CHARACTER]",
                    },
                    {
                        id: createItemId("character"),
                        media: image("/images/projects/images_global/nova model 4.png", "Character sheet 4"),
                        label: "[NAME OF CHARACTER]",
                    },
                ],
            },
            explorationSlides: [
                {
                    id: createItemId("slide"),
                    media: image("/images/projects/images_global/dragon1%20.png", "Exploration slide 1"),
                    title: "[The Dragon Name]",
                    description: "A short process description goes here",
                },
                {
                    id: createItemId("slide"),
                    media: image("/images/projects/images_global/dragon%202.png", "Exploration slide 2"),
                    title: "[The Phoenix]",
                    description: "Creature exploration and iteration",
                },
                {
                    id: createItemId("slide"),
                    media: image("/images/projects/images_global/dragon3.png", "Exploration slide 3"),
                    title: "[The Serpent]",
                    description: "Final concept art for production",
                },
                {
                    id: createItemId("slide"),
                    media: image("/images/projects/images_global/dragon%204%20.png", "Exploration slide 4"),
                    title: "[The Guardian]",
                    description: "Boss character design exploration",
                },
                {
                    id: createItemId("slide"),
                    media: image("/images/projects/images_global/dragon%205.png", "Exploration slide 5"),
                    title: "[The Colossus]",
                    description: "Extended concept exploration",
                },
            ],
            autoRotateMs: 5000,
        },
    },
    {
        id: createSectionId("postExplorationGallery"),
        type: "postExplorationGallery",
        enabled: true,
        order: 3,
        content: {
            primary: image("/images/projects/images_global/highligh1.png", "Primary concept artwork"),
            secondary: image("/images/projects/images_global/highlight2.png", "Secondary concept artwork"),
            caption: "We build worlds, create memorable characters and craft animations that awaken people's inner weeb.",
        },
    },
    {
        id: createSectionId("production"),
        type: "production",
        enabled: true,
        order: 4,
        content: {
            badgeLabel: "Production",
            description: "A short description of production/\nanimation goes like this.",
            media: video("/images/projects/Nova%20Thera/novathrea_initiation.mp4", "Production video"),
            overlayItems: ["NOVA THERA: INITIATION", "00:00:36", "OTSU LABS COLLECTION"],
        },
    },
    {
        id: createSectionId("animationKey"),
        type: "animationKey",
        enabled: true,
        order: 5,
        content: {
            title: "Animation key",
            badgeLabel: "Post-Production",
            terms: "Some technical terms | should go here",
            arrowSymbol: "↓",
            metaLabel: "Animation Highlights",
            scenes: [
                {
                    id: createItemId("scene"),
                    label: "Scene 1",
                    media: image("/images/projects/Nova%20Thera/animationkey1.png", "Animation key scene 1"),
                    duration: "00:00:20",
                },
                {
                    id: createItemId("scene"),
                    label: "Scene 2",
                    media: image("/images/projects/Nova%20Thera/animationkey2.png", "Animation key scene 2"),
                    duration: "00:00:18",
                },
                {
                    id: createItemId("scene"),
                    label: "Scene 3",
                    media: image("/images/projects/Nova%20Thera/animationkey3.png", "Animation key scene 3"),
                    duration: "00:00:23",
                },
                {
                    id: createItemId("scene"),
                    label: "Scene 4",
                    media: image("/images/projects/Nova%20Thera/animationkey4.png", "Animation key scene 4"),
                    duration: "00:00:21",
                },
            ],
        },
    },
    {
        id: createSectionId("keyHighlightPair"),
        type: "keyHighlightPair",
        enabled: true,
        order: 6,
        content: {
            leftMedia: image("/images/projects/Nova%20Thera/keyhighlight1.png", "Scene preview left"),
            rightMedia: image("/images/projects/Nova%20Thera/keyhighlight2.png", "Scene preview right"),
            caption: "SCENE'S NAME / DESCRIPTION",
        },
    },
    {
        id: createSectionId("moreProjects"),
        type: "moreProjects",
        enabled: true,
        order: 7,
        content: {
            title: "More Projects",
            backLinkLabel: "Back to Work",
            backLinkHref: "/work",
            mode: "autoRelated",
            maxItems: 2,
        },
    },
];

export interface NovatheraTemplateBuildInput {
    id: string;
    slug: string;
    status: PublishStatus;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    basicInfoOverride?: Partial<ProjectBasicInfo>;
    seoOverride?: Partial<ProjectSeoMeta>;
}

export const createNovatheraTemplateProject = (input: NovatheraTemplateBuildInput): CmsProjectDocument => ({
    id: input.id,
    slug: input.slug,
    slugHistory: [],
    templateId: "novathera-v1",
    templateVersion: NOVATHERA_TEMPLATE_VERSION,
    status: input.status,
    order: input.order,
    basicInfo: {
        ...NOVATHERA_BASIC_INFO,
        ...input.basicInfoOverride,
    },
    seo: {
        ...NOVATHERA_SEO,
        ...input.seoOverride,
    },
    sections: createNovatheraSections(),
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    ...(input.publishedAt ? { publishedAt: input.publishedAt } : {}),
});
