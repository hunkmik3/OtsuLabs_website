import { randomUUID } from "node:crypto";
import { createCmsProjectRepository } from "@/lib/cms/repository";
import type {
    CmsProjectDocument,
    CreateProjectFromTemplateInput,
    ProjectSeoMeta,
    ProjectSection,
    ProjectTemplateId,
    PublishStatus,
    UpdateProjectInput,
} from "@/lib/cms/types";
import { CmsApiError } from "@/lib/cms/api-response";
import { validateProjectDocument } from "@/lib/cms/validator";
import { cmsLogger } from "@/lib/cms/logger";

const getRepository = () => createCmsProjectRepository();

const normalizeSlug = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const asNonEmptyString = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value.trim() : "");

const asNullableString = (value: unknown) => (typeof value === "string" ? value : undefined);

const normalizeTemplateId = (templateId: unknown): ProjectTemplateId => {
    const value = typeof templateId === "string" ? templateId.trim().toLowerCase() : "";

    if (value === "novathera" || value === "novathera-v1") {
        return "novathera-v1";
    }
    if (value === "blank" || value === "blank-v1" || value.length === 0) {
        return "blank-v1";
    }

    throw new CmsApiError(400, "INVALID_TEMPLATE", "templateId must be blank or novathera.");
};

const normalizeStatus = (status: unknown): PublishStatus => {
    if (status === "draft" || status === "published") {
        return status;
    }
    return "draft";
};

const createUniqueSlug = async (baseSlug: string, excludeProjectId?: string) => {
    const repository = getRepository();
    const allProjects = await repository.getAllProjects();
    const normalizedBase = normalizeSlug(baseSlug) || `project-${randomUUID().slice(0, 8)}`;

    let candidate = normalizedBase;
    let suffix = 2;
    while (allProjects.some((project) => project.slug === candidate && project.id !== excludeProjectId)) {
        candidate = `${normalizedBase}-${suffix}`;
        suffix += 1;
    }

    return candidate;
};

const assertSlugNotUsed = async (slug: string, excludeProjectId?: string) => {
    const repository = getRepository();
    const allProjects = await repository.getAllProjects();
    const duplicated = allProjects.find((project) => project.slug === slug && project.id !== excludeProjectId);
    if (duplicated) {
        throw new CmsApiError(409, "SLUG_CONFLICT", `Slug '${slug}' is already in use.`);
    }
};

const ensureSectionPayload = (sections: unknown): ProjectSection[] => {
    if (!Array.isArray(sections)) {
        throw new CmsApiError(400, "INVALID_SECTIONS", "sections must be an array.");
    }
    return (sections as ProjectSection[])
        .filter((section) => section?.type !== "credits")
        .sort((a, b) => a.order - b.order)
        .map((section, index) => ({
            ...section,
            order: index,
        }));
};

const ensureCreatePayload = async (payload: unknown): Promise<CreateProjectFromTemplateInput> => {
    const body = (payload ?? {}) as Record<string, unknown>;
    const title = asNonEmptyString(body.title);
    if (!title) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "title is required.");
    }

    const templateId = normalizeTemplateId(body.templateId);
    const explicitSlug = asNonEmptyString(body.slug);
    const slug = explicitSlug
        ? normalizeSlug(explicitSlug)
        : await createUniqueSlug(normalizeSlug(title));

    if (!slug) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "slug is invalid.");
    }

    if (explicitSlug) {
        await assertSlugNotUsed(slug);
    }

    const order = typeof body.order === "number" && Number.isFinite(body.order) ? Math.max(0, Math.floor(body.order)) : undefined;

    return {
        templateId,
        slug,
        title,
        clientName: asNullableString(body.clientName),
        order,
        status: normalizeStatus(body.status),
    };
};

const ensurePatchPayload = async (id: string, payload: unknown): Promise<UpdateProjectInput> => {
    const body = (payload ?? {}) as Record<string, unknown>;
    const update: UpdateProjectInput = {};

    if (body.slug !== undefined) {
        const slugCandidate = normalizeSlug(String(body.slug || ""));
        if (!slugCandidate) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "slug must not be empty.");
        }
        await assertSlugNotUsed(slugCandidate, id);
        update.slug = slugCandidate;
    }

    if (body.order !== undefined) {
        if (typeof body.order !== "number" || !Number.isFinite(body.order)) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "order must be a number.");
        }
        update.order = Math.max(0, Math.floor(body.order));
    }

    if (body.status !== undefined) {
        if (body.status !== "draft" && body.status !== "published") {
            throw new CmsApiError(400, "VALIDATION_ERROR", "status must be draft or published.");
        }
        update.status = body.status;
    }

    if (body.basicInfo !== undefined) {
        if (!body.basicInfo || typeof body.basicInfo !== "object") {
            throw new CmsApiError(400, "VALIDATION_ERROR", "basicInfo must be an object.");
        }

        const basicInfo = body.basicInfo as Record<string, unknown>;
        update.basicInfo = {
            ...(basicInfo.title !== undefined ? { title: String(basicInfo.title) } : {}),
            ...(basicInfo.subtitle !== undefined ? { subtitle: String(basicInfo.subtitle) } : {}),
            ...(basicInfo.clientName !== undefined ? { clientName: String(basicInfo.clientName) } : {}),
            ...(basicInfo.dateLabel !== undefined ? { dateLabel: String(basicInfo.dateLabel) } : {}),
            ...(basicInfo.animationDuration !== undefined ? { animationDuration: String(basicInfo.animationDuration) } : {}),
            ...(basicInfo.scopeSummary !== undefined ? { scopeSummary: String(basicInfo.scopeSummary) } : {}),
            ...(basicInfo.workCardImage !== undefined ? { workCardImage: basicInfo.workCardImage as never } : {}),
            ...(basicInfo.workCardOverlayText !== undefined ? { workCardOverlayText: String(basicInfo.workCardOverlayText) } : {}),
        };
    }

    if (body.seo !== undefined) {
        if (!body.seo || typeof body.seo !== "object") {
            throw new CmsApiError(400, "VALIDATION_ERROR", "seo must be an object.");
        }

        const seo = body.seo as Record<string, unknown>;
        const seoTitle = seo.seoTitle ?? seo.title;
        const seoDescription = seo.metaDescription ?? seo.description;
        const canonicalUrl = seo.canonicalUrl ?? seo.canonical;

        update.seo = {
            ...(seoTitle !== undefined
                ? { seoTitle: String(seoTitle), title: String(seoTitle) }
                : {}),
            ...(seoDescription !== undefined
                ? { metaDescription: String(seoDescription), description: String(seoDescription) }
                : {}),
            ...(seo.ogImage !== undefined ? { ogImage: seo.ogImage as never } : {}),
            ...(canonicalUrl !== undefined
                ? { canonicalUrl: String(canonicalUrl), canonical: String(canonicalUrl) }
                : {}),
            ...(seo.noindex !== undefined ? { noindex: !!seo.noindex } : {}),
            ...(seo.nofollow !== undefined ? { nofollow: !!seo.nofollow } : {}),
            ...(seo.ogTitle !== undefined ? { ogTitle: String(seo.ogTitle) } : {}),
            ...(seo.ogDescription !== undefined ? { ogDescription: String(seo.ogDescription) } : {}),
            ...(seo.includeInSitemap !== undefined ? { includeInSitemap: !!seo.includeInSitemap } : {}),
            ...(seo.schemaType !== undefined
                ? { schemaType: String(seo.schemaType) as ProjectSeoMeta["schemaType"] }
                : {}),
        };
    }

    if (body.sections !== undefined) {
        update.sections = ensureSectionPayload(body.sections);
    }

    if (Object.keys(update).length === 0) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "No updatable fields were provided.");
    }

    return update;
};

const assertProjectValidation = async (project: CmsProjectDocument) => {
    const repository = getRepository();
    const allProjects = await repository.getAllProjects();
    const issues = validateProjectDocument({
        project,
        existingProjects: allProjects.filter((item) => item.id !== project.id),
    });

    if (!issues.valid) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "Project data is invalid.", issues.issues);
    }
};

export const listPublicProjects = async () => {
    const repository = getRepository();
    const projects = await repository.getPublishedProjects();
    return projects.sort((a, b) => a.order - b.order);
};

export const getPublicProjectBySlug = async (slug: string) => {
    const repository = getRepository();
    const project = await repository.getProjectBySlug(normalizeSlug(slug));
    if (!project || project.status !== "published") {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }

    return project;
};

export const listAdminProjects = async () => {
    const repository = getRepository();
    const projects = await repository.getAllProjects();
    return projects.sort((a, b) => a.order - b.order);
};

export const createAdminProject = async (payload: unknown) => {
    const repository = getRepository();
    const createInput = await ensureCreatePayload(payload);
    const project = await repository.createProjectFromTemplate(createInput);
    await assertProjectValidation(project);
    cmsLogger.info("CMS project created.", {
        projectId: project.id,
        slug: project.slug,
        status: project.status,
        templateId: createInput.templateId,
    });
    return project;
};

export const getAdminProjectById = async (id: string) => {
    const repository = getRepository();
    const project = await repository.getProjectById(id);
    if (!project) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }
    return project;
};

export const patchAdminProject = async (id: string, payload: unknown) => {
    const repository = getRepository();
    const current = await repository.getProjectById(id);
    if (!current) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }

    const patchInput = await ensurePatchPayload(id, payload);
    const updated = await repository.updateProject(id, patchInput);
    await assertProjectValidation(updated);
    cmsLogger.info("CMS project updated.", {
        projectId: updated.id,
        slug: updated.slug,
        status: updated.status,
    });
    return updated;
};

export const deleteAdminProject = async (id: string) => {
    const repository = getRepository();
    const current = await repository.getProjectById(id);
    if (!current) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }
    await repository.deleteProject(id);
    cmsLogger.info("CMS project deleted.", {
        projectId: id,
        slug: current.slug,
    });
    return { id };
};

export const publishAdminProject = async (id: string) => {
    const repository = getRepository();
    const current = await repository.getProjectById(id);
    if (!current) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }

    const published = await repository.publishProject(id);
    await assertProjectValidation(published);
    cmsLogger.info("CMS project published.", {
        projectId: published.id,
        slug: published.slug,
        publishedAt: published.publishedAt,
    });
    return published;
};

export const unpublishAdminProject = async (id: string) => {
    const repository = getRepository();
    const current = await repository.getProjectById(id);
    if (!current) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }

    const draft = await repository.unpublishProject(id);
    await assertProjectValidation(draft);
    cmsLogger.info("CMS project unpublished.", {
        projectId: draft.id,
        slug: draft.slug,
    });
    return draft;
};

const createDuplicateSlug = async (slug: string) => {
    const baseCopySlug = `${normalizeSlug(slug)}-copy`;
    return createUniqueSlug(baseCopySlug);
};

const stripFixedSections = (sections: ProjectSection[]) =>
    sections
        .filter((section) => section.type !== "credits")
        .sort((a, b) => a.order - b.order)
        .map((section, index) => ({
            ...section,
            order: index,
        }));

export const duplicateAdminProject = async (id: string) => {
    const repository = getRepository();
    const source = await repository.getProjectById(id);
    if (!source) {
        throw new CmsApiError(404, "NOT_FOUND", "Project not found.");
    }

    const duplicateSlug = await createDuplicateSlug(source.slug);
    const created = await repository.createProjectFromTemplate({
        templateId: "blank-v1",
        slug: duplicateSlug,
        title: `${source.basicInfo.title} Copy`,
        clientName: source.basicInfo.clientName,
        status: "draft",
    });

    const duplicated = await repository.updateProject(created.id, {
        slug: duplicateSlug,
        status: "draft",
        basicInfo: {
            ...source.basicInfo,
            title: `${source.basicInfo.title} Copy`,
        },
        seo: {
            ...source.seo,
            seoTitle: `${(source.seo.seoTitle || source.seo.title || source.basicInfo.title)} (Copy)`,
            title: `${(source.seo.seoTitle || source.seo.title || source.basicInfo.title)} (Copy)`,
            noindex: true,
            includeInSitemap: false,
        },
        sections: stripFixedSections(source.sections as ProjectSection[]),
    });

    await assertProjectValidation(duplicated);
    cmsLogger.info("CMS project duplicated.", {
        sourceProjectId: source.id,
        sourceSlug: source.slug,
        projectId: duplicated.id,
        slug: duplicated.slug,
    });
    return duplicated;
};
