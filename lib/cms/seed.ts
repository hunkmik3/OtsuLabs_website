import { projects as legacyProjects, type ProjectData } from "@/lib/projects";
import { createIsoNow, createItemId, createProjectId, createSectionId } from "@/lib/cms/ids";
import { NOVATHERA_TEMPLATE_VERSION } from "@/lib/cms/template.novathera";
import type {
    CmsDataStore,
    CmsProjectDocument,
    MediaAsset,
    ProjectSection,
    ProjectTemplateId,
} from "@/lib/cms/types";

export const CMS_STORE_VERSION = 2;

const image = (src: string, alt: string): MediaAsset => ({ src, alt, type: "image" });
const video = (src: string, alt: string): MediaAsset => ({ src, alt, type: "video" });

const DEFAULT_PRODUCTION_DESCRIPTION = "A short description of production/\nanimation goes like this.";
const DEFAULT_TERMS = "Some technical terms | should go here";
const DEFAULT_ANIMATION_META_LABEL = "Animation Highlights";

const getTemplateIdFromLegacyProject = (project: ProjectData): ProjectTemplateId =>
    project.slug === "pixelmon" ? "novathera-v1" : "legacy-import-v1";

const getMoreProjectsOrder = (project: ProjectData, allProjects: ProjectData[]) =>
    allProjects
        .filter((candidate) => candidate.slug !== project.slug)
        .slice(0, 2)
        .map((candidate) => ({
            slug: candidate.slug,
            title: candidate.projectTitle,
            subtitle: candidate.client,
            year: candidate.date.match(/\d{4}/)?.[0] ?? "YEAR",
            image: image(candidate.image, `${candidate.projectTitle} cover`),
        }));

const createSectionsFromLegacyProject = (project: ProjectData, allProjects: ProjectData[]): ProjectSection[] => {
    const isNovaBlueprint = project.slug === "pixelmon";
    const safeScopeTop0 = project.scopeImages.top[0] || project.image;
    const safeScopeTop1 = project.scopeImages.top[1] || project.image;
    const safeBottom = project.scopeImages.bottom || project.image;
    const safeDuration = project.animationDuration || "00:00:00";
    const overlayTitle = project.projectTitle.toUpperCase();
    const summaryCaption = project.characterSheetText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !/^\[?\s*place holder\s*\]?$/i.test(line))
        .join(" ")
        .replace(/\s+/g, " ");

    const animationScenes = isNovaBlueprint
        ? [
              { label: "Scene 1", imageSrc: "/images/projects/Nova%20Thera/animationkey1.png", duration: "00:00:20" },
              { label: "Scene 2", imageSrc: "/images/projects/Nova%20Thera/animationkey2.png", duration: "00:00:18" },
              { label: "Scene 3", imageSrc: "/images/projects/Nova%20Thera/animationkey3.png", duration: "00:00:23" },
              { label: "Scene 4", imageSrc: "/images/projects/Nova%20Thera/animationkey4.png", duration: "00:00:21" },
          ]
        : project.explorationSlides.slice(0, 4).map((slide, index) => ({
              label: `Scene ${index + 1}`,
              imageSrc: slide.image,
              duration: `00:00:${String(16 + index * 2).padStart(2, "0")}`,
          }));

    return [
        {
            id: createSectionId("hero"),
            type: "hero",
            enabled: true,
            order: 0,
            content: {
                titleText: project.projectTitle,
                viewFullVideoLabel: "View Full Video",
                animationTimeLabel: "Animation Time",
                media: video(project.heroVideo, `${project.projectTitle} hero video`),
                metaItems: [
                    { label: "Date", value: project.date },
                    { label: "Client", value: project.client },
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
                description: project.aboutDescription,
                scopeBadgeLabel: "Scope of Work",
                scopeItems: project.scopeOfWork,
                scopeGallery: {
                    top: [
                        image(safeScopeTop0, `${project.projectTitle} scope image 1`),
                        image(safeScopeTop1, `${project.projectTitle} scope image 2`),
                    ],
                    bottom: image(safeBottom, `${project.projectTitle} scope image 3`),
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
                headerText: project.preProductionDescription,
                characterSheet: {
                    label: "Character Sheet",
                    text: project.characterSheetText,
                    items: project.characterSheetImages.map((item) => ({
                        id: createItemId("character"),
                        media: image(item.src, item.label || `${project.projectTitle} character`),
                        label: item.label,
                    })),
                },
                explorationSlides: project.explorationSlides.map((slide) => ({
                    id: createItemId("exploration-slide"),
                    media: image(slide.image, slide.title),
                    title: slide.title,
                    description: slide.description,
                })),
                autoRotateMs: 5000,
            },
        },
        {
            id: createSectionId("postExplorationGallery"),
            type: "postExplorationGallery",
            enabled: true,
            order: 3,
            content: {
                primary: image(
                    isNovaBlueprint ? "/images/projects/images_global/highligh1.png" : safeScopeTop0,
                    `${project.projectTitle} highlight image 1`
                ),
                secondary: image(
                    isNovaBlueprint ? "/images/projects/images_global/highlight2.png" : safeScopeTop1,
                    `${project.projectTitle} highlight image 2`
                ),
                caption: summaryCaption,
            },
        },
        {
            id: createSectionId("production"),
            type: "production",
            enabled: true,
            order: 4,
            content: {
                badgeLabel: "Production",
                description: DEFAULT_PRODUCTION_DESCRIPTION,
                media: video(project.heroVideo, `${project.projectTitle} production video`),
                overlayItems: [overlayTitle, safeDuration, "OTSU LABS COLLECTION"] as [string, string, string],
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
                terms: DEFAULT_TERMS,
                arrowSymbol: "↓",
                metaLabel: DEFAULT_ANIMATION_META_LABEL,
                scenes: animationScenes.map((scene) => ({
                    id: createItemId("scene"),
                    label: scene.label,
                    media: image(scene.imageSrc, `${project.projectTitle} ${scene.label}`),
                    duration: scene.duration,
                })),
            },
        },
        {
            id: createSectionId("keyHighlightPair"),
            type: "keyHighlightPair",
            enabled: true,
            order: 6,
            content: {
                leftMedia: image(
                    isNovaBlueprint ? "/images/projects/Nova%20Thera/keyhighlight1.png" : safeScopeTop0,
                    `${project.projectTitle} key highlight left`
                ),
                rightMedia: image(
                    isNovaBlueprint ? "/images/projects/Nova%20Thera/keyhighlight2.png" : safeScopeTop1,
                    `${project.projectTitle} key highlight right`
                ),
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
                manualItems: getMoreProjectsOrder(project, allProjects),
            },
        },
    ];
};

const mapLegacyProjectToCmsDocument = (project: ProjectData, index: number, allProjects: ProjectData[]): CmsProjectDocument => {
    const now = createIsoNow();
    return {
        id: createProjectId(),
        slug: project.slug,
        slugHistory: [],
        templateId: getTemplateIdFromLegacyProject(project),
        templateVersion: NOVATHERA_TEMPLATE_VERSION,
        status: "published",
        order: index,
        basicInfo: {
            title: project.projectTitle,
            subtitle: project.client === project.projectTitle ? undefined : project.client,
            clientName: project.client,
            dateLabel: project.date,
            animationDuration: project.animationDuration,
            scopeSummary: project.scope,
            workCardImage: image(project.image, `${project.projectTitle} card image`),
            workCardOverlayText: project.aboutDescription,
        },
        seo: {
            seoTitle: `${project.projectTitle} | Otsu Labs`,
            metaDescription: project.aboutDescription,
            ogTitle: `${project.projectTitle} | Otsu Labs`,
            ogDescription: project.aboutDescription,
            ogImage: image(project.image, `${project.projectTitle} OG image`),
            canonicalUrl: `/work/${project.slug}`,
            noindex: false,
            nofollow: false,
            includeInSitemap: true,
            schemaType: "caseStudy",
        },
        sections: createSectionsFromLegacyProject(project, allProjects),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
    };
};

export const createSeedProjects = () => legacyProjects.map((project, index, allProjects) => mapLegacyProjectToCmsDocument(project, index, allProjects));

export const createSeedStore = (): CmsDataStore => ({
    version: CMS_STORE_VERSION,
    projects: createSeedProjects(),
    redirects: [],
});
