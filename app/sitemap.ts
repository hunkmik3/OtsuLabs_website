import type { MetadataRoute } from "next";
import { getPublishedProjectsForRender } from "@/lib/cms/render-resolver";
import { shouldIncludeProjectInSitemap } from "@/lib/cms/seo";
import { getSiteUrl } from "@/lib/seo/site";
import { getAllServices } from "@/lib/seo-content/services";
import { getAllBlogPosts } from "@/lib/seo-content/blog";
import { isExpandedContentPublic } from "@/lib/seo-content/launch";
import { getServiceSeoFields, getBlogPostSeoFields } from "@/lib/seo/adapters";
import { getSitemapStaticPageSeo } from "@/lib/seo/page-seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const now = new Date();
    const publishExpandedContent = isExpandedContentPublic();

    const staticEntries: MetadataRoute.Sitemap = getSitemapStaticPageSeo({
        includeExpandedContent: publishExpandedContent,
    }).map((page) => ({
        url: `${siteUrl}${page.path}`,
        lastModified: now,
        changeFrequency: page.path === "/" ? "weekly" : "monthly",
        priority: page.path === "/" ? 1 : 0.8,
    }));

    const workProjects = await getPublishedProjectsForRender();
    const workEntries: MetadataRoute.Sitemap = workProjects
        .filter((project) => shouldIncludeProjectInSitemap(project))
        .map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
            priority: 0.7,
    }));

    if (!publishExpandedContent) {
        return [...staticEntries, ...workEntries];
    }

    const serviceEntries: MetadataRoute.Sitemap = getAllServices()
        .map((service) => ({
            service,
            seo: getServiceSeoFields(service),
        }))
        .filter(({ seo }) => (seo.includeInSitemap ?? true) && !seo.noindex)
        .map(({ service }) => ({
            url: `${siteUrl}/services/${service.slug}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
        }));

    const blogEntries: MetadataRoute.Sitemap = getAllBlogPosts()
        .map((post) => ({
            post,
            seo: getBlogPostSeoFields(post),
        }))
        .filter(({ seo }) => (seo.includeInSitemap ?? true) && !seo.noindex)
        .map(({ post }) => ({
            url: `${siteUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: "monthly",
            priority: 0.65,
        }));

    return [...staticEntries, ...serviceEntries, ...blogEntries, ...workEntries];
}
