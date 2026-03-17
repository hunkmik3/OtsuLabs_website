import { assertAdminRequest } from "@/lib/cms/admin-auth";
import { apiOk, CmsApiError, toApiErrorResponse } from "@/lib/cms/api-response";
import { createCmsMediaUploadPlan } from "@/lib/cms/media-storage";
import { cmsLogger } from "@/lib/cms/logger";

interface PresignRequestBody {
    fileName?: string;
    contentType?: string;
    size?: number;
    alt?: string;
}

export async function POST(request: Request) {
    try {
        await assertAdminRequest(request);

        const body = (await request.json()) as PresignRequestBody;
        const fileName = (body.fileName || "").trim();
        const contentType = (body.contentType || "").trim().toLowerCase();
        const size = Number(body.size);

        if (!fileName) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "fileName is required.");
        }
        if (!contentType) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "contentType is required.");
        }
        if (!Number.isFinite(size) || size <= 0) {
            throw new CmsApiError(400, "VALIDATION_ERROR", "size must be a positive number.");
        }

        const uploadPlan = await createCmsMediaUploadPlan({
            fileName,
            mimeType: contentType,
            bytes: size,
            alt: body.alt?.trim() || fileName,
        });

        cmsLogger.info("CMS media upload plan created.", {
            mode: uploadPlan.mode,
            filename: uploadPlan.filename,
            mimeType: uploadPlan.mimeType,
            bytes: uploadPlan.bytes,
        });

        return apiOk(
            {
                mode: uploadPlan.mode,
                media: uploadPlan.media,
                upload: uploadPlan.upload,
                filename: uploadPlan.filename,
                bytes: uploadPlan.bytes,
                mimeType: uploadPlan.mimeType,
            },
            201
        );
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/media/presign");
    }
}

