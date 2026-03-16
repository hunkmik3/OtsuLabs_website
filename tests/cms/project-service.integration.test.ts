import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resetCmsConfigForTests } from "../../lib/cms/config";
import { resetCmsRepositoryForTests } from "../../lib/cms/repository";
import {
    createAdminProject,
    deleteAdminProject,
    duplicateAdminProject,
    getPublicProjectBySlug,
    patchAdminProject,
    publishAdminProject,
    unpublishAdminProject,
} from "../../lib/cms/project-service";
import { getProjectByIdForPreview, getProjectBySlugForRender } from "../../lib/cms/render-resolver";

const configureTempFileRepository = async () => {
    const workingDir = await mkdtemp(join(tmpdir(), "otsu-cms-test-"));
    const storePath = join(workingDir, "projects.json");

    process.env.CMS_REPOSITORY_MODE = "file";
    process.env.CMS_DATA_FILE_PATH = storePath;
    process.env.CMS_ADMIN_TOKEN = "phase6-test-token";
    process.env.CMS_AUTH_SECRET = "phase6-test-secret";
    process.env.CMS_PUBLIC_BASE_URL = "http://localhost:3000";
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

test("project service supports critical draft/publish/duplicate flow with public policy", async () => {
    const runtime = await configureTempFileRepository();
    try {
        const suffix = Date.now();
        const draft = await createAdminProject({
            title: `Phase 6 Draft ${suffix}`,
            slug: `phase6-draft-${suffix}`,
            templateId: "blank-v1",
        });

        assert.equal(draft.status, "draft");

        const patched = await patchAdminProject(draft.id, {
            basicInfo: {
                title: `Phase 6 Draft Updated ${suffix}`,
                clientName: "Phase 6 Client",
            },
            seo: {
                title: `Phase 6 SEO ${suffix}`,
                description: "Phase 6 integration test description.",
                noindex: true,
            },
        });
        assert.equal(patched.basicInfo.clientName, "Phase 6 Client");

        const published = await publishAdminProject(draft.id);
        assert.equal(published.status, "published");

        const publicProject = await getPublicProjectBySlug(published.slug);
        assert.equal(publicProject.id, published.id);

        const duplicated = await duplicateAdminProject(published.id);
        assert.equal(duplicated.status, "draft");
        assert.match(duplicated.slug, /copy/);

        const previewDraft = await getProjectByIdForPreview(duplicated.id);
        assert.ok(previewDraft);

        const publicDraft = await getProjectBySlugForRender(duplicated.slug);
        assert.equal(publicDraft, null);

        const unpublished = await unpublishAdminProject(published.id);
        assert.equal(unpublished.status, "draft");

        await assert.rejects(() => getPublicProjectBySlug(unpublished.slug));

        await deleteAdminProject(duplicated.id);
        await deleteAdminProject(unpublished.id);
    } finally {
        await runtime.cleanup();
    }
});

