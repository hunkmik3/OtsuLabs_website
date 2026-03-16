import type { ExplorationSlide } from "@/lib/projects";
import type {
    CmsProjectDocument,
    ProjectSection,
    ProjectSectionByType,
    ProjectSectionType,
} from "@/lib/cms/types";
import { createFixedCreditsColumns, FIXED_CREDITS_TITLE } from "@/lib/cms/fixed-credits";
import { getRelatedServicesForWork } from "@/lib/seo-content/services";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { getSeoDescription } from "@/lib/cms/seo";

export interface ProjectDetailHeroProps {
    projectTitle: string;
    date: string;
    client: string;
    heroVideo: string;
    animationDuration: string;
}

export interface ProjectDetailAboutProps {
    aboutDescription: string;
    scopeOfWork: string[];
    scopeImages: { top: [string, string]; bottom: string };
}

export interface ProjectDetailPreProductionProps {
    preProductionDescription: string;
    characterSheetText: string;
    characterSheetImages: { src: string; label?: string }[];
    explorationSlides: ExplorationSlide[];
}

export interface ProjectDetailPostExplorationProps {
    primaryImage: string;
    secondaryImage: string;
    caption: string;
}

export interface ProjectDetailProductionProps {
    description: string;
    videoSrc: string;
    projectTitle: string;
    duration: string;
}

export interface ProjectDetailAnimationKeyProps {
    title: string;
    terms: string;
    scenes: { label: string; image: string; duration: string }[];
}

export interface ProjectDetailKeyHighlightPairProps {
    leftImage: string;
    rightImage: string;
    caption: string;
}

export interface ProjectDetailCreditsProps {
    title: string;
    leftColumn: { role: string; names: string[] }[];
    rightColumn: { role: string; names: string[] }[];
}

export interface ProjectDetailMoreProjectsProps {
    cards: {
        slug: string;
        title: string;
        subtitle: string;
        image: string;
        year: string;
    }[];
}

export type ProjectDetailRenderSection =
    | { id: string; type: "hero"; props: ProjectDetailHeroProps }
    | { id: string; type: "aboutProject"; props: ProjectDetailAboutProps }
    | { id: string; type: "preProduction"; props: ProjectDetailPreProductionProps }
    | { id: string; type: "postExplorationGallery"; props: ProjectDetailPostExplorationProps }
    | { id: string; type: "production"; props: ProjectDetailProductionProps }
    | { id: string; type: "animationKey"; props: ProjectDetailAnimationKeyProps }
    | { id: string; type: "keyHighlightPair"; props: ProjectDetailKeyHighlightPairProps }
    | { id: string; type: "credits"; props: ProjectDetailCreditsProps }
    | { id: string; type: "moreProjects"; props: ProjectDetailMoreProjectsProps };

export interface ProjectDetailRenderModel {
    slug: string;
    projectTitle: string;
    sections: ProjectDetailRenderSection[];
    relatedServices: {
        slug: string;
        name: string;
        primaryKeyword: string;
    }[];
}

const FALLBACK_IMAGE = "/images/home/hero_banner.png";

const getSortedEnabledSections = (project: CmsProjectDocument): ProjectSection[] =>
    [...project.sections]
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

const findSectionByType = <T extends ProjectSectionType>(
    project: CmsProjectDocument,
    type: T
): ProjectSectionByType<T> | undefined =>
    [...project.sections]
        .sort((a, b) => a.order - b.order)
        .find((section) => section.type === type) as ProjectSectionByType<T> | undefined;

const extractYear = (value: string) => value.match(/\d{4}/)?.[0] ?? "YEAR";

const buildMoreProjectsCards = (
    currentProject: CmsProjectDocument,
    allProjects: CmsProjectDocument[],
    maxItems: number,
    mode: "autoRelated" | "manual",
    manualItems: {
        slug: string;
        title: string;
        subtitle: string;
        year: string;
        image: { src: string };
    }[] = []
): ProjectDetailMoreProjectsProps["cards"] => {
    if (mode === "manual" && manualItems.length > 0) {
        return manualItems.slice(0, maxItems).map((item) => ({
            slug: item.slug,
            title: item.title,
            subtitle: item.subtitle,
            image: item.image.src || FALLBACK_IMAGE,
            year: item.year,
        }));
    }

    return allProjects
        .filter((project) => project.slug !== currentProject.slug && project.status === "published")
        .sort((a, b) => a.order - b.order)
        .slice(0, maxItems)
        .map((project) => ({
            slug: project.slug,
            title: project.basicInfo.title,
            subtitle: project.basicInfo.clientName,
            image: project.basicInfo.workCardImage.src || FALLBACK_IMAGE,
            year: extractYear(project.basicInfo.dateLabel),
        }));
};

const mapHeroSection = (project: CmsProjectDocument, section: ProjectSectionByType<"hero">): ProjectDetailRenderSection => ({
    id: section.id,
    type: "hero",
    props: {
        projectTitle: section.content.titleText || project.basicInfo.title,
        date: section.content.metaItems?.[0]?.value || project.basicInfo.dateLabel,
        client: section.content.metaItems?.[1]?.value || project.basicInfo.clientName,
        heroVideo: section.content.media?.src || FALLBACK_IMAGE,
        animationDuration: project.basicInfo.animationDuration,
    },
});

const mapAboutSection = (project: CmsProjectDocument, section: ProjectSectionByType<"aboutProject">): ProjectDetailRenderSection => ({
    id: section.id,
    type: "aboutProject",
    props: {
        aboutDescription: section.content.description || getSeoDescription(project.seo, "") || "",
        scopeOfWork: section.content.scopeItems || [],
        scopeImages: {
            top: [
                section.content.scopeGallery.top?.[0]?.src || project.basicInfo.workCardImage.src || FALLBACK_IMAGE,
                section.content.scopeGallery.top?.[1]?.src || project.basicInfo.workCardImage.src || FALLBACK_IMAGE,
            ],
            bottom: section.content.scopeGallery.bottom?.src || project.basicInfo.workCardImage.src || FALLBACK_IMAGE,
        },
    },
});

const mapPreProductionSection = (
    section: ProjectSectionByType<"preProduction">
): ProjectDetailRenderSection | null => {
    const slides = section.content.explorationSlides || [];
    const items = section.content.characterSheet.items || [];
    if (slides.length === 0 || items.length === 0) {
        return null;
    }

    return {
        id: section.id,
        type: "preProduction",
        props: {
            preProductionDescription: section.content.headerText || "",
            characterSheetText: section.content.characterSheet.text || "",
            characterSheetImages: items.map((item) => ({
                src: item.media?.src || FALLBACK_IMAGE,
                label: item.label,
            })),
            explorationSlides: slides.map((slide) => ({
                image: slide.media?.src || FALLBACK_IMAGE,
                title: slide.title || "[Slide]",
                description: slide.description || "",
            })),
        },
    };
};

const mapPostExplorationSection = (
    section: ProjectSectionByType<"postExplorationGallery">
): ProjectDetailRenderSection | null => {
    const primaryImage = section.content.primary?.src || "";
    const secondaryImage = section.content.secondary?.src || "";
    if (!primaryImage && !secondaryImage) {
        return null;
    }

    return {
        id: section.id,
        type: "postExplorationGallery",
        props: {
            primaryImage: primaryImage || FALLBACK_IMAGE,
            secondaryImage: secondaryImage || FALLBACK_IMAGE,
            caption: section.content.caption || "",
        },
    };
};

const mapProductionSection = (
    project: CmsProjectDocument,
    section: ProjectSectionByType<"production">
): ProjectDetailRenderSection => ({
    id: section.id,
    type: "production",
    props: {
        description: section.content.description || "",
        videoSrc: section.content.media?.src || FALLBACK_IMAGE,
        projectTitle: project.basicInfo.title,
        duration: project.basicInfo.animationDuration,
    },
});

const mapAnimationKeySection = (
    section: ProjectSectionByType<"animationKey">
): ProjectDetailRenderSection | null => {
    const scenes = section.content.scenes || [];
    if (scenes.length === 0) {
        return null;
    }

    return {
        id: section.id,
        type: "animationKey",
        props: {
            title: section.content.title || "Animation key",
            terms: section.content.terms || "",
            scenes: scenes.map((scene) => ({
                label: scene.label || "Scene",
                image: scene.media?.src || FALLBACK_IMAGE,
                duration: scene.duration || "00:00:00",
            })),
        },
    };
};

const mapKeyHighlightPairSection = (
    section: ProjectSectionByType<"keyHighlightPair">
): ProjectDetailRenderSection | null => {
    const leftImage = section.content.leftMedia?.src || "";
    const rightImage = section.content.rightMedia?.src || "";
    if (!leftImage || !rightImage) {
        return null;
    }

    return {
        id: section.id,
        type: "keyHighlightPair",
        props: {
            leftImage,
            rightImage,
            caption: section.content.caption || "",
        },
    };
};

const mapFixedCreditsSection = (): ProjectDetailRenderSection => {
    const fixedCredits = createFixedCreditsColumns();
    return {
        id: "section_credits_fixed",
        type: "credits",
        props: {
            title: FIXED_CREDITS_TITLE,
            leftColumn: fixedCredits.leftColumn,
            rightColumn: fixedCredits.rightColumn,
        },
    };
};

const insertFixedCreditsSection = (sections: ProjectDetailRenderSection[]): ProjectDetailRenderSection[] => {
    const creditsSection = mapFixedCreditsSection();
    const moreProjectsIndex = sections.findIndex((section) => section.type === "moreProjects");

    if (moreProjectsIndex === -1) {
        return [...sections, creditsSection];
    }

    return [
        ...sections.slice(0, moreProjectsIndex),
        creditsSection,
        ...sections.slice(moreProjectsIndex),
    ];
};

const mapMoreProjectsSection = (
    project: CmsProjectDocument,
    allProjects: CmsProjectDocument[],
    section: ProjectSectionByType<"moreProjects">
): ProjectDetailRenderSection => ({
    id: section.id,
    type: "moreProjects",
    props: {
        cards: buildMoreProjectsCards(
            project,
            allProjects,
            section.content.maxItems || 2,
            section.content.mode || "autoRelated",
            section.content.manualItems
        ),
    },
});

export const mapCmsProjectToDetailRenderModel = (
    project: CmsProjectDocument,
    allProjects: CmsProjectDocument[]
): ProjectDetailRenderModel => {
    const sections = getSortedEnabledSections(project);
    const renderSections: ProjectDetailRenderSection[] = [];

    sections.forEach((section) => {
        switch (section.type) {
            case "hero":
                renderSections.push(mapHeroSection(project, section));
                break;
            case "aboutProject":
                renderSections.push(mapAboutSection(project, section));
                break;
            case "preProduction": {
                const mapped = mapPreProductionSection(section);
                if (mapped) renderSections.push(mapped);
                break;
            }
            case "postExplorationGallery": {
                const mapped = mapPostExplorationSection(section);
                if (mapped) renderSections.push(mapped);
                break;
            }
            case "production":
                renderSections.push(mapProductionSection(project, section));
                break;
            case "animationKey": {
                const mapped = mapAnimationKeySection(section);
                if (mapped) renderSections.push(mapped);
                break;
            }
            case "keyHighlightPair": {
                const mapped = mapKeyHighlightPairSection(section);
                if (mapped) renderSections.push(mapped);
                break;
            }
            case "credits":
                // Credits are globally fixed and always injected in one consistent slot.
                break;
            case "moreProjects":
                renderSections.push(mapMoreProjectsSection(project, allProjects, section));
                break;
            default:
                break;
        }
    });

    const hero = findSectionByType(project, "hero");
    if (!renderSections.some((section) => section.type === "hero") && hero) {
        renderSections.unshift(mapHeroSection(project, hero));
    }

    return {
        slug: project.slug,
        projectTitle: project.basicInfo.title,
        sections: insertFixedCreditsSection(renderSections),
        relatedServices: isExpandedContentPublic() ? getRelatedServicesForWork(project.slug) : [],
    };
};
