import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createIsoNow, createRedirectId } from "@/lib/cms/ids";
import { createSeedStore } from "@/lib/cms/seed";
import { buildProjectFromTemplate, normalizeCreateInput } from "@/lib/cms/templates";
import { getCmsConfig } from "@/lib/cms/config";
import type {
    CmsDataStore,
    CmsProjectDocument,
    CmsProjectRepository,
    CmsRedirectRecord,
    CreateProjectFromTemplateInput,
    CreateProjectInput,
    RedirectStatusCode,
    UpsertRedirectInput,
    UpdateProjectInput,
} from "@/lib/cms/types";
import { assertValidProjectDocument } from "@/lib/cms/validator";

const cloneDeep = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const normalizeSlug = (slug: string) => slug.trim().toLowerCase();
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

const sortAndReindexProjects = (projects: CmsProjectDocument[]) => {
    projects.sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
    projects.forEach((project, index) => {
        project.order = index;
    });
};

const validateProjectsCollection = (projects: CmsProjectDocument[]) => {
    projects.forEach((project) => {
        const otherProjects = projects.filter((candidate) => candidate.id !== project.id);
        assertValidProjectDocument({ project, existingProjects: otherProjects });
    });
};

const sortRedirects = (redirects: CmsRedirectRecord[]) =>
    [...redirects].sort((a, b) => a.fromPath.localeCompare(b.fromPath) || a.createdAt.localeCompare(b.createdAt));

const normalizeProjectDocument = (project: CmsProjectDocument): CmsProjectDocument => {
    const seoTitle = project.seo.seoTitle || project.seo.title || project.basicInfo.title;
    const metaDescription = project.seo.metaDescription || project.seo.description || project.basicInfo.scopeSummary;

    return {
        ...project,
        slugHistory: Array.isArray(project.slugHistory) ? [...project.slugHistory] : [],
        seo: {
            ...project.seo,
            seoTitle,
            title: project.seo.title || seoTitle,
            metaDescription,
            description: project.seo.description || metaDescription,
            canonicalUrl: project.seo.canonicalUrl || project.seo.canonical,
            canonical: project.seo.canonical || project.seo.canonicalUrl,
            includeInSitemap: project.seo.includeInSitemap ?? true,
            nofollow: project.seo.nofollow ?? false,
            schemaType: project.seo.schemaType || "caseStudy",
            ogTitle: project.seo.ogTitle || seoTitle,
            ogDescription: project.seo.ogDescription || metaDescription,
        },
    };
};

const wouldCreateRedirectLoop = (
    redirects: CmsRedirectRecord[],
    candidateFromPath: string,
    candidateToPath: string
) => {
    const tempRedirects = sortRedirects(
        [
            ...redirects.filter((redirect) => redirect.fromPath !== candidateFromPath),
            {
                id: "__candidate__",
                fromPath: candidateFromPath,
                toPath: candidateToPath,
                statusCode: 301 as RedirectStatusCode,
                createdAt: "",
                updatedAt: "",
            },
        ].filter(
            (redirect) =>
                !(redirect.fromPath === candidateToPath && redirect.toPath === candidateFromPath)
        )
    );

    const seen = new Set<string>();
    let currentPath = candidateFromPath;
    const maxDepth = 16;

    for (let depth = 0; depth < maxDepth; depth += 1) {
        if (seen.has(currentPath)) return true;
        seen.add(currentPath);

        const next = tempRedirects.find((redirect) => redirect.fromPath === currentPath);
        if (!next) return false;
        currentPath = next.toPath;
    }

    return true;
};

const upsertRedirectRecord = (
    redirects: CmsRedirectRecord[],
    input: UpsertRedirectInput,
    now: string
): CmsRedirectRecord[] => {
    const fromPath = normalizeRedirectPath(input.fromPath);
    const toPath = normalizeRedirectPath(input.toPath);
    if (fromPath === toPath) {
        return sortRedirects(redirects);
    }

    if (wouldCreateRedirectLoop(redirects, fromPath, toPath)) {
        throw new Error(`Redirect loop detected for '${fromPath}' -> '${toPath}'.`);
    }

    const statusCode = normalizeRedirectStatusCode(input.statusCode);
    const nextRedirects = redirects
        .filter((redirect) => !(redirect.fromPath === toPath && redirect.toPath === fromPath))
        .filter((redirect) => redirect.fromPath !== fromPath);
    const existing = redirects.find((redirect) => redirect.fromPath === fromPath);

    nextRedirects.push({
        id: existing?.id || createRedirectId(),
        fromPath,
        toPath,
        statusCode,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
    });

    return sortRedirects(nextRedirects);
};

const isDataStoreShape = (value: unknown): value is CmsDataStore => {
    if (!value || typeof value !== "object") return false;
    const asStore = value as Record<string, unknown>;
    return (
        typeof asStore.version === "number" &&
        Array.isArray(asStore.projects) &&
        (asStore.redirects === undefined || Array.isArray(asStore.redirects))
    );
};

export class FileCmsProjectRepository implements CmsProjectRepository {
    private static writeLockByPath = new Map<string, Promise<void>>();

    constructor(private readonly storePath: string = getCmsConfig().repository.filePath) {}

    private async withWriteLock<T>(work: () => Promise<T>) {
        const currentLock = FileCmsProjectRepository.writeLockByPath.get(this.storePath) ?? Promise.resolve();
        let releaseLock: () => void = () => undefined;
        const nextLock = new Promise<void>((resolve) => {
            releaseLock = resolve;
        });
        const queuedLock = currentLock
            .catch(() => undefined)
            .then(() => nextLock);

        FileCmsProjectRepository.writeLockByPath.set(this.storePath, queuedLock);

        await currentLock.catch(() => undefined);
        try {
            return await work();
        } finally {
            releaseLock();
            if (FileCmsProjectRepository.writeLockByPath.get(this.storePath) === queuedLock) {
                FileCmsProjectRepository.writeLockByPath.delete(this.storePath);
            }
        }
    }

    private async writeStore(store: CmsDataStore): Promise<void> {
        const directory = dirname(this.storePath);
        await mkdir(directory, { recursive: true });
        const tempPath = `${this.storePath}.${Date.now()}.${Math.random().toString(16).slice(2, 8)}.tmp`;
        await writeFile(tempPath, JSON.stringify(store, null, 2), "utf-8");
        await rename(tempPath, this.storePath);
    }

    private async readStore(): Promise<CmsDataStore> {
        try {
            const raw = await readFile(this.storePath, "utf-8");
            const parsed = JSON.parse(raw) as unknown;

            if (!isDataStoreShape(parsed)) {
                const seeded = createSeedStore();
                await this.writeStore(seeded);
                return seeded;
            }

            const store = cloneDeep(parsed);
            if (!Array.isArray(store.redirects)) {
                store.redirects = [];
            }
            store.projects = store.projects.map((project) =>
                normalizeProjectDocument(project as CmsProjectDocument)
            );
            if (store.projects.length === 0) {
                const seeded = createSeedStore();
                await this.writeStore(seeded);
                return seeded;
            }

            validateProjectsCollection(store.projects);
            sortAndReindexProjects(store.projects);
            store.redirects = sortRedirects(store.redirects);
            return store;
        } catch (error) {
            const asNodeError = error as NodeJS.ErrnoException;
            if (asNodeError.code !== "ENOENT") {
                throw error;
            }

            const seeded = createSeedStore();
            await this.writeStore(seeded);
            return seeded;
        }
    }

    async getAllProjects(): Promise<CmsProjectDocument[]> {
        const store = await this.readStore();
        sortAndReindexProjects(store.projects);
        return cloneDeep(store.projects);
    }

    async getPublishedProjects(): Promise<CmsProjectDocument[]> {
        const projects = await this.getAllProjects();
        return projects.filter((project) => project.status === "published");
    }

    async getProjectById(id: string): Promise<CmsProjectDocument | null> {
        const projects = await this.getAllProjects();
        return cloneDeep(projects.find((project) => project.id === id) ?? null);
    }

    async getProjectBySlug(slug: string): Promise<CmsProjectDocument | null> {
        const projects = await this.getAllProjects();
        const normalizedSlug = normalizeSlug(slug);
        return cloneDeep(projects.find((project) => project.slug === normalizedSlug) ?? null);
    }

    async createProjectFromTemplate(input: CreateProjectFromTemplateInput): Promise<CmsProjectDocument> {
        return this.withWriteLock(async () => {
            const store = await this.readStore();
            const normalizedSlug = normalizeSlug(input.slug);
            const order = input.order ?? store.projects.length;
            const status = input.status ?? "draft";

            const created = buildProjectFromTemplate({
                templateId: input.templateId,
                slug: normalizedSlug,
                title: input.title,
                clientName: input.clientName,
                order,
                status,
            });

            const projects = [...store.projects, created];
            sortAndReindexProjects(projects);
            validateProjectsCollection(projects);

            const nextStore: CmsDataStore = {
                ...store,
                projects,
            };

            await this.writeStore(nextStore);
            return cloneDeep(projects.find((project) => project.id === created.id)!);
        });
    }

    async createProject(input: CreateProjectInput): Promise<CmsProjectDocument> {
        return this.createProjectFromTemplate(normalizeCreateInput(input));
    }

    async updateProject(id: string, input: UpdateProjectInput): Promise<CmsProjectDocument> {
        return this.withWriteLock(async () => {
            const store = await this.readStore();
            const projectIndex = store.projects.findIndex((project) => project.id === id);
            if (projectIndex === -1) {
                throw new Error(`Project with id '${id}' was not found.`);
            }

            const now = createIsoNow();
            const current = store.projects[projectIndex];
            const nextSlug = input.slug ? normalizeSlug(input.slug) : current.slug;
            const slugChanged = nextSlug !== current.slug;
            const nextStatus = input.status ?? current.status;
            const shouldPublish = nextStatus === "published";
            const slugHistory = slugChanged
                ? [...new Set([...(current.slugHistory || []), current.slug])].filter(Boolean)
                : [...(current.slugHistory || [])];

            const updatedProject: CmsProjectDocument = {
                ...current,
                slug: nextSlug,
                slugHistory: input.slugHistory ?? slugHistory,
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
                sections: input.sections ? cloneDeep(input.sections) : current.sections,
                updatedAt: now,
                publishedAt: shouldPublish ? current.publishedAt ?? now : undefined,
            };

            const projects = [...store.projects];
            projects[projectIndex] = updatedProject;
            sortAndReindexProjects(projects);
            validateProjectsCollection(projects);

            let redirects = [...store.redirects];
            if (slugChanged) {
                redirects = upsertRedirectRecord(
                    redirects,
                    {
                        fromPath: `/work/${current.slug}`,
                        toPath: `/work/${nextSlug}`,
                        statusCode: 301,
                    },
                    now
                );
            }

            const nextStore: CmsDataStore = {
                ...store,
                projects,
                redirects,
            };
            await this.writeStore(nextStore);

            return cloneDeep(projects.find((project) => project.id === id)!);
        });
    }

    async deleteProject(id: string): Promise<void> {
        await this.withWriteLock(async () => {
            const store = await this.readStore();
            const projects = store.projects.filter((project) => project.id !== id);
            if (projects.length === store.projects.length) {
                throw new Error(`Project with id '${id}' was not found.`);
            }

            sortAndReindexProjects(projects);
            validateProjectsCollection(projects);

            await this.writeStore({
                ...store,
                projects,
            });
        });
    }

    async publishProject(id: string): Promise<CmsProjectDocument> {
        return this.updateProject(id, { status: "published" });
    }

    async unpublishProject(id: string): Promise<CmsProjectDocument> {
        return this.updateProject(id, { status: "draft" });
    }

    async getAllRedirects(): Promise<CmsRedirectRecord[]> {
        const store = await this.readStore();
        return cloneDeep(sortRedirects(store.redirects));
    }

    async getRedirectByFromPath(fromPath: string): Promise<CmsRedirectRecord | null> {
        const redirects = await this.getAllRedirects();
        const normalizedFromPath = normalizeRedirectPath(fromPath);
        return cloneDeep(redirects.find((redirect) => redirect.fromPath === normalizedFromPath) ?? null);
    }

    async upsertRedirect(input: UpsertRedirectInput): Promise<CmsRedirectRecord> {
        return this.withWriteLock(async () => {
            const store = await this.readStore();
            const now = createIsoNow();
            const nextRedirects = upsertRedirectRecord(store.redirects, input, now);
            await this.writeStore({
                ...store,
                redirects: nextRedirects,
            });

            const normalizedFromPath = normalizeRedirectPath(input.fromPath);
            const created = nextRedirects.find((redirect) => redirect.fromPath === normalizedFromPath);
            if (!created) {
                throw new Error("Redirect could not be saved.");
            }
            return cloneDeep(created);
        });
    }

    async deleteRedirect(id: string): Promise<void> {
        await this.withWriteLock(async () => {
            const store = await this.readStore();
            const nextRedirects = store.redirects.filter((redirect) => redirect.id !== id);
            if (nextRedirects.length === store.redirects.length) {
                throw new Error(`Redirect with id '${id}' was not found.`);
            }

            await this.writeStore({
                ...store,
                redirects: nextRedirects,
            });
        });
    }
}

export const createCmsProjectRepository = () => new FileCmsProjectRepository();
