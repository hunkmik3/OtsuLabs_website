import { randomUUID } from "node:crypto";
import { resetCmsConfigForTests } from "../../lib/cms/config";
import { resetCmsRepositoryForTests } from "../../lib/cms/repository";
import {
    createAdminProject,
    deleteAdminProject,
    duplicateAdminProject,
    patchAdminProject,
    publishAdminProject,
    unpublishAdminProject,
} from "../../lib/cms/project-service";
import { getProjectByIdForPreview, getProjectBySlugForRender } from "../../lib/cms/render-resolver";
import { cmsLogger } from "../../lib/cms/logger";

const main = async () => {
    if (!process.env.CMS_DATABASE_URL && !process.env.DATABASE_URL) {
        throw new Error("CMS_DATABASE_URL (or DATABASE_URL) is required.");
    }

    process.env.CMS_REPOSITORY_MODE = "postgres";
    resetCmsConfigForTests();
    resetCmsRepositoryForTests();

    const slug = `cms-postgres-verify-${randomUUID().slice(0, 8)}`;
    let primaryProjectId = "";
    let duplicateProjectId = "";

    try {
        const created = await createAdminProject({
            title: "CMS Postgres Verify",
            slug,
            templateId: "blank-v1",
        });
        primaryProjectId = created.id;
        cmsLogger.info("CMS postgres verify created draft project.", {
            projectId: created.id,
            slug: created.slug,
        });

        const updated = await patchAdminProject(created.id, {
            basicInfo: {
                title: "CMS Postgres Verify Updated",
                clientName: "CMS Verify",
            },
            seo: {
                title: "CMS Postgres Verify SEO",
                description: "Verification document for postgres mode.",
                noindex: true,
            },
        });
        cmsLogger.info("CMS postgres verify patched project.", {
            projectId: updated.id,
            slug: updated.slug,
        });

        const published = await publishAdminProject(created.id);
        const publicView = await getProjectBySlugForRender(published.slug);
        if (!publicView) {
            throw new Error("Published project was not available in public render resolver.");
        }

        const duplicate = await duplicateAdminProject(created.id);
        duplicateProjectId = duplicate.id;
        const duplicatePublicView = await getProjectBySlugForRender(duplicate.slug);
        if (duplicatePublicView) {
            throw new Error("Draft duplicate should not be available to public render resolver.");
        }
        const duplicatePreview = await getProjectByIdForPreview(duplicate.id);
        if (!duplicatePreview) {
            throw new Error("Duplicate project should be available to preview resolver.");
        }

        await unpublishAdminProject(created.id);

        cmsLogger.info("CMS postgres verify flow succeeded.", {
            primaryProjectId,
            duplicateProjectId,
        });
    } finally {
        if (duplicateProjectId) {
            await deleteAdminProject(duplicateProjectId).catch(() => undefined);
        }
        if (primaryProjectId) {
            await deleteAdminProject(primaryProjectId).catch(() => undefined);
        }
        resetCmsRepositoryForTests();
        resetCmsConfigForTests();
    }
};

main().catch((error) => {
    cmsLogger.error("CMS postgres verify command failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});

