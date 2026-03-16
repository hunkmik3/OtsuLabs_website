import type { CmsProjectDocument, ProjectSeoMeta } from "@/lib/cms/types";

const asNonEmptyString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : "";

export const getSeoTitle = (seo: ProjectSeoMeta, fallbackTitle: string) =>
    asNonEmptyString(seo.seoTitle) ||
    asNonEmptyString(seo.title) ||
    asNonEmptyString(seo.ogTitle) ||
    asNonEmptyString(fallbackTitle);

export const getSeoDescription = (seo: ProjectSeoMeta, fallbackDescription: string) =>
    asNonEmptyString(seo.metaDescription) ||
    asNonEmptyString(seo.description) ||
    asNonEmptyString(seo.ogDescription) ||
    asNonEmptyString(fallbackDescription);

export const getSeoCanonical = (seo: ProjectSeoMeta) =>
    asNonEmptyString(seo.canonicalUrl) || asNonEmptyString(seo.canonical) || "";

export const getSeoOgTitle = (seo: ProjectSeoMeta, fallbackTitle: string) =>
    asNonEmptyString(seo.ogTitle) || getSeoTitle(seo, fallbackTitle);

export const getSeoOgDescription = (seo: ProjectSeoMeta, fallbackDescription: string) =>
    asNonEmptyString(seo.ogDescription) || getSeoDescription(seo, fallbackDescription);

export const shouldIncludeProjectInSitemap = (project: CmsProjectDocument) => {
    return (project.seo.includeInSitemap ?? true) && !(project.seo.noindex ?? false);
};
