import type { CmsProjectDocument } from "@/lib/cms/types";

export interface AdminApiErrorPayload {
    code?: string;
    message?: string;
    details?: unknown;
}

export interface AdminApiResponse<T> {
    success: boolean;
    data?: T;
    error?: AdminApiErrorPayload;
}

export class AdminClientError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(message: string, status = 500, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export interface AdminProjectResponse {
    project: CmsProjectDocument;
}
