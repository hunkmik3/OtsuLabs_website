# Target Architecture

Purpose: define the minimum-change target architecture that aligns current codebase with client requirements without rewriting core CMS foundation.

Inputs used:
- `docs/project-audit/PROJECT_INVENTORY.md`
- `docs/project-audit/CONTENT_TYPE_MAP.md`
- `docs/project-audit/REQUIREMENT_MATCH_MATRIX.md`
- `docs/project-audit/SEO_GAP_REVIEW.md`
- `docs/project-audit/ROUTE_URL_STRATEGY_REVIEW.md`
- `docs/project-audit/KEEP_VS_REFACTOR_PLAN.md`
- `docs/project-audit/EXECUTIVE_SUMMARY.md`

## 1) Content Layer

### Content types to support

1. `workProject` (existing strong type; keep as base template)
2. `servicePage` (migrate from `lib/seo-content/services.ts`)
3. `blogArticle` (migrate from `lib/seo-content/blog.ts`)
4. `genericPage` (for core landing pages like About variants, campaign pages)
5. `legalPage` (privacy/cookies/terms)
6. Future:
- `caseStudy` (if separated from work)
- `pressMention`
- `resource`

### Route ownership model

- `/work/[slug]` -> `workProject` document
- `/services/[slug]` -> `servicePage` document
- `/blog/[slug]` -> `blogArticle` document
- `/[generic-slug]` or fixed route map -> `genericPage` document
- `/privacy-policy`, `/cookies-policy`, `/terms` -> `legalPage` documents (fixed slugs)

### Source-of-truth rule

- Every indexable URL page must resolve from CMS content document + shared SEO model.
- Local modules (`lib/seo-content/*`) become migration seeds only, not runtime source of truth.

## 2) Shared SEO Layer

Use one shared SEO object for every URL-bearing content type.

### Shared SEO fields (minimum)

- `seoTitle: string`
- `metaDescription: string`
- `slug: string`
- `canonicalUrl?: string`
- `noindex: boolean`
- `nofollow: boolean`
- `ogTitle?: string`
- `ogDescription?: string`
- `ogImage?: MediaAsset`
- `includeInSitemap: boolean`
- `schemaType: SchemaType`

### Fallback logic policy

- Display title (`content.title`) is independent from `seoTitle`.
- `seoTitle` fallback: `content.title`.
- `metaDescription` fallback: first meaningful summary field per content type.
- `canonicalUrl` fallback: resolved current public URL.
- Robots:
  - `index = !noindex`
  - `follow = !nofollow`
- OG fallback:
  - `ogTitle` -> `seoTitle`
  - `ogDescription` -> `metaDescription`
  - `ogImage` -> content primary image (if present)
- Sitemap inclusion = `includeInSitemap && !noindex` (policy configurable).

### Rendering integration

- Build one metadata mapper per content type, all using same SEO fallback helper.
- `generateMetadata` in routes becomes thin wrappers around shared resolver.

## 3) URL / Redirect Layer

### Required capabilities

- Slug history persistence per content item.
- Redirect table with `fromPath`, `toPath`, `type (301/302)`, `isActive`.
- Auto-create 301 record when slug changes on published content.
- Admin redirect manager (CRUD + validation + conflict detection).

### Runtime behavior

- Redirect resolution runs before content lookup for public routes.
- Prevent loops and chained redirects where possible.
- Keep static redirects in `next.config.ts` for legacy fixed mappings only; dynamic redirects move to CMS-managed layer.

## 4) Schema Layer

### Shared schema factory

- Central `schemaFactory(contentType, schemaType, data)` service.
- Route files should not handcraft full JSON-LD objects per page except minimal wrappers.

### Supported schemaType enum (initial)

- `CreativeWork`
- `Service`
- `BlogPosting`
- `WebPage`
- `FAQPage`
- `Organization` (global)

### Mapping principle

- Content types map fields -> schema payload.
- Schema logic remains centralized and testable.

## 5) Editor Layer

### Separation model

- `Main Content Editor`:
  - section/content fields
  - media/repeater/layout ordering
- `SEO Panel`:
  - shared SEO object
  - snippet preview
  - robots/indexing toggle
  - schema selector

### Shared UI expectations

- Reusable `SeoPanel` component for all URL content types.
- Reusable slug/canonical controls and validation surface.
- Reusable internal linking relation inputs (manual + suggested).

### Keep from current implementation

- Keep current structured section editor pattern as base.
- Keep preview route with same renderer engine.
- Expand editor scope per content type instead of rewriting editor from scratch.

## 6) Workflow Layer

### Target lifecycle states

- `draft`
- `review` (new)
- `published`
- optional `archived` (future)

### Phase strategy

- Launch-safe: retain `draft/published` with stronger guardrails.
- Governance phase: add `review` state and approval constraints.

### Revision strategy

- Short-term: publish snapshots table (minimal rollback).
- Later: full revision history with compare/restore UI.

### Roles strategy (phase-later)

- Current: single admin token session.
- Target: role model (`admin`, `editor`, `reviewer`) with action-level permissions.

## Target architecture decisions (non-negotiable)

1. Keep current CMS foundation (repository/service/mapper/preview).
2. Unify SEO and URL governance across all URL content types.
3. Remove runtime dependency on local service/blog modules.
4. Add redirect + slug history before broad SEO expansion.
5. Deliver launch-safe changes first, then governance/deep editorial features.
