# Executive Summary

## 1) Current architecture summary

- Stack is solid: Next.js App Router + custom CMS + repository abstraction (`file` / `postgres`) + media abstraction (`local` / `s3`) + admin auth/session.
- Core CMS capability is strongest on `/work/[slug]`:
  - draft/publish lifecycle
  - structured section editor
  - reusable production renderer for public and admin preview
  - per-project SEO fields (`title`, `description`, `ogImage`, `canonical`, `noindex`).
- Technical SEO baseline is in place: `metadataBase`, route metadata, robots, sitemap, JSON-LD for key routes.

## 2) Biggest mismatches with client requirements

1. SEO/content governance is not unified across all content types.
   - Work is CMS-driven, but services/blog are local code modules.
2. No redirect manager and no auto-301 when slug changes.
3. Contact conversion pipeline is incomplete (form submit backend, CRM mapping, thank-you flow, UTM capture).
4. Missing editorial governance features (RBAC, review state, revisions).
5. Legal/compliance scope is partial (privacy exists; cookies/terms/consent logging missing).

## 3) Biggest risks if launch now

- SEO risk: URL changes can break indexed pages because redirect history is absent.
- Growth/ROI risk: cannot measure or route leads reliably without form backend + tracking.
- Operations risk: mixed content architecture (CMS + hardcoded services/blog) increases maintenance overhead.
- Compliance risk: legal and consent requirements are incomplete for stricter environments.

## 4) Recommended next 3 phases

### Phase 1: Launch-hardening (short)
- Freeze public scope to core pages + work CMS.
- Add explicit canonical coverage for all indexable static routes.
- Add cookies + terms pages.
- Add redirect model (minimum viable manager + auto-301 on slug change).

### Phase 2: Conversion and attribution (short-mid)
- Implement `/api/contact` submit flow with validation.
- Add thank-you route and error-safe form UX.
- Add UTM/referrer capture and basic analytics events for CTA/form milestones.

### Phase 3: Unified content system (mid)
- Migrate services/blog to CMS content types with shared SEO panel/schema controls.
- Keep route behavior but replace hardcoded local content modules.
- Add editor workflows (review state, optional revision snapshots).

## 5) Estimated refactor scope

- **Launch-safe alignment scope**: `MEDIUM`
- **Full requirement alignment scope** (including unified CMS for all content + governance): `LARGE`
