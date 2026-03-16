"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectSectionsEditor from "@/components/admin/editor/ProjectSectionsEditor";
import { useAdminClientApi } from "@/components/admin/editor/api";
import { AdminClientError, type AdminProjectResponse } from "@/components/admin/editor/types";
import { useUnsavedChanges } from "@/components/admin/editor/useUnsavedChanges";
import styles from "@/components/admin/admin.module.css";
import type {
    CmsProjectDocument,
    CmsValidationIssue,
    ProjectSection,
    ProjectSectionType,
} from "@/lib/cms/types";

interface AdminProjectEditorProps {
    projectId: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";
const AUTOSAVE_DELAY_MS = 1200;

interface EditorSnapshot {
    title: string;
    slug: string;
    clientName: string;
    seoTitle: string;
    seoDescription: string;
    seoCanonical: string;
    seoNoIndex: boolean;
    seoNoFollow: boolean;
    seoOgTitle: string;
    seoOgDescription: string;
    seoIncludeInSitemap: boolean;
    seoSchemaType: string;
    sections: ProjectSection[];
}

interface ValidationMaps {
    fieldIssues: Record<string, string[]>;
    sectionIssues: Record<string, string[]>;
}

const normalizeSections = (sections: ProjectSection[]) =>
    [...sections]
        .sort((a, b) => a.order - b.order)
        .map((section, index) => ({
            ...section,
            order: index,
        }));

const NON_EDITABLE_SECTION_TYPES = new Set<ProjectSectionType>(["credits"]);

const getEditableSections = (sections: ProjectSection[]) =>
    normalizeSections(
        sections.filter((section) => !NON_EDITABLE_SECTION_TYPES.has(section.type))
    );

const isValidationIssueArray = (value: unknown): value is CmsValidationIssue[] => {
    if (!Array.isArray(value)) return false;
    return value.every((item) => item && typeof item === "object" && "field" in item);
};

const toSnapshotString = (snapshot: EditorSnapshot) => JSON.stringify(snapshot);

const buildValidationMaps = (issues: CmsValidationIssue[], sections: ProjectSection[]): ValidationMaps => {
    const fieldIssues: Record<string, string[]> = {};
    const sectionIssues: Record<string, string[]> = {};

    issues.forEach((issue) => {
        const fieldPath = issue.field || "unknown";
        const sectionMatch = /^sections\[(\d+)\](?:\.(.*))?$/.exec(fieldPath);
        if (sectionMatch) {
            const sectionIndex = Number(sectionMatch[1]);
            const section = sections[sectionIndex];
            if (section) {
                const sectionMessage = sectionMatch[2]
                    ? `${sectionMatch[2]}: ${issue.message}`
                    : issue.message;
                if (!sectionIssues[section.id]) {
                    sectionIssues[section.id] = [];
                }
                sectionIssues[section.id].push(sectionMessage);
                return;
            }
        }

        if (!fieldIssues[fieldPath]) {
            fieldIssues[fieldPath] = [];
        }
        fieldIssues[fieldPath].push(issue.message);
    });

    return {
        fieldIssues,
        sectionIssues,
    };
};

export default function AdminProjectEditor({ projectId }: AdminProjectEditorProps) {
    const router = useRouter();
    const { request } = useAdminClientApi();
    const saveInFlightRef = useRef(false);

    const [loading, setLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(false);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState("");
    const [validationText, setValidationText] = useState("");

    const [project, setProject] = useState<CmsProjectDocument | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [clientName, setClientName] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoCanonical, setSeoCanonical] = useState("");
    const [seoNoIndex, setSeoNoIndex] = useState(false);
    const [seoNoFollow, setSeoNoFollow] = useState(false);
    const [seoOgTitle, setSeoOgTitle] = useState("");
    const [seoOgDescription, setSeoOgDescription] = useState("");
    const [seoIncludeInSitemap, setSeoIncludeInSitemap] = useState(true);
    const [seoSchemaType, setSeoSchemaType] = useState("caseStudy");
    const [sections, setSections] = useState<ProjectSection[]>([]);

    const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
    const [advancedMode, setAdvancedMode] = useState(false);
    const [sectionsJson, setSectionsJson] = useState("[]");
    const [fieldIssues, setFieldIssues] = useState<Record<string, string[]>>({});
    const [sectionIssues, setSectionIssues] = useState<Record<string, string[]>>({});
    const [previewNonce, setPreviewNonce] = useState(0);
    const [lastSavedSnapshot, setLastSavedSnapshot] = useState("");

    const sortedSections = useMemo(() => normalizeSections(sections), [sections]);
    const currentSnapshot = useMemo(
        () =>
            toSnapshotString({
                title,
                slug,
                clientName,
                seoTitle,
                seoDescription,
                seoCanonical,
                seoNoIndex,
                seoNoFollow,
                seoOgTitle,
                seoOgDescription,
                seoIncludeInSitemap,
                seoSchemaType,
                sections: sortedSections,
            }),
        [
            title,
            slug,
            clientName,
            seoTitle,
            seoDescription,
            seoCanonical,
            seoNoIndex,
            seoNoFollow,
            seoOgTitle,
            seoOgDescription,
            seoIncludeInSitemap,
            seoSchemaType,
            sortedSections,
        ]
    );

    const isDirty = !!project && currentSnapshot !== lastSavedSnapshot;
    useUnsavedChanges(isDirty);

    const previewUrl = useMemo(
        () => (project ? `/admin/projects/${project.id}/preview?preview=${previewNonce}` : "#"),
        [previewNonce, project]
    );
    const productionUrl = useMemo(() => (slug ? `/work/${slug}` : "#"), [slug]);

    const clearIssueState = useCallback(() => {
        setFieldIssues({});
        setSectionIssues({});
        setValidationText("");
    }, []);

    const applyValidationFromUnknownError = useCallback(
        (unknownError: unknown) => {
            if (!(unknownError instanceof AdminClientError)) return;
            if (!isValidationIssueArray(unknownError.details)) return;

            const mapped = buildValidationMaps(unknownError.details, sortedSections);
            setFieldIssues(mapped.fieldIssues);
            setSectionIssues(mapped.sectionIssues);

            const flatLines = unknownError.details
                .map((issue) => `${issue.field}: ${issue.message}`)
                .join("\n");
            setValidationText(flatLines);
        },
        [sortedSections]
    );

    const syncFromProject = useCallback(
        (nextProject: CmsProjectDocument) => {
            const normalizedSections = getEditableSections(nextProject.sections);
            const resolvedSeoTitle = nextProject.seo.seoTitle || nextProject.seo.title || "";
            const resolvedSeoDescription =
                nextProject.seo.metaDescription || nextProject.seo.description || "";
            const resolvedCanonical =
                nextProject.seo.canonicalUrl || nextProject.seo.canonical || "";
            const resolvedOgTitle = nextProject.seo.ogTitle || resolvedSeoTitle;
            const resolvedOgDescription =
                nextProject.seo.ogDescription || resolvedSeoDescription;
            const nextSnapshot = toSnapshotString({
                title: nextProject.basicInfo.title,
                slug: nextProject.slug,
                clientName: nextProject.basicInfo.clientName,
                seoTitle: resolvedSeoTitle,
                seoDescription: resolvedSeoDescription,
                seoCanonical: resolvedCanonical,
                seoNoIndex: !!nextProject.seo.noindex,
                seoNoFollow: !!nextProject.seo.nofollow,
                seoOgTitle: resolvedOgTitle,
                seoOgDescription: resolvedOgDescription,
                seoIncludeInSitemap: nextProject.seo.includeInSitemap ?? true,
                seoSchemaType: nextProject.seo.schemaType || "caseStudy",
                sections: normalizedSections,
            });

            setProject(nextProject);
            setTitle(nextProject.basicInfo.title);
            setSlug(nextProject.slug);
            setClientName(nextProject.basicInfo.clientName);
            setSeoTitle(resolvedSeoTitle);
            setSeoDescription(resolvedSeoDescription);
            setSeoCanonical(resolvedCanonical);
            setSeoNoIndex(!!nextProject.seo.noindex);
            setSeoNoFollow(!!nextProject.seo.nofollow);
            setSeoOgTitle(resolvedOgTitle);
            setSeoOgDescription(resolvedOgDescription);
            setSeoIncludeInSitemap(nextProject.seo.includeInSitemap ?? true);
            setSeoSchemaType(nextProject.seo.schemaType || "caseStudy");
            setSections(normalizedSections);
            setSectionsJson(JSON.stringify(normalizedSections, null, 2));
            setLastSavedSnapshot(nextSnapshot);
            clearIssueState();
        },
        [clearIssueState]
    );

    const loadProject = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await request<AdminProjectResponse>(`/api/admin/projects/${projectId}`);
            syncFromProject(data.project);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Cannot load project.");
        } finally {
            setLoading(false);
        }
    }, [projectId, request, syncFromProject]);

    useEffect(() => {
        void loadProject();
    }, [loadProject]);

    useEffect(() => {
        if (!advancedMode) {
            setSectionsJson(JSON.stringify(sortedSections, null, 2));
        }
    }, [advancedMode, sortedSections]);

    const updateSectionById = (sectionId: string, updater: (current: ProjectSection) => ProjectSection) => {
        setSections((current) =>
            normalizeSections(
                current.map((section) => (section.id === sectionId ? updater(section) : section))
            )
        );
    };

    const moveSection = (sectionId: string, direction: "up" | "down") => {
        setSections((current) => {
            const ordered = normalizeSections(current);
            const index = ordered.findIndex((item) => item.id === sectionId);
            if (index === -1) return ordered;
            const target = direction === "up" ? index - 1 : index + 1;
            if (target < 0 || target >= ordered.length) return ordered;

            const next = [...ordered];
            [next[index], next[target]] = [next[target], next[index]];
            return normalizeSections(next);
        });
    };

    const toggleCollapsed = (sectionId: string) => {
        setCollapsedMap((current) => ({
            ...current,
            [sectionId]: !current[sectionId],
        }));
    };

    const applyAdvancedJson = () => {
        clearIssueState();
        setError("");
        try {
            const parsed = JSON.parse(sectionsJson) as unknown;
            if (!Array.isArray(parsed)) {
                throw new Error("sections JSON must be an array.");
            }

            setSections(getEditableSections(parsed as ProjectSection[]));
            setStatusMessage("Applied JSON to structured editor.");
            setSaveState("idle");
        } catch (jsonError) {
            setError(jsonError instanceof Error ? jsonError.message : "Invalid JSON.");
            setSaveState("error");
        }
    };

    const saveProject = useCallback(
        async (mode: "manual" | "auto") => {
            if (!project || saveInFlightRef.current || actionBusy) return;

            saveInFlightRef.current = true;
            setSaveState("saving");
            setStatusMessage(mode === "manual" ? "" : `Autosaving...`);
            setError("");
            clearIssueState();

            try {
                const data = await request<AdminProjectResponse>(`/api/admin/projects/${project.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        slug,
                        basicInfo: {
                            title,
                            clientName,
                        },
                        seo: {
                            seoTitle,
                            metaDescription: seoDescription,
                            ogTitle: seoOgTitle || undefined,
                            ogDescription: seoOgDescription || undefined,
                            canonicalUrl: seoCanonical || undefined,
                            noindex: seoNoIndex,
                            nofollow: seoNoFollow,
                            includeInSitemap: seoIncludeInSitemap,
                            schemaType: seoSchemaType || "caseStudy",
                        },
                        sections: sortedSections,
                    }),
                });

                syncFromProject(data.project);
                setSaveState("saved");
                setStatusMessage(
                    `${mode === "manual" ? "Saved" : "Auto-saved"} at ${new Date().toLocaleTimeString()}`
                );
                setPreviewNonce((current) => current + 1);
            } catch (saveError) {
                setSaveState("error");
                applyValidationFromUnknownError(saveError);
                setError(saveError instanceof Error ? saveError.message : "Cannot save project.");
            } finally {
                saveInFlightRef.current = false;
            }
        },
        [
            actionBusy,
            applyValidationFromUnknownError,
            clearIssueState,
            clientName,
            project,
            request,
            seoCanonical,
            seoDescription,
            seoNoIndex,
            seoNoFollow,
            seoOgDescription,
            seoOgTitle,
            seoIncludeInSitemap,
            seoSchemaType,
            seoTitle,
            slug,
            sortedSections,
            syncFromProject,
            title,
        ]
    );

    const handleSave = async () => {
        if (!project) return;
        await saveProject("manual");
    };

    useEffect(() => {
        if (!project || !isDirty || actionBusy || advancedMode) {
            return;
        }

        const timer = window.setTimeout(() => {
            void saveProject("auto");
        }, AUTOSAVE_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [actionBusy, advancedMode, currentSnapshot, isDirty, project, saveProject]);

    const callAction = async (path: string, method = "POST") => {
        if (!project) return;
        setSaveState("saving");
        setStatusMessage("");
        setError("");
        clearIssueState();
        setActionBusy(true);

        try {
            const data = await request<{ project?: CmsProjectDocument; id?: string }>(path, { method });

            if (method === "DELETE") {
                router.push("/admin/projects");
                return;
            }

            if (path.endsWith("/duplicate") && data.project) {
                setStatusMessage("Duplicated. Redirecting to the new draft...");
                router.push(`/admin/projects/${data.project.id}`);
                return;
            }

            if (data.project) {
                syncFromProject(data.project);
            } else {
                await loadProject();
            }

            setStatusMessage("Action completed.");
            setSaveState("saved");
            setPreviewNonce((current) => current + 1);
        } catch (actionError) {
            setSaveState("error");
            applyValidationFromUnknownError(actionError);
            setError(actionError instanceof Error ? actionError.message : "Action failed.");
        } finally {
            setActionBusy(false);
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

    const slugIssues = fieldIssues.slug || [];

    if (loading) {
        return (
            <div className={styles.adminPage}>
                <section className={styles.adminPanel}>
                    <p className={styles.message}>Loading project...</p>
                </section>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={styles.adminPage}>
                <section className={styles.adminPanel}>
                    <p className={`${styles.message} ${styles.error}`}>Project not found.</p>
                    <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/admin/projects">
                        Back
                    </Link>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.adminPage}>
            <section className={styles.adminPanel}>
                <div className={styles.row}>
                    <h1 className={styles.adminTitle}>Edit Project</h1>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        type="button"
                        onClick={() => void handleLogout()}
                    >
                        Logout
                    </button>
                </div>
                <p className={styles.adminSubTitle}>ID: {project.id}</p>

                {statusMessage ? <p className={`${styles.message} ${styles.success}`}>{statusMessage}</p> : null}
                {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
                {validationText ? <pre className={`${styles.message} ${styles.error}`}>{validationText}</pre> : null}

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <input
                            className={styles.input}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Slug</label>
                        <input
                            className={`${styles.input} ${slugIssues.length ? styles.inputError : ""}`}
                            value={slug}
                            onChange={(event) => setSlug(event.target.value)}
                        />
                        {slugIssues.map((issue, index) => (
                            <p key={`${issue}_${index}`} className={styles.fieldErrorText}>
                                {issue}
                            </p>
                        ))}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Client Name</label>
                        <input
                            className={styles.input}
                            value={clientName}
                            onChange={(event) => setClientName(event.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>SEO Title</label>
                        <input
                            className={styles.input}
                            value={seoTitle}
                            onChange={(event) => setSeoTitle(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>SEO Description</label>
                        <input
                            className={styles.input}
                            value={seoDescription}
                            onChange={(event) => setSeoDescription(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Canonical</label>
                        <input
                            className={styles.input}
                            value={seoCanonical}
                            onChange={(event) => setSeoCanonical(event.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>OG Title</label>
                        <input
                            className={styles.input}
                            value={seoOgTitle}
                            onChange={(event) => setSeoOgTitle(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>OG Description</label>
                        <input
                            className={styles.input}
                            value={seoOgDescription}
                            onChange={(event) => setSeoOgDescription(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Schema Type</label>
                        <select
                            className={styles.select}
                            value={seoSchemaType}
                            onChange={(event) => setSeoSchemaType(event.target.value)}
                        >
                            <option value="caseStudy">caseStudy</option>
                            <option value="creativeWork">creativeWork</option>
                            <option value="videoObject">videoObject</option>
                            <option value="article">article</option>
                            <option value="service">service</option>
                            <option value="webPage">webPage</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            checked={seoNoIndex}
                            onChange={(event) => setSeoNoIndex(event.target.checked)}
                        />{" "}
                        noindex
                    </label>
                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            checked={seoNoFollow}
                            onChange={(event) => setSeoNoFollow(event.target.checked)}
                        />{" "}
                        nofollow
                    </label>
                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            checked={seoIncludeInSitemap}
                            onChange={(event) => setSeoIncludeInSitemap(event.target.checked)}
                        />{" "}
                        include in sitemap
                    </label>
                    <span
                        className={`${styles.statusPill} ${
                            project.status === "published" ? styles.statusPublished : styles.statusDraft
                        }`}
                    >
                        {project.status}
                    </span>
                    <span
                        className={`${styles.statusPill} ${
                            saveState === "saved" && !isDirty ? styles.statusPublished : styles.statusDraft
                        }`}
                    >
                        {saveState === "saving"
                            ? "saving..."
                            : isDirty
                              ? "unsaved changes"
                              : "all changes saved"}
                    </span>
                    <span className={styles.meta}>Autosave every 1.2s while editing</span>
                </div>

                <div className={styles.divider} />
                <p className={styles.meta}>Credits section is fixed globally and not editable in CMS.</p>

                <ProjectSectionsEditor
                    sections={sortedSections}
                    collapsedMap={collapsedMap}
                    sectionIssues={sectionIssues}
                    advancedMode={advancedMode}
                    sectionsJson={sectionsJson}
                    onToggleAdvancedMode={() => setAdvancedMode((current) => !current)}
                    onSectionsJsonChange={setSectionsJson}
                    onApplyAdvancedJson={applyAdvancedJson}
                    onToggleCollapsed={toggleCollapsed}
                    onToggleEnabled={(sectionId, enabled) =>
                        updateSectionById(sectionId, (current) => ({ ...current, enabled }))
                    }
                    onMoveSection={moveSection}
                    onSectionChange={(sectionId, nextSection) =>
                        updateSectionById(sectionId, () => nextSection)
                    }
                />

                <div className={styles.divider} />

                <div className={styles.row}>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={() => void handleSave()}
                        disabled={saveState === "saving" || actionBusy}
                    >
                        {saveState === "saving" ? "Saving..." : "Save"}
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        type="button"
                        onClick={() => setPreviewNonce((current) => current + 1)}
                        disabled={actionBusy}
                    >
                        Refresh Preview
                    </button>
                    <Link className={`${styles.button} ${styles.buttonSecondary}`} href={previewUrl} target="_blank">
                        Open Draft Preview
                    </Link>
                    <Link className={`${styles.button} ${styles.buttonSecondary}`} href={productionUrl} target="_blank">
                        Open Production Route
                    </Link>
                    {project.status === "published" ? (
                        <button
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            type="button"
                            onClick={() => void callAction(`/api/admin/projects/${project.id}/unpublish`)}
                            disabled={actionBusy}
                        >
                            Unpublish
                        </button>
                    ) : (
                        <button
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            type="button"
                            onClick={() => void callAction(`/api/admin/projects/${project.id}/publish`)}
                            disabled={actionBusy}
                        >
                            Publish
                        </button>
                    )}
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        type="button"
                        onClick={() => void callAction(`/api/admin/projects/${project.id}/duplicate`)}
                        disabled={actionBusy}
                    >
                        Duplicate
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonDanger}`}
                        type="button"
                        onClick={() => void callAction(`/api/admin/projects/${project.id}`, "DELETE")}
                        disabled={actionBusy}
                    >
                        Delete
                    </button>
                    <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/admin/projects">
                        Back
                    </Link>
                </div>
            </section>

            <section className={styles.adminPreviewPanel}>
                <h2 className={styles.cardTitle}>Draft Preview</h2>
                <p className={styles.meta}>Uses the same ProjectDetailRenderer and mapper as production.</p>
                <iframe title="Draft preview" src={previewUrl} className={styles.previewIframe} />
            </section>
        </div>
    );
}
