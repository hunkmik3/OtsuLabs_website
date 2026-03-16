import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailRenderer from "@/components/work/project/ProjectDetailRenderer";
import {
    getProjectBySlugForRender,
    getProjectMetadataForRender,
} from "@/lib/cms/render-resolver";
import { buildSeoSchema } from "@/lib/seo/schema";
import { getProjectSeoFields } from "@/lib/seo/adapters";
import { buildSeoMetadata } from "@/lib/seo/metadata-builder";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const metadata = await getProjectMetadataForRender(slug);

    if (metadata) {
        return metadata;
    }

    return buildSeoMetadata({
        path: `/work/${slug}`,
        displayTitle: "Project | Otsu Labs",
        displayDescription: "Project details from Otsu Labs.",
        seo: {
            slug,
            noindex: true,
            nofollow: true,
            includeInSitemap: false,
            schemaType: "webPage",
        },
        forceNoindex: true,
        forceNofollow: true,
    });
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const resolved = await getProjectBySlugForRender(slug);

    if (!resolved) {
        notFound();
    }

    const seo = getProjectSeoFields(resolved.project);
    const description = seo.metaDescription || resolved.project.basicInfo.scopeSummary || "";
    const schema = buildSeoSchema({
        path: `/work/${resolved.project.slug}`,
        title: resolved.project.basicInfo.title,
        description,
        seo,
        pageImage: resolved.project.basicInfo.workCardImage,
        updatedAt: resolved.project.updatedAt,
        publishedAt: resolved.project.publishedAt,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <ProjectDetailRenderer model={resolved.renderModel} />
        </>
    );
}
