# Project Inventory (Code-Based Audit)

Audit date: 2026-03-14  
Scope: current repository only (no assumptions about external infra unless explicitly configured in code/docs)

Status legend:
- `HAS`: implemented and visible in code
- `PARTIAL`: implemented but limited / not end-to-end / only some content types
- `MISSING`: no implementation found in repo
- `UNVERIFIED`: cannot be proven from code alone

## 1) Framework / App Structure

### Stack
- `HAS` Next.js App Router (`next@16.1.6`) and React 19.
- `HAS` TypeScript across app/cms modules.
- `HAS` API route handlers under `app/api/*`.
- References:
  - `package.json`
  - `app/`

### App Router map

#### Public pages
- `/` -> homepage (`app/page.tsx`)
- `/about` -> brand/about (`app/about/page.tsx`)
- `/work` -> project listing (`app/work/page.tsx`)
- `/work/[slug]` -> project detail (`app/work/[slug]/page.tsx`)
- `/contact` -> contact + FAQ (`app/contact/page.tsx`)
- `/privacy-policy` -> legal privacy page (`app/privacy-policy/page.tsx`)
- `/services` -> service index (`app/services/page.tsx`)
- `/services/[slug]` -> service detail (`app/services/[slug]/page.tsx`)
- `/blog` -> blog index (`app/blog/page.tsx`)
- `/blog/[slug]` -> blog detail (`app/blog/[slug]/page.tsx`)

#### Admin pages
- `/admin/login` (`app/admin/login/page.tsx`)
- `/admin/projects` (`app/admin/projects/page.tsx`)
- `/admin/projects/[id]` (`app/admin/projects/[id]/page.tsx`)
- `/admin/projects/[id]/preview` (`app/admin/projects/[id]/preview/page.tsx`)

#### API routes
- Public API:
  - `GET /api/projects` (`app/api/projects/route.ts`)
  - `GET /api/projects/[slug]` (`app/api/projects/[slug]/route.ts`)
- Admin API:
  - `POST /api/admin/auth/login` (`app/api/admin/auth/login/route.ts`)
  - `POST /api/admin/auth/logout` (`app/api/admin/auth/logout/route.ts`)
  - `GET/POST /api/admin/projects` (`app/api/admin/projects/route.ts`)
  - `GET/PATCH/DELETE /api/admin/projects/[id]` (`app/api/admin/projects/[id]/route.ts`)
  - `POST /api/admin/projects/[id]/publish` (`app/api/admin/projects/[id]/publish/route.ts`)
  - `POST /api/admin/projects/[id]/unpublish` (`app/api/admin/projects/[id]/unpublish/route.ts`)
  - `POST /api/admin/projects/[id]/duplicate` (`app/api/admin/projects/[id]/duplicate/route.ts`)
  - `POST /api/admin/media` (`app/api/admin/media/route.ts`)

## 2) Data / Persistence Layer

### Repository layer
- `HAS` clean repository interface abstraction via `CmsProjectRepository`.
- `HAS` factory selection by mode (`file` or `postgres`).
- References:
  - `lib/cms/types.ts` (interface)
  - `lib/cms/repository.ts` (factory)

### Postgres mode
- `HAS` Postgres repository implementation.
- `HAS` schema bootstrap (`ensureCmsPostgresSchema`).
- `HAS` transactional updates + row lock (`FOR UPDATE` in update flow).
- `HAS` migration/verify scripts.
- References:
  - `lib/cms/postgres-project-repository.ts`
  - `lib/cms/postgres-schema.ts`
  - `scripts/cms/migrate-postgres.ts`
  - `scripts/cms/verify-postgres.ts`

### File mode
- `HAS` JSON file repository with atomic temp-write + rename.
- `HAS` in-process write lock per file path.
- References:
  - `lib/cms/file-project-repository.ts`

### Service layer
- `HAS` service API for CRUD/publish/unpublish/duplicate/public query.
- `HAS` input validation and error code mapping.
- References:
  - `lib/cms/project-service.ts`
  - `lib/cms/api-response.ts`
  - `lib/cms/api-request.ts`

### Mapper layer
- `HAS` mapper from CMS docs to legacy listing shape.
- `HAS` detail renderer mapper from section model -> UI section props.
- References:
  - `lib/cms/mapper.ts`
  - `lib/cms/project-detail-mapper.ts`

### Render resolver
- `HAS` centralized resolver for public render metadata and fallback.
- `HAS` published-only policy in public render path.
- `PARTIAL` fallback includes seed/legacy imports if CMS unavailable.
- References:
  - `lib/cms/render-resolver.ts`
  - `lib/cms/fallback.ts`

## 3) CMS Modules Currently Implemented

### Content editing
- `HAS` admin project list/create/edit UI.
- `HAS` structured section editor (form-based) + advanced JSON mode.
- `PARTIAL` not WYSIWYG visual canvas; form editor only.
- References:
  - `components/admin/AdminProjectsManager.tsx`
  - `components/admin/AdminProjectEditor.tsx`
  - `components/admin/editor/ProjectSectionsEditor.tsx`
  - `components/admin/sections/SectionEditorFactory.tsx`

### Admin auth
- `HAS` token login + signed session cookie.
- `HAS` proxy gate for `/admin/*` and `/api/admin/*`.
- References:
  - `app/api/admin/auth/login/route.ts`
  - `lib/cms/admin-session.ts`
  - `lib/cms/auth.ts`
  - `proxy.ts`

### Media upload
- `HAS` upload API + media storage abstraction.
- `HAS` local and S3-compatible backends.
- References:
  - `app/api/admin/media/route.ts`
  - `lib/cms/media-storage.ts`
  - `components/admin/fields/MediaInputField.tsx`

### Preview
- `HAS` admin draft preview route using same project renderer as public detail.
- References:
  - `app/admin/projects/[id]/preview/page.tsx`
  - `components/work/project/ProjectDetailRenderer.tsx`
  - `lib/cms/render-resolver.ts`

### Publish flow
- `HAS` publish/unpublish endpoints and service methods.
- References:
  - `app/api/admin/projects/[id]/publish/route.ts`
  - `app/api/admin/projects/[id]/unpublish/route.ts`
  - `lib/cms/project-service.ts`

### Duplicate
- `HAS` duplicate endpoint; cloned document defaults to draft.
- References:
  - `app/api/admin/projects/[id]/duplicate/route.ts`
  - `lib/cms/project-service.ts`

### Slug handling
- `HAS` slug normalize + unique conflict checks.
- `MISSING` slug-change auto-301 redirect history.
- References:
  - `lib/cms/project-service.ts`
  - `lib/cms/validator.ts`
  - `next.config.ts` (only static redirects)

### SEO fields in CMS
- `HAS` per-project SEO fields: `title`, `description`, `ogImage`, `canonical`, `noindex`.
- References:
  - `lib/cms/types.ts` (`ProjectSeoMeta`)
  - `lib/cms/project-service.ts`
  - `lib/cms/render-resolver.ts`

### Sitemap / robots / schema
- `HAS` dynamic sitemap and robots routes.
- `HAS` JSON-LD at layout and route-level for work/services/blog pages.
- References:
  - `app/sitemap.ts`
  - `app/robots.ts`
  - `app/layout.tsx`
  - `app/work/[slug]/page.tsx`
  - `app/services/[slug]/page.tsx`
  - `app/blog/[slug]/page.tsx`

### Internal linking
- `PARTIAL` work detail has related services (feature-flagged).
- `PARTIAL` services/blog link each other and to work.
- `PARTIAL` header/footer currently focus only on core pages; services/blog not in main nav.
- References:
  - `components/work/project/RelatedServicesLinks.tsx`
  - `lib/cms/project-detail-mapper.ts`
  - `app/services/[slug]/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `components/Header.tsx`
  - `components/FooterSection.tsx`

## 4) SEO-related Implementation

- `HAS` site-level metadata defaults (title template, OG, Twitter, canonical base behavior).
  - `app/layout.tsx`
- `HAS` route-level metadata for core pages and dynamic work/services/blog.
  - `app/page.tsx`, `app/about/page.tsx`, `app/work/page.tsx`, `app/contact/page.tsx`, `app/privacy-policy/page.tsx`, `app/work/[slug]/page.tsx`, `app/services/*`, `app/blog/*`
- `HAS` robots + sitemap endpoints.
  - `app/robots.ts`, `app/sitemap.ts`
- `HAS` canonical for work detail and service/blog detail/index.
  - `lib/cms/render-resolver.ts`, `app/services/*`, `app/blog/*`
- `PARTIAL` canonical not explicitly set in every static core page (home has default, about/work/contact do not set explicit `alternates.canonical`).
- `HAS` service/blog launch gating through `CMS_EXPANDED_CONTENT_PUBLIC`.
  - `lib/seo-content/launch.ts`, `app/sitemap.ts`, `app/services/*`, `app/blog/*`

## 5) Form / Lead Capture / CTA

### CTA
- `HAS` persistent contact CTA via header mailto and footer mailto.
  - `components/Header.tsx`, `components/FooterSection.tsx`
- `PARTIAL` many CTA-styled buttons exist but are visual-only (no conversion tracking / backend action).
  - `components/SelectedWorksSection.tsx`, `components/ContactSection.tsx`, `app/work/page.tsx`

### Contact forms
- `PARTIAL` contact form UI exists on `/contact`.
- `MISSING` submit handler/API integration for lead storage/CRM.
- `MISSING` thank-you page flow.
- References:
  - `app/contact/page.tsx`
  - no matching lead-submit API route found in `app/api/*`

### Tracking
- `MISSING` GA/GTM hooks or conversion event tracking in codebase.
- `MISSING` UTM/referrer capture.
- References:
  - no `gtm`, `gtag`, `dataLayer`, `utm` implementation found across `app/`, `components/`, `lib/`

## 6) Legal / Compliance Pages

- `HAS` privacy policy route.
  - `app/privacy-policy/page.tsx`
- `MISSING` cookies policy page.
- `MISSING` terms page.
- `MISSING` consent logging framework.

## 7) Workflow / Permissions

### Login/auth
- `HAS` token login route and signed cookie session.
- `HAS` admin protection through proxy and server-side request checks.

### Editor flow
- `HAS` create blank/from template, edit, duplicate, publish/unpublish, delete.
- `HAS` unsaved-changes warning and autosave behavior.
  - `components/admin/editor/useUnsavedChanges.ts`
  - `components/admin/AdminProjectEditor.tsx`

### Draft/publish
- `HAS` explicit status model (`draft`, `published`).
- `HAS` public APIs and render routes filtered to published content.

### Versioning / rollback
- `MISSING` content version history and rollback snapshots.

### Role-based access
- `MISSING` RBAC or multi-user roles.
- current model is single admin token session.

## Additional notes relevant to scope alignment

- Credits section is intentionally fixed globally and removed from editable CMS section flow.
  - `lib/cms/fixed-credits.ts`
  - `lib/cms/project-detail-mapper.ts`
  - `components/admin/AdminProjectEditor.tsx` (`NON_EDITABLE_SECTION_TYPES = credits`)
- Services/blog are currently data-driven by local content modules (not CMS project repository).
  - `lib/seo-content/services.ts`, `lib/seo-content/blog.ts`
- Launch policy for services/blog indexing is controlled by feature flag (`false` by default in `.env.example`).
  - `lib/seo-content/launch.ts`
