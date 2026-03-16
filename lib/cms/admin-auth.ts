import { CmsApiError } from "@/lib/cms/api-response";
import { isAuthorizedAdminRequest } from "@/lib/cms/auth";

export const assertAdminRequest = async (request: Request) => {
    const authorized = await isAuthorizedAdminRequest(request);
    if (!authorized) {
        throw new CmsApiError(401, "UNAUTHORIZED", "Admin authentication failed.");
    }
};
