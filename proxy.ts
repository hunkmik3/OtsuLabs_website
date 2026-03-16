import { NextResponse, type NextRequest } from "next/server";
import {
    isAuthorizedAdminRequest,
    isCmsAdminProtectionEnabled,
} from "@/lib/cms/auth";
import { cmsLogger } from "@/lib/cms/logger";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_API_LOGIN_PATH = "/api/admin/auth/login";
const ADMIN_API_LOGOUT_PATH = "/api/admin/auth/logout";

const isAdminPagePath = (path: string) => path.startsWith("/admin");
const isAdminApiPath = (path: string) => path.startsWith("/api/admin");

const isWhitelistedPath = (path: string) =>
    path === ADMIN_LOGIN_PATH ||
    path === ADMIN_API_LOGIN_PATH ||
    path === ADMIN_API_LOGOUT_PATH;

const isWorkDetailPath = (path: string) => path.startsWith("/work/") && path !== "/work";

const resolveRuntimeRedirect = async (request: NextRequest) => {
    if (!["GET", "HEAD"].includes(request.method)) {
        return null;
    }

    if (!isWorkDetailPath(request.nextUrl.pathname)) {
        return null;
    }

    const lookupUrl = new URL("/api/redirects/resolve", request.url);
    lookupUrl.searchParams.set("path", request.nextUrl.pathname);

    try {
        const response = await fetch(lookupUrl.toString(), {
            method: "GET",
            headers: { "x-cms-proxy": "1" },
            cache: "no-store",
        });

        if (!response.ok) return null;
        const payload = (await response.json()) as {
            success?: boolean;
            data?: {
                redirect?: {
                    toPath?: string;
                    statusCode?: 301 | 302;
                } | null;
            };
        };

        if (!payload.success || !payload.data?.redirect?.toPath) {
            return null;
        }

        const toPath = payload.data.redirect.toPath;
        if (toPath === request.nextUrl.pathname) {
            return null;
        }

        const targetUrl = request.nextUrl.clone();
        targetUrl.pathname = toPath.startsWith("/") ? toPath : `/${toPath}`;
        if (!targetUrl.search && request.nextUrl.search) {
            targetUrl.search = request.nextUrl.search;
        }

        return NextResponse.redirect(targetUrl, payload.data.redirect.statusCode || 301);
    } catch {
        return null;
    }
};

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const runtimeRedirect = await resolveRuntimeRedirect(request);
    if (runtimeRedirect) {
        return runtimeRedirect;
    }

    if (!isAdminPagePath(pathname) && !isAdminApiPath(pathname)) {
        return NextResponse.next();
    }

    if (!isCmsAdminProtectionEnabled() || isWhitelistedPath(pathname)) {
        return NextResponse.next();
    }

    if (await isAuthorizedAdminRequest(request)) {
        return NextResponse.next();
    }

    cmsLogger.warn("CMS admin request blocked by proxy.", {
        path: pathname,
        type: isAdminApiPath(pathname) ? "api" : "page",
    });

    if (isAdminApiPath(pathname)) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Admin authentication required.",
                },
            },
            { status: 401 }
        );
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_LOGIN_PATH;
    const nextPath = `${pathname}${request.nextUrl.search}`;
    redirectUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ["/work/:path*", "/admin/:path*", "/api/admin/:path*"],
};
