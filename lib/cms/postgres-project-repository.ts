import { Pool, type PoolClient } from "pg";
import { buildProjectFromTemplate, normalizeCreateInput } from "@/lib/cms/templates";
import { createRedirectId } from "@/lib/cms/ids";
import type {
    CmsProjectDocument,
    CmsProjectRepository,
    CmsRedirectRecord,
    CreateProjectFromTemplateInput,
    CreateProjectInput,
    ProjectBasicInfo,
    ProjectSection,
    ProjectSeoMeta,
    RedirectStatusCode,
    UpsertRedirectInput,
    UpdateProjectInput,
} from "@/lib/cms/types";
import { getCmsConfig } from "@/lib/cms/config";
import { ensureCmsPostgresSchema, getCmsPostgresSchemaConfig } from "@/lib/cms/postgres-schema";
import { cmsLogger } from "@/lib/cms/logger";

interface ProjectRow {
    id: string;
    slug: string;
    status: CmsProjectDocument["status"];
    sort_order: number;
    template_id: CmsProjectDocument["templateId"];
    template_version: string;
    slug_history: string[] | null;
    basic_info: ProjectBasicInfo;
    seo: ProjectSeoMeta;
    sections: ProjectSection[];
    created_at: Date | string;
    updated_at: Date | string;
    published_at: Date | string | null;
}

interface RedirectRow {
    id: string;
    from_path: string;
    to_path: string;
    status_code: RedirectStatusCode;
    created_at: Date | string;
    updated_at: Date | string;
}

const normalizeRedirectPath = (path: string) => {
    const trimmed = path.trim();
    if (!trimmed) return "/";

    try {
        const fromUrl = new URL(trimmed);
        const normalized = fromUrl.pathname || "/";
        return normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
    } catch {
        const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return withSlash === "/" ? "/" : withSlash.replace(/\/+$/, "");
    }
};

const normalizeRedirectStatusCode = (statusCode?: RedirectStatusCode): RedirectStatusCode =>
    statusCode === 302 ? 302 : 301;

const toIsoString = (value: Date | string | null | undefined) => {
    if (!value) return undefined;
    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const rowToDocument = (row: ProjectRow): CmsProjectDocument => {
    const seoTitle = row.seo.seoTitle || row.seo.title || row.basic_info.title;
    const metaDescription = row.seo.metaDescription || row.seo.description || row.basic_info.scopeSummary;

    return {
        id: row.id,
        slug: row.slug,
        slugHistory: Array.isArray(row.slug_history) ? row.slug_history : [],
        status: row.status,
        order: row.sort_order,
        templateId: row.template_id,
        templateVersion: row.template_version,
        basicInfo: row.basic_info,
        seo: {
            ...row.seo,
            seoTitle,
            title: row.seo.title || seoTitle,
            metaDescription,
            description: row.seo.description || metaDescription,
            canonicalUrl: row.seo.canonicalUrl || row.seo.canonical,
            canonical: row.seo.canonical || row.seo.canonicalUrl,
            includeInSitemap: row.seo.includeInSitemap ?? true,
            nofollow: row.seo.nofollow ?? false,
            schemaType: row.seo.schemaType || "caseStudy",
            ogTitle: row.seo.ogTitle || seoTitle,
            ogDescription: row.seo.ogDescription || metaDescription,
        },
        sections: row.sections,
        createdAt: toIsoString(row.created_at) || new Date().toISOString(),
        updatedAt: toIsoString(row.updated_at) || new Date().toISOString(),
        ...(toIsoString(row.published_at) ? { publishedAt: toIsoString(row.published_at) } : {}),
    };
};

const rowToRedirect = (row: RedirectRow): CmsRedirectRecord => ({
    id: row.id,
    fromPath: row.from_path,
    toPath: row.to_path,
    statusCode: row.status_code,
    createdAt: toIsoString(row.created_at) || new Date().toISOString(),
    updatedAt: toIsoString(row.updated_at) || new Date().toISOString(),
});

const documentToParams = (doc: CmsProjectDocument) => [
    doc.id,
    doc.slug,
    doc.status,
    doc.order,
    doc.templateId,
    doc.templateVersion,
    JSON.stringify(doc.slugHistory || []),
    JSON.stringify(doc.basicInfo),
    JSON.stringify(doc.seo),
    JSON.stringify(doc.sections),
    doc.createdAt,
    doc.updatedAt,
    doc.publishedAt ?? null,
];

export class PostgresCmsProjectRepository implements CmsProjectRepository {
    private pool: Pool | null = null;
    private schemaEnsured = false;

    private getPool() {
        if (this.pool) return this.pool;

        const config = getCmsConfig();
        if (!config.repository.postgresUrl) {
            throw new Error("CMS_DATABASE_URL (or DATABASE_URL) is required for postgres mode.");
        }

        this.pool = new Pool({
            connectionString: config.repository.postgresUrl,
            ssl: config.repository.postgresSsl ? { rejectUnauthorized: false } : false,
            max: 8,
        });
        return this.pool;
    }

    private async ensureSchema(client?: PoolClient) {
        if (this.schemaEnsured) return;
        const executor = client ?? this.getPool();
        await ensureCmsPostgresSchema(executor);
        this.schemaEnsured = true;
    }

    private getQualifiedTableName() {
        return getCmsPostgresSchemaConfig().qualifiedTableName;
    }

    private getQualifiedRedirectTableName() {
        return getCmsPostgresSchemaConfig().qualifiedRedirectTableName;
    }

    private async withTransaction<T>(work: (client: PoolClient) => Promise<T>) {
        const pool = this.getPool();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await this.ensureSchema(client);
            const result = await work(client);
            await client.query("COMMIT");
            return result;
        } catch (error) {
            await client.query("ROLLBACK");
            cmsLogger.error("CMS postgres transaction failed.", {
                table: this.getQualifiedTableName(),
                error: cmsLogger.normalizeError(error),
            });
            throw error;
        } finally {
            client.release();
        }
    }

    private async reindexProjects(client: PoolClient) {
        const table = this.getQualifiedTableName();
        await client.query(`
            WITH ranked AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order ASC, created_at ASC, id ASC) - 1 AS next_order
                FROM ${table}
            )
            UPDATE ${table} AS project
            SET sort_order = ranked.next_order
            FROM ranked
            WHERE project.id = ranked.id
              AND project.sort_order <> ranked.next_order;
        `);
    }

    private async readMany(sql: string, params: unknown[] = []) {
        try {
            await this.ensureSchema();
            const pool = this.getPool();
            const { rows } = await pool.query<ProjectRow>(sql, params);
            return rows.map(rowToDocument);
        } catch (error) {
            cmsLogger.error("CMS postgres query failed.", {
                table: this.getQualifiedTableName(),
                error: cmsLogger.normalizeError(error),
            });
            throw error;
        }
    }

    async getAllProjects(): Promise<CmsProjectDocument[]> {
        const table = this.getQualifiedTableName();
        return this.readMany(`SELECT * FROM ${table} ORDER BY sort_order ASC, created_at ASC, id ASC;`);
    }

    async getPublishedProjects(): Promise<CmsProjectDocument[]> {
        const table = this.getQualifiedTableName();
        return this.readMany(
            `SELECT * FROM ${table} WHERE status = 'published' ORDER BY sort_order ASC, created_at ASC, id ASC;`
        );
    }

    async getProjectById(id: string): Promise<CmsProjectDocument | null> {
        const table = this.getQualifiedTableName();
        const projects = await this.readMany(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1;`, [id]);
        return projects[0] ?? null;
    }

    async getProjectBySlug(slug: string): Promise<CmsProjectDocument | null> {
        const table = this.getQualifiedTableName();
        const normalizedSlug = slug.trim().toLowerCase();
        const projects = await this.readMany(`SELECT * FROM ${table} WHERE slug = $1 LIMIT 1;`, [normalizedSlug]);
        return projects[0] ?? null;
    }

    async createProjectFromTemplate(input: CreateProjectFromTemplateInput): Promise<CmsProjectDocument> {
        return this.withTransaction(async (client) => {
            const table = this.getQualifiedTableName();
            const { rows: countRows } = await client.query<{ count: string }>(
                `SELECT COUNT(*)::text AS count FROM ${table};`
            );
            const currentCount = Number(countRows[0]?.count || "0");
            const created = buildProjectFromTemplate({
                templateId: input.templateId,
                slug: input.slug.trim().toLowerCase(),
                title: input.title,
                clientName: input.clientName,
                order: input.order ?? currentCount,
                status: input.status ?? "draft",
            });

            await client.query(
                `
                    INSERT INTO ${table} (
                        id, slug, status, sort_order, template_id, template_version, slug_history, basic_info, seo, sections, created_at, updated_at, published_at
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12,$13);
                `,
                documentToParams(created)
            );

            await this.reindexProjects(client);
            const { rows } = await client.query<ProjectRow>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1;`, [
                created.id,
            ]);
            if (!rows[0]) {
                throw new Error("Created project could not be loaded.");
            }
            return rowToDocument(rows[0]);
        });
    }

    async createProject(input: CreateProjectInput): Promise<CmsProjectDocument> {
        return this.createProjectFromTemplate(normalizeCreateInput(input));
    }

    async updateProject(id: string, input: UpdateProjectInput): Promise<CmsProjectDocument> {
        return this.withTransaction(async (client) => {
            const table = this.getQualifiedTableName();
            const { rows } = await client.query<ProjectRow>(`SELECT * FROM ${table} WHERE id = $1 FOR UPDATE;`, [id]);
            if (!rows[0]) {
                throw new Error(`Project with id '${id}' was not found.`);
            }

            const current = rowToDocument(rows[0]);
            const now = new Date().toISOString();
            const nextStatus = input.status ?? current.status;
            const shouldPublish = nextStatus === "published";
            const nextSlug = input.slug ? input.slug.trim().toLowerCase() : current.slug;
            const slugChanged = nextSlug !== current.slug;
            const slugHistory = input.slugHistory
                ? [...new Set(input.slugHistory)]
                : slugChanged
                  ? [...new Set([...(current.slugHistory || []), current.slug])]
                  : [...(current.slugHistory || [])];
            const updated: CmsProjectDocument = {
                ...current,
                slug: nextSlug,
                slugHistory,
                order: input.order ?? current.order,
                status: nextStatus,
                basicInfo: {
                    ...current.basicInfo,
                    ...(input.basicInfo ?? {}),
                },
                seo: {
                    ...current.seo,
                    ...(input.seo ?? {}),
                },
                sections: input.sections ? JSON.parse(JSON.stringify(input.sections)) : current.sections,
                updatedAt: now,
                publishedAt: shouldPublish ? current.publishedAt ?? now : undefined,
            };

            await client.query(
                `
                    UPDATE ${table}
                    SET
                        slug = $2,
                        status = $3,
                        sort_order = $4,
                        template_id = $5,
                        template_version = $6,
                        slug_history = $7::jsonb,
                        basic_info = $8::jsonb,
                        seo = $9::jsonb,
                        sections = $10::jsonb,
                        created_at = $11,
                        updated_at = $12,
                        published_at = $13
                    WHERE id = $1;
                `,
                documentToParams(updated)
            );

            if (slugChanged) {
                await this.upsertRedirectInTransaction(
                    client,
                    {
                        fromPath: `/work/${current.slug}`,
                        toPath: `/work/${updated.slug}`,
                        statusCode: 301,
                    },
                    now
                );
            }

            await this.reindexProjects(client);
            const { rows: updatedRows } = await client.query<ProjectRow>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1;`, [id]);
            if (!updatedRows[0]) {
                throw new Error("Updated project could not be loaded.");
            }
            return rowToDocument(updatedRows[0]);
        });
    }

    async deleteProject(id: string): Promise<void> {
        await this.withTransaction(async (client) => {
            const table = this.getQualifiedTableName();
            const result = await client.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
            if (result.rowCount === 0) {
                throw new Error(`Project with id '${id}' was not found.`);
            }
            await this.reindexProjects(client);
        });
    }

    async publishProject(id: string): Promise<CmsProjectDocument> {
        return this.updateProject(id, { status: "published" });
    }

    async unpublishProject(id: string): Promise<CmsProjectDocument> {
        return this.updateProject(id, { status: "draft" });
    }

    private async upsertRedirectInTransaction(
        client: PoolClient,
        input: UpsertRedirectInput,
        nowIsoString?: string
    ): Promise<CmsRedirectRecord | null> {
        const table = this.getQualifiedRedirectTableName();
        const fromPath = normalizeRedirectPath(input.fromPath);
        const toPath = normalizeRedirectPath(input.toPath);
        if (fromPath === toPath) {
            return null;
        }
        const statusCode = normalizeRedirectStatusCode(input.statusCode);
        const now = nowIsoString || new Date().toISOString();

        // Drop direct reverse mapping to prevent short redirect loops.
        await client.query(
            `DELETE FROM ${table} WHERE from_path = $1 AND to_path = $2;`,
            [toPath, fromPath]
        );

        await client.query(
            `
                INSERT INTO ${table} (id, from_path, to_path, status_code, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (from_path)
                DO UPDATE SET
                    to_path = EXCLUDED.to_path,
                    status_code = EXCLUDED.status_code,
                    updated_at = EXCLUDED.updated_at;
            `,
            [createRedirectId(), fromPath, toPath, statusCode, now, now]
        );

        const { rows } = await client.query<RedirectRow>(
            `SELECT * FROM ${table} WHERE from_path = $1 LIMIT 1;`,
            [fromPath]
        );

        if (!rows[0]) {
            return null;
        }
        return rowToRedirect(rows[0]);
    }

    async getAllRedirects(): Promise<CmsRedirectRecord[]> {
        const table = this.getQualifiedRedirectTableName();
        try {
            await this.ensureSchema();
            const pool = this.getPool();
            const { rows } = await pool.query<RedirectRow>(
                `SELECT * FROM ${table} ORDER BY from_path ASC, created_at ASC;`
            );
            return rows.map(rowToRedirect);
        } catch (error) {
            cmsLogger.error("CMS postgres redirect query failed.", {
                table,
                error: cmsLogger.normalizeError(error),
            });
            throw error;
        }
    }

    async getRedirectByFromPath(fromPath: string): Promise<CmsRedirectRecord | null> {
        const table = this.getQualifiedRedirectTableName();
        const normalizedFromPath = normalizeRedirectPath(fromPath);

        try {
            await this.ensureSchema();
            const pool = this.getPool();
            const { rows } = await pool.query<RedirectRow>(
                `SELECT * FROM ${table} WHERE from_path = $1 LIMIT 1;`,
                [normalizedFromPath]
            );
            if (!rows[0]) return null;
            return rowToRedirect(rows[0]);
        } catch (error) {
            cmsLogger.error("CMS postgres redirect by path query failed.", {
                table,
                fromPath: normalizedFromPath,
                error: cmsLogger.normalizeError(error),
            });
            throw error;
        }
    }

    async upsertRedirect(input: UpsertRedirectInput): Promise<CmsRedirectRecord> {
        const result = await this.withTransaction((client) =>
            this.upsertRedirectInTransaction(client, input)
        );
        if (!result) {
            throw new Error("Redirect could not be created.");
        }
        return result;
    }

    async deleteRedirect(id: string): Promise<void> {
        await this.withTransaction(async (client) => {
            const table = this.getQualifiedRedirectTableName();
            const result = await client.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
            if (result.rowCount === 0) {
                throw new Error(`Redirect with id '${id}' was not found.`);
            }
        });
    }
}
