import type { Metadata } from "next";
import { getProjectBySlug as getLegacyProjectBySlug, projects as legacyProjects } from "@/lib/projects";
import { createSeedProjects } from "@/lib/cms/seed";
import { mapCmsProjectToDetailRenderModel, type ProjectDetailRenderModel } from "@/lib/cms/project-detail-mapper";
import { createCmsProjectRepository } from "@/lib/cms/repository";
import type { CmsProjectDocument } from "@/lib/cms/types";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";
import { getProjectSeoFields } from "@/lib/seo/adapters";

export type ProjectRenderSource = "cms" | "seed" | "legacy";

export interface ProjectBySlugForRenderResult {
    source: ProjectRenderSource;
    project: CmsProjectDocument;
    allProjects: CmsProjectDocument[];
    renderModel: ProjectDetailRenderModel;
}

export interface ProjectByIdForPreviewResult {
    project: CmsProjectDocument;
    allProjects: CmsProjectDocument[];
    renderModel: ProjectDetailRenderModel;
}

const normalizeSlug = (slug: string) => slug.trim().toLowerCase();

const sortProjects = (projects: CmsProjectDocument[]) =>
    [...projects].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));

const pickPublishedProjectForSlug = (projects: CmsProjectDocument[], slug: string): CmsProjectDocument | null => {
    const normalizedSlug = normalizeSlug(slug);
    return (
        projects.find(
            (project) =>
                project.slug === normalizedSlug && project.status === "published"
        ) ?? null
    );
};

const publishedCollectionForRender = (projects: CmsProjectDocument[]): CmsProjectDocument[] =>
    sortProjects(projects.filter((project) => project.status === "published"));

const toMetadata = (project: CmsProjectDocument): Metadata => {
    return buildSeoMetadata({
        path: `/work/${project.slug}`,
        displayTitle: project.basicInfo.title,
        displayDescription: project.basicInfo.scopeSummary || "",
        seo: getProjectSeoFields(project),
        pageImage: project.basicInfo.workCardImage,
    });
};

const createLegacyDerivedProjects = (): CmsProjectDocument[] => {
    // Seed mapper is the canonical adapter from legacy shape -> CMS shape.
    return createSeedProjects();
};

const resolveFromCmsRepository = async (slug: string): Promise<ProjectBySlugForRenderResult | null> => {
    try {
        const repository = createCmsProjectRepository();
        const allProjects = sortProjects(await repository.getPublishedProjects());
        const project = pickPublishedProjectForSlug(allProjects, slug);
        if (!project) return null;

        const renderProjects = publishedCollectionForRender(allProjects);
        return {
            source: "cms",
            project,
            allProjects: renderProjects,
            renderModel: mapCmsProjectToDetailRenderModel(project, renderProjects),
        };
    } catch {
        return null;
    }
};

const resolveFromSeed = (slug: string): ProjectBySlugForRenderResult | null => {
    const allProjects = sortProjects(createSeedProjects()).filter(
        (project) => project.status === "published"
    );
    const project = pickPublishedProjectForSlug(allProjects, slug);
    if (!project) return null;

    const renderProjects = publishedCollectionForRender(allProjects);
    return {
        source: "seed",
        project,
        allProjects: renderProjects,
        renderModel: mapCmsProjectToDetailRenderModel(project, renderProjects),
    };
};

const resolveFromLegacy = (slug: string): ProjectBySlugForRenderResult | null => {
    const legacyProject = getLegacyProjectBySlug(slug);
    if (!legacyProject) return null;

    const legacyDocs = sortProjects(createLegacyDerivedProjects()).filter(
        (project) => project.status === "published"
    );
    const project = pickPublishedProjectForSlug(legacyDocs, slug);
    if (!project) return null;

    const renderProjects = publishedCollectionForRender(legacyDocs);
    return {
        source: "legacy",
        project,
        allProjects: renderProjects,
        renderModel: mapCmsProjectToDetailRenderModel(project, renderProjects),
    };
};

export const getProjectBySlugForRender = async (
    slug: string
): Promise<ProjectBySlugForRenderResult | null> => {
    const normalizedSlug = normalizeSlug(slug);

    const fromCms = await resolveFromCmsRepository(normalizedSlug);
    if (fromCms) return fromCms;

    const fromSeed = resolveFromSeed(normalizedSlug);
    if (fromSeed) return fromSeed;

    return resolveFromLegacy(normalizedSlug);
};

export const getProjectSlugsForRender = async (): Promise<string[]> => {
    try {
        const repository = createCmsProjectRepository();
        const cmsProjects = await repository.getPublishedProjects();
        if (cmsProjects.length > 0) {
            return sortProjects(cmsProjects).map((project) => project.slug);
        }
    } catch {
        // Fall back below.
    }

    const seedProjects = createSeedProjects();
    if (seedProjects.length > 0) {
        return sortProjects(seedProjects.filter((project) => project.status === "published")).map(
            (project) => project.slug
        );
    }

    return legacyProjects.map((project) => project.slug);
};

export const getPublishedProjectsForRender = async (): Promise<CmsProjectDocument[]> => {
    try {
        const repository = createCmsProjectRepository();
        const cmsProjects = await repository.getPublishedProjects();
        if (cmsProjects.length > 0) {
            return sortProjects(cmsProjects);
        }
    } catch {
        // Fall back below.
    }

    const seedProjects = createSeedProjects();
    if (seedProjects.length > 0) {
        return sortProjects(seedProjects.filter((project) => project.status === "published"));
    }

    return sortProjects(createLegacyDerivedProjects().filter((project) => project.status === "published"));
};

export const getProjectMetadataForRender = async (slug: string): Promise<Metadata | null> => {
    const resolved = await getProjectBySlugForRender(slug);
    if (!resolved) return null;
    return toMetadata(resolved.project);
};

export const getProjectByIdForPreview = async (
    id: string
): Promise<ProjectByIdForPreviewResult | null> => {
    try {
        const repository = createCmsProjectRepository();
        const allProjects = sortProjects(await repository.getAllProjects());
        const project = allProjects.find((item) => item.id === id);
        if (!project) {
            return null;
        }

        const renderProjects = sortProjects([
            ...publishedCollectionForRender(allProjects),
            ...(project.status === "published" ? [] : [project]),
        ]);
        return {
            project,
            allProjects: renderProjects,
            renderModel: mapCmsProjectToDetailRenderModel(project, renderProjects),
        };
    } catch {
        return null;
    }
};
