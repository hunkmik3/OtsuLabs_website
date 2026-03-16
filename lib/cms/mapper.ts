import type {
    CmsProjectDocument,
    ProjectSectionByType,
    ProjectSectionType,
} from "@/lib/cms/types";
import { getSeoDescription } from "@/lib/cms/seo";
import type { ExplorationSlide, ProjectData } from "@/lib/projects";

const PLACEHOLDER_IMAGE = "/images/home/hero_banner.png";

const getEnabledSectionByType = <T extends ProjectSectionType>(
    project: CmsProjectDocument,
    type: T
): ProjectSectionByType<T> | undefined => {
    const orderedSections = [...project.sections].sort((a, b) => a.order - b.order);
    const enabledSection = orderedSections.find((section) => section.type === type && section.enabled);
    if (enabledSection) {
        return enabledSection as ProjectSectionByType<T>;
    }
    const anySection = orderedSections.find((section) => section.type === type);
    return anySection as ProjectSectionByType<T> | undefined;
};

const mapExplorationSlides = (project: CmsProjectDocument): ExplorationSlide[] => {
    const preProduction = getEnabledSectionByType(project, "preProduction");
    if (!preProduction?.content.explorationSlides?.length) {
        return [
            {
                image: project.basicInfo.workCardImage.src || PLACEHOLDER_IMAGE,
                title: "[Exploration Slide]",
                description: "No exploration description yet.",
            },
        ];
    }

    return preProduction.content.explorationSlides.map((slide) => ({
        image: slide.media.src,
        title: slide.title,
        description: slide.description,
    }));
};

export const mapCmsProjectToProjectData = (project: CmsProjectDocument, fallbackNumericId: number): ProjectData => {
    const hero = getEnabledSectionByType(project, "hero");
    const about = getEnabledSectionByType(project, "aboutProject");
    const preProduction = getEnabledSectionByType(project, "preProduction");

    const explorationSlides = mapExplorationSlides(project);
    const scopeItems = about?.content.scopeItems ?? [];
    const scopeSummary = project.basicInfo.scopeSummary || scopeItems.join(", ");

    const scopeTopLeft = about?.content.scopeGallery.top[0]?.src ?? project.basicInfo.workCardImage.src ?? PLACEHOLDER_IMAGE;
    const scopeTopRight = about?.content.scopeGallery.top[1]?.src ?? project.basicInfo.workCardImage.src ?? PLACEHOLDER_IMAGE;
    const scopeBottom = about?.content.scopeGallery.bottom?.src ?? project.basicInfo.workCardImage.src ?? PLACEHOLDER_IMAGE;

    const heroVideo = hero?.content.media.src ?? project.basicInfo.workCardImage.src ?? PLACEHOLDER_IMAGE;

    return {
        id: fallbackNumericId,
        slug: project.slug,
        client: project.basicInfo.clientName,
        projectTitle: project.basicInfo.title,
        scope: scopeSummary,
        image: project.basicInfo.workCardImage.src || PLACEHOLDER_IMAGE,
        date: project.basicInfo.dateLabel,
        heroVideo,
        animationDuration: project.basicInfo.animationDuration,
        aboutDescription:
            project.basicInfo.workCardOverlayText ||
            about?.content.description ||
            getSeoDescription(project.seo, "") ||
            "",
        scopeOfWork: scopeItems,
        scopeImages: {
            top: [scopeTopLeft, scopeTopRight],
            bottom: scopeBottom,
        },
        preProductionDescription: preProduction?.content.headerText ?? "",
        characterSheetText: preProduction?.content.characterSheet.text ?? "",
        characterSheetImages:
            preProduction?.content.characterSheet.items.map((item) => ({
                src: item.media.src,
                label: item.label,
            })) ?? [],
        explorationSlides,
    };
};

export const mapCmsProjectsToProjectData = (projects: CmsProjectDocument[]): ProjectData[] =>
    [...projects]
        .sort((a, b) => a.order - b.order)
        .map((project, index) => mapCmsProjectToProjectData(project, index + 1));

export const findCmsProjectSection = getEnabledSectionByType;
