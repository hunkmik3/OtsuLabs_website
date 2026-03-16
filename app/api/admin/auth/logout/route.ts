import { NextResponse } from "next/server";
import {
    getCmsAdminCookieDomain,
    getCmsAdminCookieSameSite,
    getCmsAdminCookieSecure,
    getCmsAdminSessionCookieName,
} from "@/lib/cms/auth";
import { cmsLogger } from "@/lib/cms/logger";

export async function POST() {
    cmsLogger.info("CMS admin logout.", {
        route: "POST /api/admin/auth/logout",
    });

    const response = NextResponse.json({
        success: true,
        data: {
            authenticated: false,
        },
    });

    response.cookies.set(getCmsAdminSessionCookieName(), "", {
        httpOnly: true,
        sameSite: getCmsAdminCookieSameSite(),
        secure: getCmsAdminCookieSecure(),
        path: "/",
        ...(getCmsAdminCookieDomain() ? { domain: getCmsAdminCookieDomain() } : {}),
        maxAge: 0,
    });

    return response;
}
