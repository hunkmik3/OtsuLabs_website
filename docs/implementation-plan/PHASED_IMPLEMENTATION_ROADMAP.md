# Phased Implementation Roadmap

Principles:
- Keep current CMS/work foundation.
- Deliver launch-safe risk reduction first.
- Then unify SEO/content governance.
- Delay governance-heavy features (RBAC/revisions) to later phase.

## PHASE 1 — Launch-safe fixes

### Goal
Close critical SEO/conversion/compliance gaps required for safe launch.

### Scope
1. Redirect manager minimum viable (data + API + simple admin UI).
2. Auto 301 on slug change for published content.
3. Explicit canonical coverage on core indexable static pages.
4. Add cookies + terms pages.
5. Contact backend minimum flow (`/api/contact`) + validation.
6. Add `/contact/thank-you` route and submit UX.
7. Freeze launch scope (services/blog either gated or noindex depending chosen option).

### Files/modules likely affected
- URL/redirect:
  - `lib/cms/project-service.ts`
  - new `lib/cms/redirect-*`
  - new `app/api/admin/redirects/*`
  - possibly `proxy.ts` or route middleware helper for redirect resolution
- Metadata/core pages:
  - `app/page.tsx`, `app/about/page.tsx`, `app/work/page.tsx`, `app/contact/page.tsx`
- Legal:
  - new `app/cookies-policy/page.tsx`, `app/terms/page.tsx`
- Contact:
  - `app/contact/page.tsx`
  - new `app/api/contact/route.ts`
  - new `app/contact/thank-you/page.tsx`
- Sitemap:
  - `app/sitemap.ts`

### Risk level
- Medium (touches routing + public conversion flow).

### Expected output
- URLs protected against slug-change SEO loss.
- Minimal conversion path live and testable.
- Legal baseline complete.

### Launch impact
- High positive impact; removes major launch blockers.

---

## PHASE 2 — Unified SEO controls

### Goal
Create one SEO control system for all URL content types.

### Scope
1. Shared SEO model implementation (`seoTitle`, `metaDescription`, `canonicalUrl`, `noindex`, `nofollow`, `og*`, `includeInSitemap`, `schemaType`).
2. Shared SEO panel component for editors.
3. `follow/nofollow` handling in metadata generation.
4. Per-page `includeInSitemap` behavior.
5. Snippet preview in editor.
6. Schema selector + schema factory mapping.

### Files/modules likely affected
- Model/types:
  - `lib/cms/types.ts`
  - new `lib/seo/schema-factory.ts`
  - new shared SEO helpers under `lib/seo/*`
- Editor:
  - `components/admin/AdminProjectEditor.tsx`
  - new `components/admin/seo/*`
- Route metadata:
  - `app/work/[slug]/page.tsx`, `app/services/*`, `app/blog/*`, core static pages
- Sitemap:
  - `app/sitemap.ts`

### Risk level
- Medium (cross-cutting metadata changes).

### Expected output
- Consistent SEO governance and predictable metadata behavior.

### Launch impact
- Medium-high SEO quality gain, low UX disruption.

---

## PHASE 3 — Unified content system

### Goal
Migrate services/blog from local module-driven content to CMS-driven content types.

### Scope
1. Add CMS entities for `servicePage` and `blogArticle`.
2. Seed migration from `lib/seo-content/services.ts` and `lib/seo-content/blog.ts`.
3. Replace route resolvers to read from repository/service layer.
4. Reuse same SEO panel and publish workflow.
5. Keep route URLs stable.

### Files/modules likely affected
- Content models/services:
  - new `lib/cms/service-*`, `lib/cms/blog-*`
  - or unified content table with `contentType`
- Routes:
  - `app/services/page.tsx`, `app/services/[slug]/page.tsx`
  - `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Admin:
  - new admin editors/lists for services/blog or unified content editor
- Deprecation:
  - `lib/seo-content/services.ts`, `lib/seo-content/blog.ts` (eventual retirement)

### Risk level
- High (content source-of-truth migration).

### Expected output
- One CMS pipeline for work + services + blog.
- No more hardcoded runtime content modules for indexable routes.

### Launch impact
- High long-term maintainability and requirement alignment.

---

## PHASE 4 — Conversion & attribution

### Goal
Operationalize lead capture and attribution pipeline.

### Scope
1. Capture UTM/referrer on contact submit.
2. CTA tracking instrumentation.
3. CRM mapping adapter (webhook/API).
4. Consent logging per submission.
5. Basic lead routing rules.

### Files/modules likely affected
- `app/contact/page.tsx`
- `app/api/contact/route.ts`
- new `lib/lead/*`, `lib/tracking/*`, `lib/consent/*`
- optional analytics hook in `app/layout.tsx`

### Risk level
- Medium (third-party dependencies and data compliance).

### Expected output
- Measurable lead funnel with attribution context.

### Launch impact
- High business impact (conversion visibility and CRM readiness).

---

## PHASE 5 — Governance

### Goal
Add scalable editorial governance and content operations controls.

### Scope
1. Add review state (draft -> review -> published).
2. RBAC model (admin/editor/reviewer).
3. Revision snapshots + restore.
4. Taxonomy/categories/tags and cluster links.

### Files/modules likely affected
- auth/session + user models
- content services and APIs
- admin editor workflow UI
- repository schema migrations

### Risk level
- High (auth and workflow redesign).

### Expected output
- Multi-user safe publishing workflow.
- Stronger SEO/content governance at scale.

### Launch impact
- Low immediate launch impact, high long-term operational benefit.

## Suggested delivery cadence

1. Phase 1 (must-do before public confidence launch).
2. Phase 2 (immediately after or in parallel late Phase 1 for SEO consistency).
3. Phase 3 (major architecture alignment milestone).
4. Phase 4 (funnel and attribution maturity).
5. Phase 5 (governance maturity).
