import { apiError, apiOk, toApiErrorResponse } from "@/lib/cms/api-response";
import {
    getCmsAdminCookieDomain,
    getCmsAdminCookieSameSite,
    getCmsAdminCookieSecure,
    getCmsAdminSessionCookieName,
    getCmsAdminSessionTtl,
    getCmsAuthSecret,
    isCmsAdminProtectionEnabled,
    isValidCmsAdminToken,
} from "@/lib/cms/auth";
import { createAdminSessionCookieValue } from "@/lib/cms/admin-session";
import { parseJsonBody } from "@/lib/cms/api-request";
import { NextResponse } from "next/server";
import { cmsLogger } from "@/lib/cms/logger";

export async function POST(request: Request) {
    try {
        const body = (await parseJsonBody(request)) as { token?: string };

        if (!isCmsAdminProtectionEnabled()) {
            cmsLogger.info("CMS admin login bypassed (protection disabled).", {
                route: "POST /api/admin/auth/login",
            });
            return apiOk({ authenticated: true, protectionEnabled: false });
        }

        const token = typeof body.token === "string" ? body.token.trim() : "";
        if (!isValidCmsAdminToken(token)) {
            cmsLogger.warn("CMS admin login failed: invalid token.", {
                route: "POST /api/admin/auth/login",
            });
            return apiError(401, "UNAUTHORIZED", "Invalid admin token.");
        }

        const sessionCookieValue = await createAdminSessionCookieValue({
            authSecret: getCmsAuthSecret(),
            ttlSeconds: getCmsAdminSessionTtl(),
        });

        const response = NextResponse.json({
            success: true,
            data: {
                authenticated: true,
                protectionEnabled: true,
            },
        });

        response.cookies.set(getCmsAdminSessionCookieName(), sessionCookieValue, {
            httpOnly: true,
            sameSite: getCmsAdminCookieSameSite(),
            secure: getCmsAdminCookieSecure(),
            path: "/",
            ...(getCmsAdminCookieDomain() ? { domain: getCmsAdminCookieDomain() } : {}),
            maxAge: getCmsAdminSessionTtl(),
            expires: new Date(Date.now() + getCmsAdminSessionTtl() * 1000),
        });

        cmsLogger.info("CMS admin login succeeded.", {
            route: "POST /api/admin/auth/login",
        });

        return response;
    } catch (error) {
        return toApiErrorResponse(error, "POST /api/admin/auth/login");
    }
}
