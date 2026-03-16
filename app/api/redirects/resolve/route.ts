import { apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import { normalizeRedirectPath, resolveRedirectPath } from "@/lib/cms/redirects";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const rawPath = url.searchParams.get("path");

        if (!rawPath) {
            return apiOk({ redirect: null });
        }

        const path = normalizeRedirectPath(rawPath);
        const resolved = await resolveRedirectPath(path);
        if (!resolved) {
            return apiOk({ redirect: null });
        }

        return apiOk({
            redirect: {
                fromPath: path,
                toPath: resolved.resolvedToPath,
                statusCode: resolved.redirect.statusCode,
                hops: resolved.hops,
            },
        });
    } catch (error) {
        return toApiErrorResponse(error, "GET /api/redirects/resolve");
    }
}
