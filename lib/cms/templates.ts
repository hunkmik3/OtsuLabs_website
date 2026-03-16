import { createIsoNow, createProjectId } from "@/lib/cms/ids";
import { createNovatheraTemplateProject } from "@/lib/cms/template.novathera";
import type {
    CmsProjectDocument,
    CreateProjectFromTemplateInput,
    CreateProjectInput,
    ProjectTemplateId,
    PublishStatus,
} from "@/lib/cms/types";

const createBlankProjectFromNovaShape = (
    input: CreateProjectInput & { id: string; now: string; order: number; status: PublishStatus }
): CmsProjectDocument => {
    const title = input.title.trim();
    const clientName = input.clientName?.trim() || title;

    return createNovatheraTemplateProject({
        id: input.id,
        slug: input.slug,
        status: input.status,
        order: input.order,
        createdAt: input.now,
        updatedAt: input.now,
        basicInfoOverride: {
            title,
            subtitle: "",
            clientName,
            dateLabel: "[MONTH, YEAR]",
            animationDuration: "00:00:00",
            scopeSummary: "Update this scope summary in the CMS editor.",
            workCardOverlayText: "Update this work-card overlay text in the CMS editor.",
        },
        seoOverride: {
            seoTitle: title,
            metaDescription: "Update SEO description in the CMS editor.",
            ogTitle: title,
            ogDescription: "Update SEO description in the CMS editor.",
            ogImage: undefined,
            canonicalUrl: undefined,
            noindex: true,
            nofollow: false,
            includeInSitemap: false,
            schemaType: "caseStudy",
        },
    });
};

export interface BuildProjectFromTemplateInput {
    templateId: ProjectTemplateId;
    slug: string;
    title: string;
    clientName?: string;
    order: number;
    status: PublishStatus;
}

export const buildProjectFromTemplate = (input: BuildProjectFromTemplateInput): CmsProjectDocument => {
    const now = createIsoNow();
    const id = createProjectId();
    const title = input.title.trim();
    const clientName = input.clientName?.trim() || title;
    const publishDate = input.status === "published" ? now : undefined;

    switch (input.templateId) {
        case "novathera-v1":
            return createNovatheraTemplateProject({
                id,
                slug: input.slug,
                status: input.status,
                order: input.order,
                createdAt: now,
                updatedAt: now,
                publishedAt: publishDate,
                basicInfoOverride: {
                    title,
                    clientName,
                },
                seoOverride: {
                    seoTitle: `${title} | Otsu Labs`,
                    ogTitle: `${title} | Otsu Labs`,
                },
            });
        case "blank-v1":
            return createBlankProjectFromNovaShape({
                id,
                slug: input.slug,
                title,
                clientName,
                order: input.order,
                status: input.status,
                now,
            });
        case "legacy-import-v1":
            // This template id is reserved for migration-only docs.
            return createBlankProjectFromNovaShape({
                id,
                slug: input.slug,
                title,
                clientName,
                order: input.order,
                status: input.status,
                now,
            });
        default:
            throw new Error(`Unsupported template id: ${String(input.templateId)}`);
    }
};

export const normalizeCreateInput = (input: CreateProjectInput): CreateProjectFromTemplateInput => ({
    templateId: "blank-v1",
    slug: input.slug,
    title: input.title,
    clientName: input.clientName,
    order: input.order,
    status: input.status,
});
