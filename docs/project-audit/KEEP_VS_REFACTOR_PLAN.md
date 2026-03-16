# Keep vs Refactor Plan

Strategic decision framework for launch and post-launch alignment with client requirements.

Priority levels:
- `HIGH`: blocks requirement compliance or introduces launch risk
- `MEDIUM`: important but not immediate launch blocker
- `LOW`: optimization/debt, can be scheduled later

## 1) KEEP AS-IS

| Module / Route / Feature | Why keep | Impact if not changed | Priority |
|---|---|---|---|
| CMS repository abstraction (`file` + `postgres`) | Clean interface with swappable persistence backends already working | Stable foundation for future DB/storage changes | HIGH |
| Admin auth gate via proxy + signed session | Centralized protection for admin pages and admin APIs | Prevents unauthorized access in current model | HIGH |
| Work detail resolver + mapper + renderer layering | Good separation of data fetch, mapping, render; supports preview and production reuse | Keeps `/work/[slug]` maintainable and extensible | HIGH |
| Draft/publish/unpublish/duplicate CRUD flow | Core editorial lifecycle is operational | Enables controlled public exposure | HIGH |
| Technical SEO baseline (metadataBase, robots, sitemap, JSON-LD) | Strong baseline compared to old site | Preserves crawl/index fundamentals | HIGH |
| Media storage abstraction (`local` / `s3`) | Good production path for R2/S3 | Avoids lock-in to local filesystem | MEDIUM |
| Fixed global credits section behavior | Matches current business decision and reduces editor complexity | Keeps design consistency across projects | MEDIUM |

## 2) KEEP BUT IMPROVE

| Module / Route / Feature | Why keep (direction is right) | What to improve | Impact if not improved | Priority |
|---|---|---|---|---|
| Admin structured section editor | Good section-based authoring foundation | Add stronger field UX, shortcuts, content templates | Slower editor operations as content volume grows | MEDIUM |
| Validation system (`validator.ts`) | Already enforces shape and media requirements | Add cross-field SEO checks (title lengths, canonical format), actionable field-level messages | Inconsistent SEO quality in authored content | MEDIUM |
| Sitemap generation | Dynamic and robust for work pages | Add per-page include/exclude controls and include service/blog index routes when public | Limited SEO governance for indexing scope | MEDIUM |
| Canonical strategy | Exists for key dynamic routes | Add explicit canonical across all indexable static pages | Possible canonical ambiguity on some pages | MEDIUM |
| Backup scripts | DB backup/restore scripts exist | Add scheduled automation and tested runbook for S3/R2 backups | Recovery process remains operator-dependent | HIGH |
| Launch flag for services/blog (`CMS_EXPANDED_CONTENT_PUBLIC`) | Useful scope gate | Add policy docs and CI check to avoid accidental indexing toggles | Risk of inconsistent launch behavior across envs | MEDIUM |

## 3) REFACTOR

| Module / Route / Feature | Why refactor | Impact if not fixed | Priority |
|---|---|---|---|
| Services/blog content source (`lib/seo-content/*`) vs CMS content source | Violates requirement that content types should use same CMS + SEO system | Architecture divergence, duplicated logic, hard-to-scale editorial workflow | HIGH |
| Redirect management (slug changes) | No automatic 301 on slug changes and no redirect manager | SEO equity loss and broken links after URL edits | HIGH |
| Contact form flow | UI-only form with no backend, no thank-you route, no lead mapping | No measurable lead capture despite CTA surface | HIGH |
| SEO panel scope | SEO editing currently only for CMS work projects | Non-work pages remain dev-maintained; operational bottleneck | HIGH |
| Legacy fallback chain in public work listing/detail | Useful during migration, but blurs source-of-truth | Data inconsistency risk and audit complexity | MEDIUM |
| Tracking and attribution layer | No GA/GTM or UTM/referrer capture | No funnel measurement for SEO/lead ROI | HIGH |
| Legal completeness | Missing cookies and terms pages | Compliance and trust risk for production client site | HIGH |

## 4) DEFER (Phase-later)

| Module / Route / Feature | Why defer | Impact of deferral | Priority |
|---|---|---|---|
| Full visual drag-and-drop WYSIWYG canvas | Nice-to-have beyond current form-based editor | Current structured editor still functional | LOW |
| Full RBAC (multi-role, per-content permissions) | Not mandatory for small trusted team launch | Single-token model acceptable short-term | MEDIUM |
| Revision history with rollback UI | Valuable but not launch-critical if backups are reliable | Slower recovery from content mistakes | MEDIUM |
| Taxonomy system (categories/tags/resource hub) | Requires broader content scale and strategy | Minimal effect at early content volume | LOW |
| Localization/hreflang system | Not required for single-language launch | Limited international SEO reach for now | LOW |
| Internal site search and newsletter ecosystem | Not critical to current conversion path | Mostly growth optimization, not core launch blocker | LOW |

## Decision signal

- Keep and stabilize current CMS/work foundation.
- Refactor around unified content governance (services/blog + SEO controls + redirects + lead capture).
- Defer growth-complex features until post-launch maturity.
