"use client";

import { useState } from "react";
import type { MediaAsset } from "@/lib/cms/types";
import styles from "@/components/admin/admin.module.css";

interface MediaInputFieldProps {
    label: string;
    value: MediaAsset;
    onChange: (next: MediaAsset) => void;
}

interface MediaUploadResponse {
    success: boolean;
    data?: {
        media: MediaAsset;
    };
    error?: {
        message?: string;
    };
}

const MAX_UPLOAD_BYTES = 150 * 1024 * 1024;
const ACCEPTED_UPLOAD_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

const ACCEPTED_UPLOAD_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".mp4", ".webm", ".mov"];

const isAllowedClientFile = (file: File) => {
    if (file.type && ACCEPTED_UPLOAD_TYPES.includes(file.type.toLowerCase())) return true;
    const lower = file.name.toLowerCase();
    return ACCEPTED_UPLOAD_EXTENSIONS.some((extension) => lower.endsWith(extension));
};

const formatBytes = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let current = value;
    let index = 0;
    while (current >= 1024 && index < units.length - 1) {
        current /= 1024;
        index += 1;
    }
    return `${current.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const ensureMedia = (value?: MediaAsset): MediaAsset => ({
    src: value?.src || "",
    alt: value?.alt || "",
    type: value?.type || "image",
    ...(value?.poster ? { poster: value.poster } : {}),
    ...(value?.width ? { width: value.width } : {}),
    ...(value?.height ? { height: value.height } : {}),
});

export default function MediaInputField({ label, value, onChange }: MediaInputFieldProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");

    const media = ensureMedia(value);

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError("");
        setUploadMessage("");

        if (!isAllowedClientFile(file)) {
            setUploading(false);
            setError("Unsupported file type. Use png/jpg/webp/avif/gif/mp4/webm/mov.");
            return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            setUploading(false);
            setError(`File is too large. Max size is ${formatBytes(MAX_UPLOAD_BYTES)}.`);
            return;
        }

        try {
            const body = new FormData();
            body.set("file", file);
            body.set("alt", media.alt || file.name);

            const response = await fetch("/api/admin/media", {
                method: "POST",
                body,
            });
            if (response.status === 401) {
                window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
                return;
            }
            const payload = (await response.json()) as MediaUploadResponse;
            if (!response.ok || !payload.success || !payload.data) {
                throw new Error(payload.error?.message || "Upload failed.");
            }

            onChange({
                ...media,
                ...payload.data.media,
            });
            setUploadMessage(`Uploaded ${file.name} (${formatBytes(file.size)}).`);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.mediaField}>
            <p className={styles.mediaFieldTitle}>{label}</p>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Source</label>
                    <input
                        className={styles.input}
                        value={media.src}
                        onChange={(event) => onChange({ ...media, src: event.target.value })}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Alt</label>
                    <input
                        className={styles.input}
                        value={media.alt}
                        onChange={(event) => onChange({ ...media, alt: event.target.value })}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Type</label>
                    <select
                        className={styles.select}
                        value={media.type}
                        onChange={(event) =>
                            onChange({
                                ...media,
                                type: event.target.value === "video" ? "video" : "image",
                            })
                        }
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Poster (video)</label>
                    <input
                        className={styles.input}
                        value={media.poster || ""}
                        onChange={(event) => onChange({ ...media, poster: event.target.value || undefined })}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <label className={`${styles.button} ${styles.buttonSecondary}`} style={{ cursor: "pointer" }}>
                    {uploading ? "Uploading..." : "Upload File"}
                    <input
                        type="file"
                        accept={ACCEPTED_UPLOAD_TYPES.join(",")}
                        hidden
                        onChange={(event) => {
                            const nextFile = event.target.files?.[0];
                            if (nextFile) {
                                void handleUpload(nextFile);
                            }
                        }}
                    />
                </label>
                {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
                {uploadMessage ? <p className={`${styles.message} ${styles.success}`}>{uploadMessage}</p> : null}
            </div>
            <p className={styles.meta}>
                Supported: png, jpg, webp, avif, gif, mp4, webm, mov. Max {formatBytes(MAX_UPLOAD_BYTES)}.
            </p>

            {media.src ? (
                <div className={styles.mediaPreviewWrapper}>
                    {media.type === "video" ? (
                        <video
                            className={styles.mediaPreview}
                            src={media.src}
                            poster={media.poster}
                            controls
                            muted
                            playsInline
                        />
                    ) : (
                        <img className={styles.mediaPreview} src={media.src} alt={media.alt || "Media preview"} />
                    )}
                </div>
            ) : null}
            <div className={styles.row}>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => {
                        setUploadMessage("");
                        setError("");
                        onChange({ ...media, src: "" });
                    }}
                >
                    Clear source
                </button>
            </div>
        </div>
    );
}
