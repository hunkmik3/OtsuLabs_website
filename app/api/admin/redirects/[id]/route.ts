import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { deleteAdminRedirect } from "@/lib/cms/redirects";

interface RouteProps {
    params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteProps) {
    try {
        await assertAdminRequest(request);
        const { id } = await params;
        const deleted = await deleteAdminRedirect(id);
        return apiOk(deleted);
    } catch (error) {
        return toApiErrorResponse(error, "DELETE /api/admin/redirects/[id]");
    }
}
