import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { apiOk, CmsApiError, toApiErrorResponse } from "@/lib/cms/api-response";
import { createCmsMediaStorage } from "@/lib/cms/media-storage";
import { cmsLogger } from "@/lib/cms/logger";

export async function POST(request: Request) {
    try {
        await assertAdminRequest(request);

        const formData = await request.formData();
        const file = formData.get("file");
        const altValue = String(formData.get("alt") || "").trim();

        if (!(file instanceof File)) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "file is required.");
        }

        const storage = createCmsMediaStorage();
        const storedMedia = await storage.save({
            file,
            alt: altValue || file.name,
        });

        cmsLogger.info("CMS media uploaded.", {
            filename: storedMedia.filename,
            mimeType: storedMedia.mimeType,
            bytes: storedMedia.bytes,
        });

        return apiOk(
            {
                media: storedMedia.media,
                bytes: storedMedia.bytes,
                mimeType: storedMedia.mimeType,
            },
            201
        );
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/media");
    }
}
