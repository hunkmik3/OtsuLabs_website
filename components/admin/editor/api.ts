"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { AdminApiResponse } from "@/components/admin/editor/types";
import { AdminClientError } from "@/components/admin/editor/types";

const detailLines = (details: unknown) => {
    if (!Array.isArray(details)) return "";
    if (!details.every((item) => item && typeof item === "object")) return "";

    return (details as { field?: string; message?: string }[])
        .map((item) => `${item.field || "field"}: ${item.message || "invalid"}`)
        .join("\n");
};

export const formatApiError = (payload?: AdminApiResponse<unknown>) => {
    if (!payload?.error) return "Unknown error.";
    const lines = detailLines(payload.error.details);
    return lines ? `${payload.error.message || "Request failed."}\n${lines}` : payload.error.message || "Request failed.";
};

export const useAdminClientApi = () => {
    const router = useRouter();

    const request = useCallback(
        async <T>(url: string, init?: RequestInit): Promise<T> => {
            const response = await fetch(url, {
                cache: "no-store",
                ...init,
            });
            const payload = (await response.json()) as AdminApiResponse<T>;

            if (response.status === 401) {
                const nextPath = `${window.location.pathname}${window.location.search}`;
                router.push(`/admin/login?next=${encodeURIComponent(nextPath)}`);
                throw new AdminClientError("Unauthorized.", 401);
            }

            if (!response.ok || !payload.success || payload.data === undefined) {
                throw new AdminClientError(
                    formatApiError(payload),
                    response.status,
                    payload.error?.details
                );
            }

            return payload.data;
        },
        [router]
    );

    return useMemo(
        () => ({
            request,
        }),
        [request]
    );
};
