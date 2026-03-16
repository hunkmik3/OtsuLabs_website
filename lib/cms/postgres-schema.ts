import type { Pool, PoolClient } from "pg";
import { getCmsConfig } from "@/lib/cms/config";

const ensureIdentifier = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!/^[a-z_][a-z0-9_]*$/.test(normalized)) {
        throw new Error(`Invalid postgres identifier: ${value}`);
    }
    return normalized;
};

const quoteIdent = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;

export interface CmsPostgresSchemaConfig {
    schemaName: string;
    tableName: string;
    qualifiedTableName: string;
    redirectTableName: string;
    qualifiedRedirectTableName: string;
    statusIndexName: string;
    orderIndexName: string;
    updatedIndexName: string;
    redirectFromPathIndexName: string;
    redirectToPathIndexName: string;
}

export const getCmsPostgresSchemaConfig = (): CmsPostgresSchemaConfig => {
    const config = getCmsConfig().repository;
    const schemaName = ensureIdentifier(config.postgresSchema);
    const tableName = ensureIdentifier(config.postgresTable);
    const redirectTableName = ensureIdentifier(config.postgresRedirectTable);
    const qualifiedTableName = `${quoteIdent(schemaName)}.${quoteIdent(tableName)}`;
    const qualifiedRedirectTableName = `${quoteIdent(schemaName)}.${quoteIdent(redirectTableName)}`;

    return {
        schemaName,
        tableName,
        qualifiedTableName,
        redirectTableName,
        qualifiedRedirectTableName,
        statusIndexName: ensureIdentifier(`${tableName}_status_idx`),
        orderIndexName: ensureIdentifier(`${tableName}_order_idx`),
        updatedIndexName: ensureIdentifier(`${tableName}_updated_idx`),
        redirectFromPathIndexName: ensureIdentifier(`${redirectTableName}_from_path_idx`),
        redirectToPathIndexName: ensureIdentifier(`${redirectTableName}_to_path_idx`),
    };
};

const createSchemaSql = (schema: CmsPostgresSchemaConfig) => `
CREATE SCHEMA IF NOT EXISTS ${quoteIdent(schema.schemaName)};

CREATE TABLE IF NOT EXISTS ${schema.qualifiedTableName} (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
    sort_order INTEGER NOT NULL,
    template_id TEXT NOT NULL,
    template_version TEXT NOT NULL,
    slug_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    basic_info JSONB NOT NULL,
    seo JSONB NOT NULL,
    sections JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ NULL
);

ALTER TABLE ${schema.qualifiedTableName}
    ADD COLUMN IF NOT EXISTS slug_history JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS ${quoteIdent(schema.statusIndexName)} ON ${schema.qualifiedTableName} (status);
CREATE INDEX IF NOT EXISTS ${quoteIdent(schema.orderIndexName)} ON ${schema.qualifiedTableName} (sort_order);
CREATE INDEX IF NOT EXISTS ${quoteIdent(schema.updatedIndexName)} ON ${schema.qualifiedTableName} (updated_at DESC);

CREATE TABLE IF NOT EXISTS ${schema.qualifiedRedirectTableName} (
    id TEXT PRIMARY KEY,
    from_path TEXT NOT NULL UNIQUE,
    to_path TEXT NOT NULL,
    status_code INTEGER NOT NULL CHECK (status_code IN (301, 302)),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ${quoteIdent(schema.redirectFromPathIndexName)} ON ${schema.qualifiedRedirectTableName} (from_path);
CREATE INDEX IF NOT EXISTS ${quoteIdent(schema.redirectToPathIndexName)} ON ${schema.qualifiedRedirectTableName} (to_path);
`;

export const ensureCmsPostgresSchema = async (executor: Pool | PoolClient) => {
    const schema = getCmsPostgresSchemaConfig();
    await executor.query(createSchemaSql(schema));
    return schema;
};
