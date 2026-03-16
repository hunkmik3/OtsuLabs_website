import { NextResponse } from "next/server";
import { cmsLogger } from "@/lib/cms/logger";

export interface ApiErrorPayload {
    code: string;
    message: string;
    details?: unknown;
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    error: ApiErrorPayload;
}

export const apiOk = <T>(data: T, status = 200) =>
    NextResponse.json<ApiSuccessResponse<T>>(
        {
            success: true,
            data,
        },
        { status }
    );

export const apiError = (status: number, code: string, message: string, details?: unknown) =>
    NextResponse.json<ApiErrorResponse>(
        {
            success: false,
            error: {
                code,
                message,
                ...(details !== undefined ? { details } : {}),
            },
        },
        { status }
    );

export class CmsApiError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: unknown;

    constructor(status: number, code: string, message: string, details?: unknown) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export const toApiErrorResponse = (error: unknown, context?: string) => {
    if (error instanceof CmsApiError) {
        const details = {
            context: context || "api",
            status: error.status,
            code: error.code,
            message: error.message,
            ...(error.details !== undefined ? { errorDetails: error.details } : {}),
        };

        if (error.status >= 500) {
            cmsLogger.error("CMS API handled error.", details);
        } else {
            cmsLogger.warn("CMS API request failed.", details);
        }

        return apiError(error.status, error.code, error.message, error.details);
    }

    cmsLogger.error("CMS API unexpected error.", {
        context: context || "api",
        error: cmsLogger.normalizeError(error),
    });

    return apiError(500, "INTERNAL_ERROR", "Unexpected server error.");
};
