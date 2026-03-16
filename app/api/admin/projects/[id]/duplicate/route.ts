import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { duplicateAdminProject } from "@/lib/cms/project-service";

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const project = await duplicateAdminProject(id);
        return apiOk({ project }, 201);
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/projects/[id]/duplicate");
    }
}
