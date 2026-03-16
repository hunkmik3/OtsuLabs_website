export type CmsRepositoryMode = "file" | "postgres";
export type CmsMediaStorageMode = "local" | "s3";
export type CmsLogLevel = "debug" | "info" | "warn" | "error";

interface CmsAuthConfig {
    adminToken: string;
    authSecret: string;
    sessionCookieName: string;
    sessionTtlSeconds: number;
    sessionCookieSecure: boolean;
    sessionCookieSameSite: "lax" | "strict" | "none";
    sessionCookieDomain?: string;
    adminHeaderName: string;
}

interface CmsRepositoryConfig {
    mode: CmsRepositoryMode;
    filePath: string;
    postgresUrl: string;
    postgresSsl: boolean;
    postgresSchema: string;
    postgresTable: string;
    postgresRedirectTable: string;
}

interface CmsMediaS3Config {
    bucket: string;
    region: string;
    endpoint?: string;
    accessKeyId: string;
    secretAccessKey: string;
    publicBaseUrl?: string;
    forcePathStyle: boolean;
    keyPrefix: string;
}

interface CmsMediaConfig {
    storageMode: CmsMediaStorageMode;
    localUploadDirectory: string;
    publicBasePath: string;
    maxUploadBytes: number;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
    s3: CmsMediaS3Config;
}

interface CmsAppConfig {
    baseUrl?: string;
}

interface CmsLoggingConfig {
    level: CmsLogLevel;
    pretty: boolean;
}

export interface CmsRuntimeConfig {
    isProduction: boolean;
    auth: CmsAuthConfig;
    repository: CmsRepositoryConfig;
    media: CmsMediaConfig;
    app: CmsAppConfig;
    logging: CmsLoggingConfig;
}

let cachedConfig: CmsRuntimeConfig | null = null;

const DEFAULT_ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

const DEFAULT_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".mp4", ".webm", ".mov"];

const parseInteger = (value: string | undefined, fallbackValue: number) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallbackValue;
    }
    return Math.floor(parsed);
};

const parseBoolean = (value: string | undefined, fallbackValue = false) => {
    if (!value) return fallbackValue;
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "off"].includes(normalized)) return false;
    return fallbackValue;
};

const parseCsv = (value: string | undefined, fallbackValues: string[]) => {
    if (!value) return fallbackValues;
    const tokens = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    return tokens.length > 0 ? tokens : fallbackValues;
};

const normalizeRepositoryMode = (value: string | undefined): CmsRepositoryMode => {
    const normalized = value?.trim().toLowerCase();
    if (normalized === "postgres") return "postgres";
    return "file";
};

const normalizeStorageMode = (value: string | undefined): CmsMediaStorageMode => {
    const normalized = value?.trim().toLowerCase();
    if (normalized === "s3") return "s3";
    return "local";
};

const normalizeLogLevel = (value: string | undefined): CmsLogLevel => {
    const normalized = value?.trim().toLowerCase();
    if (normalized === "debug") return "debug";
    if (normalized === "warn") return "warn";
    if (normalized === "error") return "error";
    return "info";
};

const normalizeSameSite = (value: string | undefined): "lax" | "strict" | "none" => {
    const normalized = value?.trim().toLowerCase();
    if (normalized === "none") return "none";
    if (normalized === "lax") return "lax";
    return "strict";
};

const normalizeIdentifier = (value: string | undefined, fallbackValue: string) => {
    const candidate = (value || fallbackValue).trim().toLowerCase();
    return /^[a-z_][a-z0-9_]*$/.test(candidate) ? candidate : fallbackValue;
};

const normalizePathPrefix = (value: string | undefined, fallbackValue: string) => {
    const candidate = (value || fallbackValue).trim().replace(/^\/+|\/+$/g, "");
    return candidate || fallbackValue;
};

const buildConfig = (): CmsRuntimeConfig => {
    const isProduction = process.env.NODE_ENV === "production";
    const adminToken = process.env.CMS_ADMIN_TOKEN?.trim() || "";
    const authSecret = process.env.CMS_AUTH_SECRET?.trim() || adminToken || "";
    const repositoryMode = normalizeRepositoryMode(process.env.CMS_REPOSITORY_MODE);
    const postgresUrl = process.env.CMS_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || "";

    return {
        isProduction,
        auth: {
            adminToken,
            authSecret,
            sessionCookieName: process.env.CMS_ADMIN_SESSION_COOKIE?.trim() || "cms_admin_session",
            sessionTtlSeconds: parseInteger(process.env.CMS_ADMIN_SESSION_TTL_SECONDS, 60 * 60 * 12),
            sessionCookieSecure: parseBoolean(process.env.CMS_ADMIN_COOKIE_SECURE, isProduction),
            sessionCookieSameSite: normalizeSameSite(process.env.CMS_ADMIN_COOKIE_SAME_SITE),
            sessionCookieDomain: process.env.CMS_ADMIN_COOKIE_DOMAIN?.trim() || undefined,
            adminHeaderName: process.env.CMS_ADMIN_HEADER_NAME?.trim().toLowerCase() || "x-cms-admin-token",
        },
        repository: {
            mode: repositoryMode,
            filePath: process.env.CMS_DATA_FILE_PATH?.trim() || "./data/cms/projects.json",
            postgresUrl,
            postgresSsl: parseBoolean(process.env.CMS_DATABASE_SSL, isProduction),
            postgresSchema: normalizeIdentifier(process.env.CMS_DATABASE_SCHEMA, "public"),
            postgresTable: normalizeIdentifier(process.env.CMS_DATABASE_TABLE, "cms_projects"),
            postgresRedirectTable: normalizeIdentifier(
                process.env.CMS_DATABASE_REDIRECT_TABLE,
                "cms_redirects"
            ),
        },
        media: {
            storageMode: normalizeStorageMode(process.env.CMS_MEDIA_STORAGE_MODE),
            localUploadDirectory: process.env.CMS_MEDIA_LOCAL_DIR?.trim() || "./public/uploads",
            publicBasePath: process.env.CMS_MEDIA_PUBLIC_BASE_PATH?.trim() || "/uploads",
            maxUploadBytes: parseInteger(process.env.CMS_MEDIA_MAX_BYTES, 150 * 1024 * 1024),
            allowedMimeTypes: parseCsv(process.env.CMS_MEDIA_ALLOWED_MIME_TYPES, DEFAULT_ALLOWED_MIME_TYPES),
            allowedExtensions: parseCsv(process.env.CMS_MEDIA_ALLOWED_EXTENSIONS, DEFAULT_ALLOWED_EXTENSIONS),
            s3: {
                bucket: process.env.CMS_S3_BUCKET?.trim() || "",
                region: process.env.CMS_S3_REGION?.trim() || "auto",
                endpoint: process.env.CMS_S3_ENDPOINT?.trim() || undefined,
                accessKeyId: process.env.CMS_S3_ACCESS_KEY_ID?.trim() || "",
                secretAccessKey: process.env.CMS_S3_SECRET_ACCESS_KEY?.trim() || "",
                publicBaseUrl: process.env.CMS_S3_PUBLIC_BASE_URL?.trim() || undefined,
                forcePathStyle: parseBoolean(process.env.CMS_S3_FORCE_PATH_STYLE, false),
                keyPrefix: normalizePathPrefix(process.env.CMS_S3_KEY_PREFIX, "uploads"),
            },
        },
        app: {
            baseUrl: process.env.CMS_PUBLIC_BASE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined,
        },
        logging: {
            level: normalizeLogLevel(process.env.CMS_LOG_LEVEL),
            pretty: parseBoolean(process.env.CMS_LOG_PRETTY, !isProduction),
        },
    };
};

export const getCmsConfig = (): CmsRuntimeConfig => {
    if (!cachedConfig) {
        cachedConfig = buildConfig();
    }
    return cachedConfig;
};

export const resetCmsConfigForTests = () => {
    cachedConfig = null;
};
