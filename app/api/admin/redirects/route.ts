import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { parseJsonBody } from "@/lib/cms/api-request";
import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { listAdminRedirects, upsertAdminRedirect } from "@/lib/cms/redirects";

export async function GET(request: Request) {
    try {
        await assertAdminRequest(request);
        const redirects = await listAdminRedirects();
        return apiOk({
            redirects,
            total: redirects.length,
        });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/admin/redirects");
    }
}

export async function POST(request: Request) {
    try {
        await assertAdminRequest(request);
        const body = await parseJsonBody(request);
        const redirect = await upsertAdminRedirect(body);
        return apiOk({ redirect });
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/redirects");
    }
}
