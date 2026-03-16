"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminClientApi } from "@/components/admin/editor/api";
import styles from "@/components/admin/admin.module.css";

interface AdminProject {
    id: string;
    slug: string;
    status: "draft" | "published";
    order: number;
    basicInfo: {
        title: string;
        clientName: string;
        dateLabel: string;
    };
}

export default function AdminProjectsManager() {
    const router = useRouter();
    const { request } = useAdminClientApi();

    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [actionId, setActionId] = useState("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [templateId, setTemplateId] = useState<"blank-v1" | "novathera-v1">("blank-v1");

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await request<{ projects: AdminProject[] }>("/api/admin/projects");
            setProjects(data.projects);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Cannot load projects.");
        } finally {
            setLoading(false);
        }
    }, [request]);

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    const sortedProjects = useMemo(
        () => [...projects].sort((a, b) => a.order - b.order),
        [projects]
    );

    const handleCreate = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        setMessage("");
        setError("");
        setCreating(true);
        try {
            const data = await request<{ project: AdminProject }>("/api/admin/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug: slug || undefined,
                    templateId,
                }),
            });

            setTitle("");
            setSlug("");
            setTemplateId("blank-v1");
            setMessage(`Created project: ${data.project.slug}`);
            await loadProjects();
        } catch (createError) {
            setError(createError instanceof Error ? createError.message : "Cannot create project.");
        } finally {
            setCreating(false);
        }
    };

    const callAction = async (url: string, method = "POST") => {
        setMessage("");
        setError("");
        setActionId(`${method}:${url}`);
        try {
            await request<unknown>(url, { method });
            setMessage("Action completed.");
            await loadProjects();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "Request failed.");
        } finally {
            setActionId("");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/auth/logout", { method: "POST" });
        } finally {
            router.push("/admin/login");
            router.refresh();
        }
    };

    return (
        <div className={`${styles.adminPage} ${styles.adminPageSingle}`}>
            <section className={styles.adminPanel}>
                <div className={styles.row}>
                    <h1 className={styles.adminTitle}>CMS Projects</h1>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        type="button"
                        onClick={() => void handleLogout()}
                    >
                        Logout
                    </button>
                </div>
                <p className={styles.adminSubTitle}>
                    Create and manage projects (draft/published) from template or blank document.
                </p>

                {message && <p className={`${styles.message} ${styles.success}`}>{message}</p>}
                {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <input className={styles.input} value={title} onChange={(event) => setTitle(event.target.value)} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Slug (optional)</label>
                        <input className={styles.input} value={slug} onChange={(event) => setSlug(event.target.value)} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Template</label>
                        <select
                            className={styles.select}
                            value={templateId}
                            onChange={(event) =>
                                setTemplateId(event.target.value === "novathera-v1" ? "novathera-v1" : "blank-v1")
                            }
                        >
                            <option value="blank-v1">Blank project</option>
                            <option value="novathera-v1">Create from Novathera template</option>
                        </select>
                    </div>
                    <button className={styles.button} type="button" onClick={handleCreate} disabled={creating}>
                        {creating ? "Creating..." : "Create Project"}
                    </button>
                </div>

                <div className={styles.divider} />

                {loading ? (
                    <p className={styles.message}>Loading projects...</p>
                ) : (
                    <div className={styles.cards}>
                        {sortedProjects.map((project) => (
                            <article key={project.id} className={styles.card}>
                                <h3 className={styles.cardTitle}>{project.basicInfo.title}</h3>
                                <p className={styles.meta}>
                                    {project.slug} · {project.basicInfo.clientName} · order {project.order}
                                </p>
                                <span
                                    className={`${styles.statusPill} ${
                                        project.status === "published" ? styles.statusPublished : styles.statusDraft
                                    }`}
                                >
                                    {project.status}
                                </span>
                                <div className={styles.row}>
                                    <Link className={`${styles.button} ${styles.buttonSecondary}`} href={`/admin/projects/${project.id}`}>
                                        Edit
                                    </Link>
                                    {project.status === "published" ? (
                                        <button
                                            className={`${styles.button} ${styles.buttonSecondary}`}
                                            type="button"
                                            disabled={actionId.length > 0}
                                            onClick={() =>
                                                void callAction(`/api/admin/projects/${project.id}/unpublish`)
                                            }
                                        >
                                            Unpublish
                                        </button>
                                    ) : (
                                        <button
                                            className={`${styles.button} ${styles.buttonSecondary}`}
                                            type="button"
                                            disabled={actionId.length > 0}
                                            onClick={() =>
                                                void callAction(`/api/admin/projects/${project.id}/publish`)
                                            }
                                        >
                                            Publish
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.button} ${styles.buttonSecondary}`}
                                        type="button"
                                        disabled={actionId.length > 0}
                                        onClick={() =>
                                            void callAction(`/api/admin/projects/${project.id}/duplicate`)
                                        }
                                    >
                                        Duplicate
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.buttonDanger}`}
                                        type="button"
                                        disabled={actionId.length > 0}
                                        onClick={() =>
                                            void callAction(`/api/admin/projects/${project.id}`, "DELETE")
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
