import type { CmsProjectDocument } from "@/lib/cms/types";
import type { BlogPostContentModel, ServiceContentModel } from "@/lib/seo-content/types";
import type { SeoFields } from "@/lib/seo/types";

const withoutSlug = (seo: SeoFields): Omit<SeoFields, "slug"> => {
    const { slug: _slug, ...rest } = seo;
    void _slug;
    return rest;
};

export const getProjectSeoFields = (project: CmsProjectDocument): SeoFields => ({
    slug: project.slug,
    seoTitle: project.seo.seoTitle || project.seo.title || project.basicInfo.title,
    metaDescription:
        project.seo.metaDescription || project.seo.description || project.basicInfo.scopeSummary || "",
    canonicalUrl: project.seo.canonicalUrl || project.seo.canonical,
    noindex: project.seo.noindex ?? false,
    nofollow: project.seo.nofollow ?? false,
    ogTitle: project.seo.ogTitle,
    ogDescription: project.seo.ogDescription,
    ogImage: project.seo.ogImage,
    includeInSitemap: project.seo.includeInSitemap ?? true,
    schemaType: project.seo.schemaType || "caseStudy",
});

export const getServiceSeoFields = (service: ServiceContentModel): SeoFields => ({
    ...withoutSlug(service.seo),
    slug: service.slug,
    schemaType: service.seo.schemaType || "service",
    includeInSitemap: service.seo.includeInSitemap ?? true,
});

export const getBlogPostSeoFields = (post: BlogPostContentModel): SeoFields => ({
    ...withoutSlug(post.seo),
    slug: post.slug,
    schemaType: post.seo.schemaType || "article",
    includeInSitemap: post.seo.includeInSitemap ?? true,
});
