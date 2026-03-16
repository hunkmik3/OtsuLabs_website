import type { SeoSchemaType } from "@/lib/seo/types";
export type { SeoSchemaType } from "@/lib/seo/types";

export type PublishStatus = "draft" | "published";
export type ProjectTemplateId = "blank-v1" | "novathera-v1" | "legacy-import-v1";
export type MediaType = "image" | "video";
export type RedirectStatusCode = 301 | 302;

export interface MediaAsset {
    src: string;
    alt: string;
    type: MediaType;
    width?: number;
    height?: number;
    poster?: string;
}

export interface CtaAction {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "ghost";
    target?: "_self" | "_blank";
}

export interface TextBlock {
    id: string;
    type: "text";
    label?: string;
    text: string;
}

export interface RichTextBlock {
    id: string;
    type: "richText";
    label?: string;
    html: string;
}

export interface MediaBlock {
    id: string;
    type: "media";
    label?: string;
    media: MediaAsset;
    caption?: string;
}

export interface CtaBlock {
    id: string;
    type: "cta";
    label?: string;
    cta: CtaAction;
}

export interface RepeaterBlock {
    id: string;
    type: "repeater";
    label?: string;
    items: Record<string, unknown>[];
}

export type SectionBlock = TextBlock | RichTextBlock | MediaBlock | CtaBlock | RepeaterBlock;

export interface SectionMeta {
    note?: string;
    className?: string;
}

export type ProjectSectionType =
    | "hero"
    | "aboutProject"
    | "preProduction"
    | "postExplorationGallery"
    | "production"
    | "animationKey"
    | "keyHighlightPair"
    | "credits"
    | "moreProjects";

export interface BaseProjectSection<TType extends ProjectSectionType, TContent> {
    id: string;
    type: TType;
    enabled: boolean;
    order: number;
    heading?: string;
    subheading?: string;
    content: TContent;
    blocks?: SectionBlock[];
    meta?: SectionMeta;
}

export interface HeroMetaItem {
    label: string;
    value: string;
}

export interface HeroSectionContent {
    titleText: string;
    viewFullVideoLabel: string;
    animationTimeLabel: string;
    media: MediaAsset;
    metaItems: HeroMetaItem[];
}

export interface AboutProjectSectionContent {
    badgeLabel: string;
    description: string;
    scopeBadgeLabel: string;
    scopeItems: string[];
    scopeGallery: {
        top: [MediaAsset, MediaAsset];
        bottom: MediaAsset;
    };
}

export interface CharacterSheetItem {
    id: string;
    media: MediaAsset;
    label?: string;
}

export interface ExplorationSlideItem {
    id: string;
    media: MediaAsset;
    title: string;
    description: string;
}

export interface PreProductionSectionContent {
    badgeLabel: string;
    headerText: string;
    characterSheet: {
        label: string;
        text: string;
        items: CharacterSheetItem[];
    };
    explorationSlides: ExplorationSlideItem[];
    autoRotateMs: number;
}

export interface PostExplorationGalleryContent {
    primary: MediaAsset;
    secondary: MediaAsset;
    caption: string;
}

export interface ProductionSectionContent {
    badgeLabel: string;
    description: string;
    media: MediaAsset;
    overlayItems: [string, string, string];
}

export interface AnimationKeyScene {
    id: string;
    label: string;
    media: MediaAsset;
    duration: string;
}

export interface AnimationKeySectionContent {
    title: string;
    badgeLabel: string;
    terms: string;
    arrowSymbol: string;
    metaLabel: string;
    scenes: AnimationKeyScene[];
}

export interface KeyHighlightPairSectionContent {
    leftMedia: MediaAsset;
    rightMedia: MediaAsset;
    caption: string;
}

export interface CreditGroup {
    role: string;
    names: string[];
}

export interface CreditsSectionContent {
    title: string;
    badgeLabel: string;
    leftColumn: CreditGroup[];
    rightColumn: CreditGroup[];
}

export interface MoreProjectCardReference {
    slug: string;
    title: string;
    subtitle: string;
    year: string;
    image: MediaAsset;
}

export interface MoreProjectsSectionContent {
    title: string;
    backLinkLabel: string;
    backLinkHref: string;
    mode: "autoRelated" | "manual";
    maxItems: number;
    manualItems?: MoreProjectCardReference[];
}

export type SectionContentByType = {
    hero: HeroSectionContent;
    aboutProject: AboutProjectSectionContent;
    preProduction: PreProductionSectionContent;
    postExplorationGallery: PostExplorationGalleryContent;
    production: ProductionSectionContent;
    animationKey: AnimationKeySectionContent;
    keyHighlightPair: KeyHighlightPairSectionContent;
    credits: CreditsSectionContent;
    moreProjects: MoreProjectsSectionContent;
};

export type HeroSection = BaseProjectSection<"hero", HeroSectionContent>;
export type AboutProjectSection = BaseProjectSection<"aboutProject", AboutProjectSectionContent>;
export type PreProductionSection = BaseProjectSection<"preProduction", PreProductionSectionContent>;
export type PostExplorationGallerySection = BaseProjectSection<"postExplorationGallery", PostExplorationGalleryContent>;
export type ProductionSection = BaseProjectSection<"production", ProductionSectionContent>;
export type AnimationKeySection = BaseProjectSection<"animationKey", AnimationKeySectionContent>;
export type KeyHighlightPairSection = BaseProjectSection<"keyHighlightPair", KeyHighlightPairSectionContent>;
export type CreditsSection = BaseProjectSection<"credits", CreditsSectionContent>;
export type MoreProjectsSection = BaseProjectSection<"moreProjects", MoreProjectsSectionContent>;

export type ProjectSection =
    | HeroSection
    | AboutProjectSection
    | PreProductionSection
    | PostExplorationGallerySection
    | ProductionSection
    | AnimationKeySection
    | KeyHighlightPairSection
    | CreditsSection
    | MoreProjectsSection;

export type ProjectSectionByType<T extends ProjectSectionType> = Extract<ProjectSection, { type: T }>;

export interface ProjectBasicInfo {
    title: string;
    subtitle?: string;
    clientName: string;
    dateLabel: string;
    animationDuration: string;
    scopeSummary: string;
    workCardImage: MediaAsset;
    workCardOverlayText: string;
}

export interface ProjectSeoMeta {
    seoTitle: string;
    metaDescription: string;
    slug?: string;
    canonicalUrl?: string;
    noindex?: boolean;
    nofollow?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: MediaAsset;
    includeInSitemap?: boolean;
    schemaType?: SeoSchemaType;
    // Legacy aliases kept for backward compatibility.
    title?: string;
    description?: string;
    canonical?: string;
}

export interface CmsProjectDocument {
    id: string;
    slug: string;
    slugHistory: string[];
    templateId: ProjectTemplateId;
    templateVersion: string;
    status: PublishStatus;
    order: number;
    basicInfo: ProjectBasicInfo;
    seo: ProjectSeoMeta;
    sections: ProjectSection[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}

export interface CmsDataStore {
    version: number;
    projects: CmsProjectDocument[];
    redirects: CmsRedirectRecord[];
}

export interface CreateProjectInput {
    slug: string;
    title: string;
    clientName?: string;
    order?: number;
    status?: PublishStatus;
}

export interface CreateProjectFromTemplateInput extends CreateProjectInput {
    templateId: ProjectTemplateId;
}

export interface UpdateProjectInput {
    slug?: string;
    order?: number;
    status?: PublishStatus;
    slugHistory?: string[];
    basicInfo?: Partial<ProjectBasicInfo>;
    seo?: Partial<ProjectSeoMeta>;
    sections?: ProjectSection[];
}

export interface CmsRedirectRecord {
    id: string;
    fromPath: string;
    toPath: string;
    statusCode: RedirectStatusCode;
    createdAt: string;
    updatedAt: string;
}

export interface UpsertRedirectInput {
    fromPath: string;
    toPath: string;
    statusCode?: RedirectStatusCode;
}

export interface CmsProjectRepository {
    getAllProjects(): Promise<CmsProjectDocument[]>;
    getPublishedProjects(): Promise<CmsProjectDocument[]>;
    getProjectById(id: string): Promise<CmsProjectDocument | null>;
    getProjectBySlug(slug: string): Promise<CmsProjectDocument | null>;
    createProjectFromTemplate(input: CreateProjectFromTemplateInput): Promise<CmsProjectDocument>;
    createProject(input: CreateProjectInput): Promise<CmsProjectDocument>;
    updateProject(id: string, input: UpdateProjectInput): Promise<CmsProjectDocument>;
    deleteProject(id: string): Promise<void>;
    publishProject(id: string): Promise<CmsProjectDocument>;
    unpublishProject(id: string): Promise<CmsProjectDocument>;
    getAllRedirects(): Promise<CmsRedirectRecord[]>;
    getRedirectByFromPath(fromPath: string): Promise<CmsRedirectRecord | null>;
    upsertRedirect(input: UpsertRedirectInput): Promise<CmsRedirectRecord>;
    deleteRedirect(id: string): Promise<void>;
}

export interface CmsValidationIssue {
    field: string;
    message: string;
}

export interface CmsValidationResult {
    valid: boolean;
    issues: CmsValidationIssue[];
}
