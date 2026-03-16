import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
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

const pgUrl = process.env.CMS_DATABASE_URL || process.env.DATABASE_URL;

test(
    "postgres repository supports CMS lifecycle flow",
    { skip: !pgUrl },
    async () => {
        const schemaSuffix = randomUUID().slice(0, 8).replace(/[^a-z0-9]/g, "");
        const schemaName = `cms_test_${schemaSuffix}`;
        const tableName = "cms_projects";
        const slugSuffix = randomUUID().slice(0, 8).replace(/[^a-z0-9]/g, "");

        process.env.CMS_REPOSITORY_MODE = "postgres";
        process.env.CMS_DATABASE_URL = pgUrl!;
        process.env.CMS_DATABASE_SCHEMA = schemaName;
        process.env.CMS_DATABASE_TABLE = tableName;
        process.env.CMS_DATABASE_SSL = process.env.CMS_DATABASE_SSL || "false";
        process.env.CMS_ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || "postgres-test-token";
        process.env.CMS_AUTH_SECRET = process.env.CMS_AUTH_SECRET || "postgres-test-secret";

        resetCmsConfigForTests();
        resetCmsRepositoryForTests();

        const cleanupPool = new Pool({
            connectionString: pgUrl!,
            ssl: process.env.CMS_DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
        });

        let primaryProjectId = "";
        let duplicateProjectId = "";

        try {
            const draft = await createAdminProject({
                title: `Postgres Test ${slugSuffix}`,
                slug: `postgres-test-${slugSuffix}`,
                templateId: "blank-v1",
            });
            primaryProjectId = draft.id;
            assert.equal(draft.status, "draft");

            const updated = await patchAdminProject(draft.id, {
                basicInfo: {
                    title: `Postgres Test Updated ${slugSuffix}`,
                    clientName: "Postgres Client",
                },
                seo: {
                    title: `Postgres SEO ${slugSuffix}`,
                    description: "Postgres integration description.",
                },
            });
            assert.equal(updated.basicInfo.clientName, "Postgres Client");

            const published = await publishAdminProject(draft.id);
            assert.equal(published.status, "published");
            const publicProject = await getPublicProjectBySlug(published.slug);
            assert.equal(publicProject.id, published.id);

            const duplicate = await duplicateAdminProject(draft.id);
            duplicateProjectId = duplicate.id;
            assert.equal(duplicate.status, "draft");

            const backToDraft = await unpublishAdminProject(draft.id);
            assert.equal(backToDraft.status, "draft");
        } finally {
            if (duplicateProjectId) {
                await deleteAdminProject(duplicateProjectId).catch(() => undefined);
            }
            if (primaryProjectId) {
                await deleteAdminProject(primaryProjectId).catch(() => undefined);
            }

            await cleanupPool.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
            await cleanupPool.end();
            resetCmsRepositoryForTests();
            resetCmsConfigForTests();
        }
    }
);

