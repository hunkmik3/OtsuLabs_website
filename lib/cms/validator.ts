import type {
    CmsProjectDocument,
    CmsValidationIssue,
    CmsValidationResult,
    MediaAsset,
    ProjectSection,
    ProjectSectionType,
    SeoSchemaType,
} from "@/lib/cms/types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isPositiveInteger = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0;

const addIssue = (issues: CmsValidationIssue[], field: string, message: string) => {
    issues.push({ field, message });
};

const ALLOWED_SCHEMA_TYPES = new Set<SeoSchemaType>([
    "creativeWork",
    "caseStudy",
    "article",
    "service",
    "videoObject",
    "webPage",
]);

const validateMediaAsset = (media: unknown, fieldPath: string, issues: CmsValidationIssue[]) => {
    const value = media as MediaAsset | undefined;
    if (!value || typeof value !== "object") {
        addIssue(issues, fieldPath, "Media is required.");
        return;
    }

    if (!isNonEmptyString(value.src)) {
        addIssue(issues, `${fieldPath}.src`, "Media source is required.");
    }
    if (!isNonEmptyString(value.alt)) {
        addIssue(issues, `${fieldPath}.alt`, "Media alt text is required.");
    }
    if (value.type !== "image" && value.type !== "video") {
        addIssue(issues, `${fieldPath}.type`, "Media type must be image or video.");
    }
    if (value.width !== undefined && (!Number.isFinite(value.width) || value.width <= 0)) {
        addIssue(issues, `${fieldPath}.width`, "Width must be a positive number when provided.");
    }
    if (value.height !== undefined && (!Number.isFinite(value.height) || value.height <= 0)) {
        addIssue(issues, `${fieldPath}.height`, "Height must be a positive number when provided.");
    }
    if (value.poster !== undefined && !isNonEmptyString(value.poster)) {
        addIssue(issues, `${fieldPath}.poster`, "Poster must be a non-empty string when provided.");
    }
};

const validateSectionByType = (section: ProjectSection, index: number, issues: CmsValidationIssue[]) => {
    const basePath = `sections[${index}]`;

    if (!isNonEmptyString(section.id)) {
        addIssue(issues, `${basePath}.id`, "Section id is required.");
    }
    if (!isPositiveInteger(section.order)) {
        addIssue(issues, `${basePath}.order`, "Section order must be a positive integer.");
    }
    if (typeof section.enabled !== "boolean") {
        addIssue(issues, `${basePath}.enabled`, "Section enabled must be true or false.");
    }

    const content = section.content as unknown as Record<string, unknown>;

    switch (section.type) {
        case "hero": {
            if (!isNonEmptyString(content.titleText)) addIssue(issues, `${basePath}.content.titleText`, "Hero title is required.");
            if (!isNonEmptyString(content.viewFullVideoLabel)) addIssue(issues, `${basePath}.content.viewFullVideoLabel`, "Hero video label is required.");
            if (!isNonEmptyString(content.animationTimeLabel)) addIssue(issues, `${basePath}.content.animationTimeLabel`, "Hero animation time label is required.");
            validateMediaAsset(content.media, `${basePath}.content.media`, issues);

            const metaItems = content.metaItems as unknown[];
            if (!Array.isArray(metaItems) || metaItems.length === 0) {
                addIssue(issues, `${basePath}.content.metaItems`, "Hero meta items are required.");
            } else {
                metaItems.forEach((item, metaIndex) => {
                    const itemValue = item as Record<string, unknown>;
                    if (!isNonEmptyString(itemValue.label)) {
                        addIssue(issues, `${basePath}.content.metaItems[${metaIndex}].label`, "Meta label is required.");
                    }
                    if (!isNonEmptyString(itemValue.value)) {
                        addIssue(issues, `${basePath}.content.metaItems[${metaIndex}].value`, "Meta value is required.");
                    }
                });
            }
            break;
        }
        case "aboutProject": {
            if (!isNonEmptyString(content.badgeLabel)) addIssue(issues, `${basePath}.content.badgeLabel`, "About badge label is required.");
            if (!isNonEmptyString(content.description)) addIssue(issues, `${basePath}.content.description`, "About description is required.");
            if (!isNonEmptyString(content.scopeBadgeLabel)) addIssue(issues, `${basePath}.content.scopeBadgeLabel`, "Scope badge label is required.");

            const scopeItems = content.scopeItems as unknown[];
            if (!Array.isArray(scopeItems) || scopeItems.length === 0) {
                addIssue(issues, `${basePath}.content.scopeItems`, "At least one scope item is required.");
            }

            const scopeGallery = content.scopeGallery as Record<string, unknown> | undefined;
            if (!scopeGallery || typeof scopeGallery !== "object") {
                addIssue(issues, `${basePath}.content.scopeGallery`, "Scope gallery is required.");
            } else {
                const top = scopeGallery.top as unknown[];
                if (!Array.isArray(top) || top.length !== 2) {
                    addIssue(issues, `${basePath}.content.scopeGallery.top`, "Scope top gallery must contain exactly 2 media assets.");
                } else {
                    validateMediaAsset(top[0], `${basePath}.content.scopeGallery.top[0]`, issues);
                    validateMediaAsset(top[1], `${basePath}.content.scopeGallery.top[1]`, issues);
                }
                validateMediaAsset(scopeGallery.bottom, `${basePath}.content.scopeGallery.bottom`, issues);
            }
            break;
        }
        case "preProduction": {
            if (!isNonEmptyString(content.badgeLabel)) addIssue(issues, `${basePath}.content.badgeLabel`, "Pre-production badge is required.");
            if (!isNonEmptyString(content.headerText)) addIssue(issues, `${basePath}.content.headerText`, "Pre-production header text is required.");

            const characterSheet = content.characterSheet as Record<string, unknown> | undefined;
            if (!characterSheet || typeof characterSheet !== "object") {
                addIssue(issues, `${basePath}.content.characterSheet`, "Character sheet object is required.");
            } else {
                if (!isNonEmptyString(characterSheet.label)) addIssue(issues, `${basePath}.content.characterSheet.label`, "Character sheet label is required.");
                if (!isNonEmptyString(characterSheet.text)) addIssue(issues, `${basePath}.content.characterSheet.text`, "Character sheet text is required.");

                const items = characterSheet.items as unknown[];
                if (!Array.isArray(items) || items.length === 0) {
                    addIssue(issues, `${basePath}.content.characterSheet.items`, "Character sheet items are required.");
                } else {
                    items.forEach((item, itemIndex) => {
                        const value = item as Record<string, unknown>;
                        if (!isNonEmptyString(value.id)) addIssue(issues, `${basePath}.content.characterSheet.items[${itemIndex}].id`, "Character sheet item id is required.");
                        validateMediaAsset(value.media, `${basePath}.content.characterSheet.items[${itemIndex}].media`, issues);
                    });
                }
            }

            const explorationSlides = content.explorationSlides as unknown[];
            if (!Array.isArray(explorationSlides) || explorationSlides.length === 0) {
                addIssue(issues, `${basePath}.content.explorationSlides`, "Exploration slides are required.");
            } else {
                explorationSlides.forEach((slide, slideIndex) => {
                    const value = slide as Record<string, unknown>;
                    if (!isNonEmptyString(value.id)) addIssue(issues, `${basePath}.content.explorationSlides[${slideIndex}].id`, "Slide id is required.");
                    if (!isNonEmptyString(value.title)) addIssue(issues, `${basePath}.content.explorationSlides[${slideIndex}].title`, "Slide title is required.");
                    if (!isNonEmptyString(value.description)) addIssue(issues, `${basePath}.content.explorationSlides[${slideIndex}].description`, "Slide description is required.");
                    validateMediaAsset(value.media, `${basePath}.content.explorationSlides[${slideIndex}].media`, issues);
                });
            }

            if (!isPositiveInteger(content.autoRotateMs)) {
                addIssue(issues, `${basePath}.content.autoRotateMs`, "Auto-rotate milliseconds must be a positive integer.");
            }
            break;
        }
        case "postExplorationGallery": {
            validateMediaAsset(content.primary, `${basePath}.content.primary`, issues);
            validateMediaAsset(content.secondary, `${basePath}.content.secondary`, issues);
            if (!isNonEmptyString(content.caption)) addIssue(issues, `${basePath}.content.caption`, "Post-exploration caption is required.");
            break;
        }
        case "production": {
            if (!isNonEmptyString(content.badgeLabel)) addIssue(issues, `${basePath}.content.badgeLabel`, "Production badge label is required.");
            if (!isNonEmptyString(content.description)) addIssue(issues, `${basePath}.content.description`, "Production description is required.");
            validateMediaAsset(content.media, `${basePath}.content.media`, issues);

            const overlayItems = content.overlayItems as unknown[];
            if (!Array.isArray(overlayItems) || overlayItems.length !== 3) {
                addIssue(issues, `${basePath}.content.overlayItems`, "Production overlay must contain exactly 3 text items.");
            }
            break;
        }
        case "animationKey": {
            if (!isNonEmptyString(content.title)) addIssue(issues, `${basePath}.content.title`, "Animation key title is required.");
            if (!isNonEmptyString(content.badgeLabel)) addIssue(issues, `${basePath}.content.badgeLabel`, "Animation key badge is required.");
            if (!isNonEmptyString(content.terms)) addIssue(issues, `${basePath}.content.terms`, "Animation key terms are required.");
            if (!isNonEmptyString(content.arrowSymbol)) addIssue(issues, `${basePath}.content.arrowSymbol`, "Animation key arrow symbol is required.");
            if (!isNonEmptyString(content.metaLabel)) addIssue(issues, `${basePath}.content.metaLabel`, "Animation key meta label is required.");

            const scenes = content.scenes as unknown[];
            if (!Array.isArray(scenes) || scenes.length === 0) {
                addIssue(issues, `${basePath}.content.scenes`, "At least one animation key scene is required.");
            } else {
                scenes.forEach((scene, sceneIndex) => {
                    const value = scene as Record<string, unknown>;
                    if (!isNonEmptyString(value.id)) addIssue(issues, `${basePath}.content.scenes[${sceneIndex}].id`, "Scene id is required.");
                    if (!isNonEmptyString(value.label)) addIssue(issues, `${basePath}.content.scenes[${sceneIndex}].label`, "Scene label is required.");
                    if (!isNonEmptyString(value.duration)) addIssue(issues, `${basePath}.content.scenes[${sceneIndex}].duration`, "Scene duration is required.");
                    validateMediaAsset(value.media, `${basePath}.content.scenes[${sceneIndex}].media`, issues);
                });
            }
            break;
        }
        case "keyHighlightPair": {
            validateMediaAsset(content.leftMedia, `${basePath}.content.leftMedia`, issues);
            validateMediaAsset(content.rightMedia, `${basePath}.content.rightMedia`, issues);
            if (!isNonEmptyString(content.caption)) addIssue(issues, `${basePath}.content.caption`, "Key highlight caption is required.");
            break;
        }
        case "credits": {
            if (!isNonEmptyString(content.title)) addIssue(issues, `${basePath}.content.title`, "Credits title is required.");
            if (!isNonEmptyString(content.badgeLabel)) addIssue(issues, `${basePath}.content.badgeLabel`, "Credits badge is required.");

            const validateCreditsColumn = (column: unknown, path: string) => {
                const groups = column as unknown[];
                if (!Array.isArray(groups)) {
                    addIssue(issues, path, "Credits column must be an array.");
                    return;
                }
                groups.forEach((group, groupIndex) => {
                    const value = group as Record<string, unknown>;
                    if (!isNonEmptyString(value.role)) addIssue(issues, `${path}[${groupIndex}].role`, "Credit role is required.");
                    const names = value.names as unknown[];
                    if (!Array.isArray(names) || names.length === 0) {
                        addIssue(issues, `${path}[${groupIndex}].names`, "Credit names are required.");
                    }
                });
            };

            validateCreditsColumn(content.leftColumn, `${basePath}.content.leftColumn`);
            validateCreditsColumn(content.rightColumn, `${basePath}.content.rightColumn`);
            break;
        }
        case "moreProjects": {
            if (!isNonEmptyString(content.title)) addIssue(issues, `${basePath}.content.title`, "More projects title is required.");
            if (!isNonEmptyString(content.backLinkLabel)) addIssue(issues, `${basePath}.content.backLinkLabel`, "Back link label is required.");
            if (!isNonEmptyString(content.backLinkHref)) addIssue(issues, `${basePath}.content.backLinkHref`, "Back link href is required.");
            if (content.mode !== "autoRelated" && content.mode !== "manual") {
                addIssue(issues, `${basePath}.content.mode`, "Mode must be autoRelated or manual.");
            }
            if (!isPositiveInteger(content.maxItems)) {
                addIssue(issues, `${basePath}.content.maxItems`, "Max items must be a positive integer.");
            }
            break;
        }
    }
};

const validateSectionCollections = (sections: ProjectSection[], issues: CmsValidationIssue[]) => {
    const sectionIds = new Set<string>();
    const sectionOrders = new Set<number>();
    const sectionTypes = new Set<ProjectSectionType>();

    sections.forEach((section, index) => {
        validateSectionByType(section, index, issues);

        if (sectionIds.has(section.id)) {
            addIssue(issues, `sections[${index}].id`, "Section id must be unique.");
        } else {
            sectionIds.add(section.id);
        }

        if (sectionOrders.has(section.order)) {
            addIssue(issues, `sections[${index}].order`, "Section order must be unique.");
        } else {
            sectionOrders.add(section.order);
        }

        if (sectionTypes.has(section.type)) {
            addIssue(issues, `sections[${index}].type`, "Section type should not be duplicated.");
        } else {
            sectionTypes.add(section.type);
        }
    });
};

export interface ValidateProjectDocumentInput {
    project: CmsProjectDocument;
    existingProjects?: CmsProjectDocument[];
}

export const validateProjectDocument = (input: ValidateProjectDocumentInput): CmsValidationResult => {
    const { project } = input;
    const issues: CmsValidationIssue[] = [];

    if (!isNonEmptyString(project.id)) addIssue(issues, "id", "Project id is required.");
    if (!isNonEmptyString(project.slug)) {
        addIssue(issues, "slug", "Project slug is required.");
    } else if (!SLUG_PATTERN.test(project.slug)) {
        addIssue(issues, "slug", "Slug must use lowercase letters, numbers, and hyphens only.");
    }

    if (!Array.isArray(project.slugHistory)) {
        addIssue(issues, "slugHistory", "slugHistory must be an array.");
    } else {
        const seenSlugHistory = new Set<string>();
        project.slugHistory.forEach((entry, index) => {
            if (!isNonEmptyString(entry)) {
                addIssue(issues, `slugHistory[${index}]`, "Slug history entry must be a non-empty string.");
                return;
            }

            if (!SLUG_PATTERN.test(entry)) {
                addIssue(issues, `slugHistory[${index}]`, "Slug history entry must follow slug format.");
            }

            if (entry === project.slug) {
                addIssue(issues, `slugHistory[${index}]`, "Slug history must not include current slug.");
            }

            if (seenSlugHistory.has(entry)) {
                addIssue(issues, `slugHistory[${index}]`, "Slug history entries must be unique.");
            } else {
                seenSlugHistory.add(entry);
            }
        });
    }

    if (!isPositiveInteger(project.order)) {
        addIssue(issues, "order", "Project order must be a positive integer.");
    }

    if (project.status !== "draft" && project.status !== "published") {
        addIssue(issues, "status", "Project status must be draft or published.");
    }

    if (!isNonEmptyString(project.templateId)) {
        addIssue(issues, "templateId", "Template id is required.");
    }
    if (!isNonEmptyString(project.templateVersion)) {
        addIssue(issues, "templateVersion", "Template version is required.");
    }

    if (!isNonEmptyString(project.basicInfo?.title)) addIssue(issues, "basicInfo.title", "Basic title is required.");
    if (!isNonEmptyString(project.basicInfo?.clientName)) addIssue(issues, "basicInfo.clientName", "Basic client name is required.");
    if (!isNonEmptyString(project.basicInfo?.dateLabel)) addIssue(issues, "basicInfo.dateLabel", "Basic date label is required.");
    if (!isNonEmptyString(project.basicInfo?.animationDuration)) addIssue(issues, "basicInfo.animationDuration", "Animation duration is required.");
    if (!isNonEmptyString(project.basicInfo?.scopeSummary)) addIssue(issues, "basicInfo.scopeSummary", "Scope summary is required.");
    if (!isNonEmptyString(project.basicInfo?.workCardOverlayText)) addIssue(issues, "basicInfo.workCardOverlayText", "Work card overlay text is required.");
    validateMediaAsset(project.basicInfo?.workCardImage, "basicInfo.workCardImage", issues);

    const seoTitle = project.seo?.seoTitle ?? project.seo?.title;
    const seoDescription = project.seo?.metaDescription ?? project.seo?.description;
    const seoCanonical = project.seo?.canonicalUrl ?? project.seo?.canonical;

    if (!isNonEmptyString(seoTitle)) addIssue(issues, "seo.seoTitle", "SEO title is required.");
    if (!isNonEmptyString(seoDescription)) addIssue(issues, "seo.metaDescription", "SEO description is required.");
    if (project.seo?.ogImage) {
        validateMediaAsset(project.seo.ogImage, "seo.ogImage", issues);
    }
    if (seoCanonical !== undefined && !isNonEmptyString(seoCanonical)) {
        addIssue(issues, "seo.canonicalUrl", "Canonical must be a non-empty string when provided.");
    }
    if (project.seo?.ogTitle !== undefined && !isNonEmptyString(project.seo.ogTitle)) {
        addIssue(issues, "seo.ogTitle", "OG title must be a non-empty string when provided.");
    }
    if (project.seo?.ogDescription !== undefined && !isNonEmptyString(project.seo.ogDescription)) {
        addIssue(issues, "seo.ogDescription", "OG description must be a non-empty string when provided.");
    }
    if (project.seo?.noindex !== undefined && typeof project.seo.noindex !== "boolean") {
        addIssue(issues, "seo.noindex", "noindex must be true or false.");
    }
    if (project.seo?.nofollow !== undefined && typeof project.seo.nofollow !== "boolean") {
        addIssue(issues, "seo.nofollow", "nofollow must be true or false.");
    }
    if (project.seo?.includeInSitemap !== undefined && typeof project.seo.includeInSitemap !== "boolean") {
        addIssue(issues, "seo.includeInSitemap", "includeInSitemap must be true or false.");
    }
    if (
        project.seo?.schemaType !== undefined &&
        !ALLOWED_SCHEMA_TYPES.has(project.seo.schemaType)
    ) {
        addIssue(
            issues,
            "seo.schemaType",
            "Schema type must be one of: creativeWork, caseStudy, article, service, videoObject, webPage."
        );
    }

    const existingProjects = input.existingProjects ?? [];
    const duplicatedSlugProject = existingProjects.find((existing) => existing.slug === project.slug && existing.id !== project.id);
    if (duplicatedSlugProject) {
        addIssue(issues, "slug", `Slug '${project.slug}' is already used by another project.`);
    }

    if (!Array.isArray(project.sections) || project.sections.length === 0) {
        addIssue(issues, "sections", "Project requires at least one section.");
    } else {
        validateSectionCollections(project.sections, issues);
    }

    return {
        valid: issues.length === 0,
        issues,
    };
};

export const assertValidProjectDocument = (input: ValidateProjectDocumentInput) => {
    const result = validateProjectDocument(input);
    if (result.valid) return;

    const message = result.issues.map((issue) => `${issue.field}: ${issue.message}`).join("\n");
    throw new Error(`CMS project validation failed.\n${message}`);
};
