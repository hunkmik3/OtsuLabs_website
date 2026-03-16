import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { MediaAsset } from "@/lib/cms/types";
import { CmsApiError } from "@/lib/cms/api-response";
import { getCmsConfig } from "@/lib/cms/config";
import { cmsLogger } from "@/lib/cms/logger";

interface SaveMediaInput {
    file: File;
    alt?: string;
}

export interface SaveMediaOutput {
    media: MediaAsset;
    bytes: number;
    mimeType: string;
    filename: string;
}

export interface CmsMediaStorage {
    save(input: SaveMediaInput): Promise<SaveMediaOutput>;
}

const sanitizeName = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]+/g, "-")
        .replace(/^-+|-+$/g, "");

const detectMediaType = (mimeType: string, extension: string): MediaAsset["type"] => {
    if (mimeType.startsWith("video/") || [".mp4", ".webm", ".mov"].includes(extension)) return "video";
    return "image";
};

const normalizeFileExtension = (file: File) => {
    const mime = file.type.toLowerCase();
    const ext = extname(file.name).toLowerCase();
    if (ext) return ext;
    if (mime.startsWith("video/")) return ".mp4";
    return ".png";
};

const validateUploadFile = (file: File) => {
    const config = getCmsConfig();
    const mime = file.type.toLowerCase();
    const extension = normalizeFileExtension(file);

    if (file.size <= 0) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "Uploaded file is empty.");
    }
    if (file.size > config.media.maxUploadBytes) {
        throw new CmsApiError(
            400,
            "VALIDATION_ERROR",
            `File exceeds max size (${config.media.maxUploadBytes} bytes).`
        );
    }

    const mimeAllowed = config.media.allowedMimeTypes.includes(mime);
    const extensionAllowed = config.media.allowedExtensions.includes(extension);
    if (!mimeAllowed && !extensionAllowed) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "Unsupported file type.");
    }
};

class LocalCmsMediaStorage implements CmsMediaStorage {
    async save(input: SaveMediaInput): Promise<SaveMediaOutput> {
        const file = input.file;
        validateUploadFile(file);

        const config = getCmsConfig();
        const extension = normalizeFileExtension(file);
        const baseName = sanitizeName(file.name.replace(/\.[^.]+$/, "")) || "media";
        const filename = `${baseName}-${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
        const outputPath = join(config.media.localUploadDirectory, filename);

        try {
            await mkdir(config.media.localUploadDirectory, { recursive: true });
            const bytes = Buffer.from(await file.arrayBuffer());
            await writeFile(outputPath, bytes);

            const publicBasePath = config.media.publicBasePath.replace(/\/+$/, "");
            const src = `${publicBasePath}/${filename}`;

            return {
                media: {
                    src,
                    alt: input.alt?.trim() || baseName,
                    type: detectMediaType(file.type.toLowerCase(), extension),
                },
                bytes: file.size,
                mimeType: file.type.toLowerCase(),
                filename,
            };
        } catch (error) {
            cmsLogger.error("CMS media upload failed for local storage.", {
                mode: "local",
                outputPath,
                error: cmsLogger.normalizeError(error),
            });
            throw new CmsApiError(500, "MEDIA_UPLOAD_FAILED", "Failed to persist uploaded file.");
        }
    }
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

const buildS3PublicUrl = (objectKey: string) => {
    const config = getCmsConfig().media.s3;
    const normalizedKey = trimSlashes(objectKey);

    if (config.publicBaseUrl) {
        const base = config.publicBaseUrl.replace(/\/+$/, "");
        return `${base}/${normalizedKey}`;
    }

    if (config.endpoint) {
        const endpoint = config.endpoint.replace(/\/+$/, "");
        if (config.forcePathStyle) {
            return `${endpoint}/${config.bucket}/${normalizedKey}`;
        }
        return `${endpoint.replace(/https?:\/\//, `https://${config.bucket}.`)}/${normalizedKey}`;
    }

    return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${normalizedKey}`;
};

const ensureS3Config = () => {
    const config = getCmsConfig().media.s3;
    if (!config.bucket || !config.accessKeyId || !config.secretAccessKey) {
        throw new CmsApiError(
            500,
            "MEDIA_STORAGE_CONFIG_ERROR",
            "S3 storage mode requires bucket/access key/secret key."
        );
    }
    return config;
};

class S3CmsMediaStorage implements CmsMediaStorage {
    private client: S3Client | null = null;

    private getClient() {
        if (this.client) return this.client;
        const config = ensureS3Config();

        this.client = new S3Client({
            region: config.region,
            endpoint: config.endpoint,
            forcePathStyle: config.forcePathStyle,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        return this.client;
    }

    async save(input: SaveMediaInput): Promise<SaveMediaOutput> {
        const file = input.file;
        validateUploadFile(file);

        const config = ensureS3Config();
        const extension = normalizeFileExtension(file);
        const baseName = sanitizeName(file.name.replace(/\.[^.]+$/, "")) || "media";
        const randomSuffix = `${Date.now()}-${randomUUID().slice(0, 8)}`;
        const filename = `${baseName}-${randomSuffix}${extension}`;
        const keyPrefix = trimSlashes(config.keyPrefix);
        const objectKey = keyPrefix ? `${keyPrefix}/${filename}` : filename;

        try {
            const bytes = Buffer.from(await file.arrayBuffer());
            const client = this.getClient();

            await client.send(
                new PutObjectCommand({
                    Bucket: config.bucket,
                    Key: objectKey,
                    Body: bytes,
                    ContentType: file.type || "application/octet-stream",
                })
            );

            const src = buildS3PublicUrl(objectKey);
            return {
                media: {
                    src,
                    alt: input.alt?.trim() || baseName,
                    type: detectMediaType(file.type.toLowerCase(), extension),
                },
                bytes: file.size,
                mimeType: file.type.toLowerCase(),
                filename: objectKey,
            };
        } catch (error) {
            cmsLogger.error("CMS media upload failed for S3 storage.", {
                mode: "s3",
                bucket: config.bucket,
                key: objectKey,
                error: cmsLogger.normalizeError(error),
            });
            throw new CmsApiError(500, "MEDIA_UPLOAD_FAILED", "Failed to upload media to object storage.");
        }
    }
}

let cachedStorage: CmsMediaStorage | null = null;

export const createCmsMediaStorage = () => {
    const config = getCmsConfig();
    if (!cachedStorage) {
        switch (config.media.storageMode) {
            case "s3":
                cachedStorage = new S3CmsMediaStorage();
                break;
            case "local":
            default:
                cachedStorage = new LocalCmsMediaStorage();
                break;
        }
    }
    return cachedStorage;
};

export const resetCmsMediaStorageForTests = () => {
    cachedStorage = null;
};
