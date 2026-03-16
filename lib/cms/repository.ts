import type {
    CmsProjectRepository,
    CreateProjectFromTemplateInput,
    CreateProjectInput,
    UpdateProjectInput,
} from "@/lib/cms/types";
import { getCmsConfig } from "@/lib/cms/config";
import { FileCmsProjectRepository } from "@/lib/cms/file-project-repository";
import { PostgresCmsProjectRepository } from "@/lib/cms/postgres-project-repository";
import { cmsLogger } from "@/lib/cms/logger";

let cachedRepository: CmsProjectRepository | null = null;
let cachedMode: string | null = null;

const resolveRepository = (): CmsProjectRepository => {
    const config = getCmsConfig();
    switch (config.repository.mode) {
        case "postgres":
            cmsLogger.info("CMS repository mode selected.", {
                mode: "postgres",
                schema: config.repository.postgresSchema,
                table: config.repository.postgresTable,
                redirectTable: config.repository.postgresRedirectTable,
            });
            return new PostgresCmsProjectRepository();
        case "file":
        default:
            cmsLogger.info("CMS repository mode selected.", {
                mode: "file",
                filePath: config.repository.filePath,
            });
            return new FileCmsProjectRepository(config.repository.filePath);
    }
};

export const createCmsProjectRepository = () => {
    const mode = getCmsConfig().repository.mode;
    if (!cachedRepository || cachedMode !== mode) {
        cachedRepository = resolveRepository();
        cachedMode = mode;
    }
    return cachedRepository;
};

export const resetCmsRepositoryForTests = () => {
    cachedRepository = null;
    cachedMode = null;
};

export type { CmsProjectRepository, CreateProjectFromTemplateInput, CreateProjectInput, UpdateProjectInput };
export { FileCmsProjectRepository } from "@/lib/cms/file-project-repository";
export { PostgresCmsProjectRepository } from "@/lib/cms/postgres-project-repository";
