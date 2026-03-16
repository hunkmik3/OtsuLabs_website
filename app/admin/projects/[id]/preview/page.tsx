import { notFound } from "next/navigation";
import ProjectDetailRenderer from "@/components/work/project/ProjectDetailRenderer";
import { getProjectByIdForPreview } from "@/lib/cms/render-resolver";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminProjectPreviewPage({ params }: PageProps) {
    const { id } = await params;
    const resolved = await getProjectByIdForPreview(id);

    if (!resolved) {
        notFound();
    }

    return <ProjectDetailRenderer model={resolved.renderModel} />;
}
