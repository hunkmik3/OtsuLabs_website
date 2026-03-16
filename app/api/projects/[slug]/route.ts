import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { getPublicProjectBySlug } from "@/lib/cms/project-service";

interface RouteProps {
    params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: RouteProps) {
    try {
        const { slug } = await params;
        const project = await getPublicProjectBySlug(slug);
        return apiOk({ project });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/projects/[slug]");
    }
}
