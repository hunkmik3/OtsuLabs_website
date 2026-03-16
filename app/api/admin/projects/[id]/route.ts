import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { parseJsonBody } from "@/lib/cms/api-request";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import {
    deleteAdminProject,
    getAdminProjectById,
    patchAdminProject,
} from "@/lib/cms/project-service";

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const project = await getAdminProjectById(id);
        return apiOk({ project });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/admin/projects/[id]");
    }
}

export async function PATCH(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const body = await parseJsonBody(request);
        const project = await patchAdminProject(id, body);
        return apiOk({ project });
    } catch (error) {
        return toApiErrorResponse(error, "PATCH /api/admin/projects/[id]");
    }
}

export async function DELETE(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const deleted = await deleteAdminProject(id);
        return apiOk(deleted);
    } catch (error) {
        return toApiErrorResponse(error, "DELETE /api/admin/projects/[id]");
    }
}
