import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Pool } from "pg";
import { getCmsConfig } from "../../lib/cms/config";
import { cmsLogger } from "../../lib/cms/logger";
import { ensureCmsPostgresSchema, getCmsPostgresSchemaConfig } from "../../lib/cms/postgres-schema";
import { parseCliArgs, quoteSqlIdentifier, resolvePath } from "./_helpers";

const MIGRATIONS_TABLE_NAME = "cms_migrations";

const applyTemplateVariables = (sql: string) => {
    const schema = getCmsPostgresSchemaConfig();
    const replacements: Record<string, string> = {
        "{{CMS_SCHEMA}}": quoteSqlIdentifier(schema.schemaName),
        "{{CMS_TABLE}}": quoteSqlIdentifier(schema.tableName),
        "{{CMS_QUALIFIED_TABLE}}": schema.qualifiedTableName,
        "{{CMS_REDIRECT_TABLE}}": quoteSqlIdentifier(schema.redirectTableName),
        "{{CMS_QUALIFIED_REDIRECT_TABLE}}": schema.qualifiedRedirectTableName,
        "{{CMS_STATUS_INDEX}}": quoteSqlIdentifier(schema.statusIndexName),
        "{{CMS_ORDER_INDEX}}": quoteSqlIdentifier(schema.orderIndexName),
        "{{CMS_UPDATED_INDEX}}": quoteSqlIdentifier(schema.updatedIndexName),
        "{{CMS_REDIRECT_FROM_INDEX}}": quoteSqlIdentifier(schema.redirectFromPathIndexName),
        "{{CMS_REDIRECT_TO_INDEX}}": quoteSqlIdentifier(schema.redirectToPathIndexName),
    };

    return Object.entries(replacements).reduce(
        (content, [token, value]) => content.replaceAll(token, value),
        sql
    );
};

const main = async () => {
    const args = parseCliArgs(process.argv.slice(2));
    const migrationDir = resolvePath(args.get("dir") || "data/cms/migrations");

    const config = getCmsConfig();
    if (!config.repository.postgresUrl) {
        throw new Error("CMS_DATABASE_URL (or DATABASE_URL) is required.");
    }

    const pool = new Pool({
        connectionString: config.repository.postgresUrl,
        ssl: config.repository.postgresSsl ? { rejectUnauthorized: false } : false,
    });

    try {
        const schema = await ensureCmsPostgresSchema(pool);
        const migrationTable = `${quoteSqlIdentifier(schema.schemaName)}.${quoteSqlIdentifier(
            MIGRATIONS_TABLE_NAME
        )}`;

        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${migrationTable} (
                name TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const files = (await readdir(migrationDir))
            .filter((file) => file.endsWith(".sql"))
            .sort((left, right) => left.localeCompare(right));

        if (files.length === 0) {
            cmsLogger.warn("No CMS migration files were found.", { migrationDir });
            return;
        }

        const appliedResult = await pool.query<{ name: string }>(`SELECT name FROM ${migrationTable};`);
        const appliedSet = new Set(appliedResult.rows.map((row) => row.name));

        for (const file of files) {
            if (appliedSet.has(file)) {
                cmsLogger.debug("CMS migration already applied.", { file });
                continue;
            }

            const fullPath = join(migrationDir, file);
            const rawSql = await readFile(fullPath, "utf8");
            const sql = applyTemplateVariables(rawSql);
            const client = await pool.connect();

            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query(`INSERT INTO ${migrationTable} (name) VALUES ($1);`, [file]);
                await client.query("COMMIT");
                cmsLogger.info("CMS migration applied.", { file });
            } catch (error) {
                await client.query("ROLLBACK");
                cmsLogger.error("CMS migration failed.", {
                    file,
                    error: cmsLogger.normalizeError(error),
                });
                throw error;
            } finally {
                client.release();
            }
        }

        cmsLogger.info("CMS postgres migration completed.", {
            migrationDir,
            schema: schema.schemaName,
            table: schema.tableName,
        });
    } finally {
        await pool.end();
    }
};

main().catch((error) => {
    cmsLogger.error("CMS postgres migration command failed.", {
        error: cmsLogger.normalizeError(error),
    });
    process.exitCode = 1;
});
