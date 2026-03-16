import { mapCmsProjectsToProjectData } from "@/lib/cms/mapper";
import { createCmsProjectRepository } from "@/lib/cms/repository";
import { projects as legacyProjects, type ProjectData } from "@/lib/projects";

export const getProjectsWithCmsFallback = async (): Promise<ProjectData[]> => {
    try {
        const repository = createCmsProjectRepository();
        const publishedProjects = await repository.getPublishedProjects();
        if (!publishedProjects.length) {
            return legacyProjects;
        }
        return mapCmsProjectsToProjectData(publishedProjects);
    } catch {
        return legacyProjects;
    }
};

export const getProjectBySlugWithCmsFallback = async (slug: string): Promise<ProjectData | undefined> => {
    const projects = await getProjectsWithCmsFallback();
    return projects.find((project) => project.slug === slug);
};
