import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { unpublishAdminProject } from "@/lib/cms/project-service";

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const project = await unpublishAdminProject(id);
        return apiOk({ project });
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/projects/[id]/unpublish");
    }
}
