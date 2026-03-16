import type { NextRequest } from "next/server";
import { getCmsConfig } from "@/lib/cms/config";
import { verifyAdminSessionCookieValue } from "@/lib/cms/admin-session";

const readCookieValue = (request: Request | NextRequest, cookieName: string) => {
    if ("cookies" in request && typeof request.cookies?.get === "function") {
        const cookieValue = request.cookies.get(cookieName)?.value;
        if (cookieValue) return cookieValue;
    }

    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const pairs = cookieHeader.split(";").map((chunk) => chunk.trim());
    const matched = pairs.find((pair) => pair.startsWith(`${cookieName}=`));
    if (!matched) return null;
    return decodeURIComponent(matched.slice(cookieName.length + 1));
};

const getHeaderToken = (request: Request | NextRequest, headerName: string) => {
    const rawHeader = request.headers.get(headerName);
    if (rawHeader?.trim()) return rawHeader.trim();

    const authorization = request.headers.get("authorization");
    if (!authorization) return null;
    const [scheme, token] = authorization.split(" ");
    if (scheme?.toLowerCase() !== "bearer") return null;
    return token?.trim() || null;
};

export const getCmsAdminToken = () => getCmsConfig().auth.adminToken;
export const getCmsAdminSessionCookieName = () => getCmsConfig().auth.sessionCookieName;
export const getCmsAdminHeaderName = () => getCmsConfig().auth.adminHeaderName;
export const getCmsAdminSessionTtl = () => getCmsConfig().auth.sessionTtlSeconds;
export const getCmsAuthSecret = () => getCmsConfig().auth.authSecret;
export const getCmsAdminCookieSecure = () => getCmsConfig().auth.sessionCookieSecure;
export const getCmsAdminCookieSameSite = () => getCmsConfig().auth.sessionCookieSameSite;
export const getCmsAdminCookieDomain = () => getCmsConfig().auth.sessionCookieDomain;

export const isCmsAdminProtectionEnabled = () => Boolean(getCmsAdminToken());

export const isValidCmsAdminToken = (token: string | null | undefined) => {
    if (!token) return false;
    return token === getCmsAdminToken();
};

export const getAdminSessionCookieFromRequest = (request: Request | NextRequest) =>
    readCookieValue(request, getCmsAdminSessionCookieName());

export const getAdminHeaderTokenFromRequest = (request: Request | NextRequest) =>
    getHeaderToken(request, getCmsAdminHeaderName());

export const isAuthorizedAdminRequest = async (request: Request | NextRequest) => {
    if (!isCmsAdminProtectionEnabled()) {
        return true;
    }

    const headerToken = getAdminHeaderTokenFromRequest(request);
    if (isValidCmsAdminToken(headerToken)) {
        return true;
    }

    const sessionCookie = getAdminSessionCookieFromRequest(request);
    const verifiedSession = await verifyAdminSessionCookieValue({
        cookieValue: sessionCookie,
        authSecret: getCmsAuthSecret(),
    });
    return verifiedSession.valid;
};
