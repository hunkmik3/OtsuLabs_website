import { createCmsProjectRepository } from "@/lib/cms/repository";
import type {
    CmsRedirectRecord,
    RedirectStatusCode,
    UpsertRedirectInput,
} from "@/lib/cms/types";
import { CmsApiError } from "@/lib/cms/api-response";

const MAX_REDIRECT_HOPS = 10;

export const normalizeRedirectPath = (path: string) => {
    const trimmed = path.trim();
    if (!trimmed) return "/";

    try {
        const url = new URL(trimmed);
        const normalized = url.pathname || "/";
        return normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
    } catch {
        const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return withSlash === "/" ? "/" : withSlash.replace(/\/+$/, "");
    }
};

const normalizeStatusCode = (statusCode?: RedirectStatusCode): RedirectStatusCode =>
    statusCode === 302 ? 302 : 301;

const ensurePathInput = (value: unknown, fieldName: string) => {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new CmsApiError(400, "VALIDATION_ERROR", `${fieldName} is required.`);
    }
    return normalizeRedirectPath(value);
};

export interface ResolveRedirectResult {
    redirect: CmsRedirectRecord;
    resolvedToPath: string;
    hops: number;
}

export const resolveRedirectPath = async (path: string): Promise<ResolveRedirectResult | null> => {
    const repository = createCmsProjectRepository();
    const startPath = normalizeRedirectPath(path);
    const visited = new Set<string>();

    let currentPath = startPath;
    let firstRedirect: CmsRedirectRecord | null = null;
    let hops = 0;

    while (hops < MAX_REDIRECT_HOPS) {
        if (visited.has(currentPath)) {
            return null;
        }
        visited.add(currentPath);

        const redirect = await repository.getRedirectByFromPath(currentPath);
        if (!redirect) {
            if (!firstRedirect) return null;
            return {
                redirect: firstRedirect,
                resolvedToPath: currentPath,
                hops,
            };
        }

        const nextPath = normalizeRedirectPath(redirect.toPath);
        if (!firstRedirect) {
            firstRedirect = redirect;
        }

        if (nextPath === currentPath || nextPath === startPath) {
            return null;
        }

        currentPath = nextPath;
        hops += 1;
    }

    return null;
};

export const listAdminRedirects = async () => {
    const repository = createCmsProjectRepository();
    const redirects = await repository.getAllRedirects();
    return redirects.sort((a, b) => a.fromPath.localeCompare(b.fromPath));
};

export const upsertAdminRedirect = async (payload: unknown) => {
    const repository = createCmsProjectRepository();
    const body = (payload ?? {}) as Record<string, unknown>;

    const fromPath = ensurePathInput(body.fromPath, "fromPath");
    const toPath = ensurePathInput(body.toPath, "toPath");

    if (fromPath === toPath) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "fromPath and toPath must be different.");
    }

    const statusCode = normalizeStatusCode(
        body.statusCode === 302 ? 302 : body.statusCode === 301 ? 301 : undefined
    );

    const loopCheck = await resolveRedirectPath(toPath);
    if (loopCheck?.resolvedToPath === fromPath) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "Redirect loop detected.");
    }

    const redirect = await repository.upsertRedirect({
        fromPath,
        toPath,
        statusCode,
    } as UpsertRedirectInput);

    return redirect;
};

export const deleteAdminRedirect = async (id: string) => {
    const repository = createCmsProjectRepository();
    await repository.deleteRedirect(id);
    return { id };
};
