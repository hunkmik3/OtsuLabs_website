import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resetCmsConfigForTests } from "../../lib/cms/config";
import { resetCmsRepositoryForTests } from "../../lib/cms/repository";

const configureTempRuntime = async () => {
    const workingDir = await mkdtemp(join(tmpdir(), "otsu-cms-api-test-"));
    process.env.CMS_REPOSITORY_MODE = "file";
    process.env.CMS_DATA_FILE_PATH = join(workingDir, "projects.json");
    process.env.CMS_ADMIN_TOKEN = "phase6-api-token";
    process.env.CMS_AUTH_SECRET = "phase6-api-secret";
    resetCmsConfigForTests();
    resetCmsRepositoryForTests();

    return {
        workingDir,
        async cleanup() {
            resetCmsRepositoryForTests();
            resetCmsConfigForTests();
            await rm(workingDir, { recursive: true, force: true });
        },
    };
};

test("admin/public route handlers enforce published-only policy", async () => {
    const runtime = await configureTempRuntime();
    try {
        const adminProjectsRoute = (await import("../../app/api/admin/projects/route")) as {
            GET: (request: Request) => Promise<Response>;
            POST: (request: Request) => Promise<Response>;
        };
        const adminProjectByIdRoute = (await import("../../app/api/admin/projects/[id]/route")) as {
            PATCH: (request: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>;
            DELETE: (request: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>;
        };
        const adminPublishRoute = (await import("../../app/api/admin/projects/[id]/publish/route")) as {
            POST: (request: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>;
        };
        const adminUnpublishRoute = (await import("../../app/api/admin/projects/[id]/unpublish/route")) as {
            POST: (request: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>;
        };
        const publicProjectRoute = (await import("../../app/api/projects/[slug]/route")) as {
            GET: (request: Request, ctx: { params: Promise<{ slug: string }> }) => Promise<Response>;
        };

        const adminHeaders = {
            "content-type": "application/json",
            "x-cms-admin-token": process.env.CMS_ADMIN_TOKEN!,
        };

        const createResponse = await adminProjectsRoute.POST(
            new Request("http://localhost/api/admin/projects", {
                method: "POST",
                headers: adminHeaders,
                body: JSON.stringify({
                    title: "Phase 6 API Route Test",
                    slug: "phase6-api-route-test",
                    templateId: "blank-v1",
                }),
            })
        );
        assert.equal(createResponse.status, 201);
        const createdPayload = (await createResponse.json()) as {
            data?: { project?: { id?: string; slug?: string } };
        };
        const projectId = createdPayload.data?.project?.id || "";
        const slug = createdPayload.data?.project?.slug || "";
        assert.ok(projectId);
        assert.ok(slug);

        const draftPublicResponse = await publicProjectRoute.GET(
            new Request(`http://localhost/api/projects/${slug}`),
            { params: Promise.resolve({ slug }) }
        );
        assert.equal(draftPublicResponse.status, 404);

        const publishResponse = await adminPublishRoute.POST(
            new Request(`http://localhost/api/admin/projects/${projectId}/publish`, {
                method: "POST",
                headers: adminHeaders,
            }),
            { params: Promise.resolve({ id: projectId }) }
        );
        assert.equal(publishResponse.status, 200);

        const publishedPublicResponse = await publicProjectRoute.GET(
            new Request(`http://localhost/api/projects/${slug}`),
            { params: Promise.resolve({ slug }) }
        );
        assert.equal(publishedPublicResponse.status, 200);

        const unpublishResponse = await adminUnpublishRoute.POST(
            new Request(`http://localhost/api/admin/projects/${projectId}/unpublish`, {
                method: "POST",
                headers: adminHeaders,
            }),
            { params: Promise.resolve({ id: projectId }) }
        );
        assert.equal(unpublishResponse.status, 200);

        const updateResponse = await adminProjectByIdRoute.PATCH(
            new Request(`http://localhost/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: adminHeaders,
                body: JSON.stringify({
                    basicInfo: {
                        clientName: "Route Test Client",
                    },
                }),
            }),
            { params: Promise.resolve({ id: projectId }) }
        );
        assert.equal(updateResponse.status, 200);

        const deleteResponse = await adminProjectByIdRoute.DELETE(
            new Request(`http://localhost/api/admin/projects/${projectId}`, {
                method: "DELETE",
                headers: adminHeaders,
            }),
            { params: Promise.resolve({ id: projectId }) }
        );
        assert.equal(deleteResponse.status, 200);

        const adminListResponse = await adminProjectsRoute.GET(
            new Request("http://localhost/api/admin/projects", {
                headers: adminHeaders,
            })
        );
        assert.equal(adminListResponse.status, 200);
    } finally {
        await runtime.cleanup();
    }
});

