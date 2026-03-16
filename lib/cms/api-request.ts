import { CmsApiError } from "@/lib/cms/api-response";

export const parseJsonBody = async (request: Request): Promise<unknown> => {
    try {
        return await request.json();
    } catch {
        throw new CmsApiError(400, "INVALID_JSON", "Request body must be valid JSON.");
    }
};
