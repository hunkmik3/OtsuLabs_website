import test from "node:test";
import assert from "node:assert/strict";
import { resetCmsConfigForTests } from "../../lib/cms/config";
import {
    getCmsAdminSessionCookieName,
    isAuthorizedAdminRequest,
    isCmsAdminProtectionEnabled,
} from "../../lib/cms/auth";
import {
    createAdminSessionCookieValue,
    verifyAdminSessionCookieValue,
} from "../../lib/cms/admin-session";

test("CMS auth session token can be created and verified", async () => {
    process.env.CMS_ADMIN_TOKEN = "phase6-auth-token";
    process.env.CMS_AUTH_SECRET = "phase6-auth-secret";
    resetCmsConfigForTests();

    const cookieValue = await createAdminSessionCookieValue({
        authSecret: process.env.CMS_AUTH_SECRET!,
        ttlSeconds: 120,
    });
    const verification = await verifyAdminSessionCookieValue({
        cookieValue,
        authSecret: process.env.CMS_AUTH_SECRET!,
    });

    assert.equal(verification.valid, true);
});

test("CMS auth middleware helpers accept header token and signed cookie", async () => {
    process.env.CMS_ADMIN_TOKEN = "phase6-auth-token";
    process.env.CMS_AUTH_SECRET = "phase6-auth-secret";
    resetCmsConfigForTests();

    assert.equal(isCmsAdminProtectionEnabled(), true);

    const unauthorizedRequest = new Request("http://localhost/api/admin/projects");
    const unauthorized = await isAuthorizedAdminRequest(unauthorizedRequest);
    assert.equal(unauthorized, false);

    const headerAuthorized = await isAuthorizedAdminRequest(
        new Request("http://localhost/api/admin/projects", {
            headers: {
                "x-cms-admin-token": process.env.CMS_ADMIN_TOKEN!,
            },
        })
    );
    assert.equal(headerAuthorized, true);

    const sessionCookie = await createAdminSessionCookieValue({
        authSecret: process.env.CMS_AUTH_SECRET!,
        ttlSeconds: 300,
    });
    const cookieAuthorized = await isAuthorizedAdminRequest(
        new Request("http://localhost/api/admin/projects", {
            headers: {
                cookie: `${getCmsAdminSessionCookieName()}=${encodeURIComponent(sessionCookie)}`,
            },
        })
    );
    assert.equal(cookieAuthorized, true);
});

