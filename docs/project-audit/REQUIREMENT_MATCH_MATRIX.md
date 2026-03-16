# Requirement Match Matrix

Audit basis: repository code as of 2026-03-14 (no assumption about external systems not visible in repo).

Status legend:
- `DONE`: implemented and usable in current code
- `PARTIAL`: implemented but incomplete for stated requirement
- `MISSING`: no implementation found
- `WRONG-DIRECTION`: implementation exists but architecture deviates from requirement intent

## 1) Main Content Editor (WYSIWYG)

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Main content editor for project pages | PARTIAL | Structured form editor for section-based project editing | `components/admin/AdminProjectEditor.tsx`, `components/admin/editor/ProjectSectionsEditor.tsx`, `components/admin/sections/SectionEditorFactory.tsx` | Not true WYSIWYG canvas editing; form-based controls only | Add visual block editor mode or side-by-side inline editing on preview surface |
| Section reorder and enable/disable | DONE | Move up/down and section enabled toggle | `components/admin/editor/ProjectSectionsEditor.tsx`, `components/admin/SectionCard.tsx` | No drag-drop interaction | Optional: add drag-drop later if editor usability needs it |
| Repeater editing (scenes, credit items, etc.) | DONE | Repeater field with add/remove/reorder up/down | `components/admin/RepeaterField.tsx`, `components/admin/sections/SectionEditorFactory.tsx` | UX is functional but still operator-heavy for large content sets | Add bulk paste/import and grouped templates per repeater type |
| Live preview from draft | DONE | Preview iframe route uses same renderer as production | `app/admin/projects/[id]/preview/page.tsx`, `components/work/project/ProjectDetailRenderer.tsx`, `lib/cms/render-resolver.ts` | Refresh is manual/auto-save dependent | Add hot refresh signal or websocket preview refresh (optional) |
| Edit all visible page blocks from CMS | PARTIAL | Most `work/[slug]` sections are editable | `lib/cms/types.ts`, `SectionEditorFactory.tsx`, `project-detail-mapper.ts` | Credits intentionally fixed globally and removed from editor | Keep fixed if business-approved; otherwise move credits back into editable section contract |

## 2) SEO Panel chung cho moi content type co URL

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Shared SEO panel for URL-bearing content | PARTIAL | Work project has SEO panel fields in admin editor | `components/admin/AdminProjectEditor.tsx`, `lib/cms/types.ts` (`ProjectSeoMeta`) | Services/blog/about/contact/home not managed through same CMS panel | Introduce unified SEO panel component for all CMS content types |
| SEO fields separate from display content | DONE | `seo.title`, `seo.description`, `seo.canonical`, `seo.noindex`, `seo.ogImage` separated from basic info | `lib/cms/types.ts`, `lib/cms/project-service.ts` | Only guaranteed for CMS project docs | Extend same shape to services/blog/page types under CMS |
| OG/Twitter override support per content | PARTIAL | Work supports OG image via project SEO; services/blog via local modules | `lib/cms/render-resolver.ts`, `app/services/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` | Not centrally managed from admin for all types | Normalize in one SEO model + editor |
| Snippet preview in editor | MISSING | No Google snippet preview component found | N/A | Editors cannot preview SERP snippet before publish | Add computed snippet preview in SEO panel |

## 3) URL / Slug / Redirect manager

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Editable slug with uniqueness validation | DONE | Slug normalize + conflict checks + 409 API responses | `lib/cms/project-service.ts`, `lib/cms/validator.ts` | None for project type | Keep current behavior |
| Slug change preserves SEO (auto 301) | MISSING | Slug can be changed but no slug-history redirect persistence | No slug history module; only static redirects in `next.config.ts` | Existing links can break after slug edits | Add redirect table + auto-insert 301 when slug changes |
| Redirect manager (site-wide) | MISSING | Only two static hardcoded redirects | `next.config.ts` | No editor-driven redirects | Build redirect model and admin tool |

## 4) Robots / Sitemap / Canonical

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| robots.txt available | DONE | Generated robots route with admin disallow | `app/robots.ts` | Not CMS-editable | Add optional CMS-managed robots overrides |
| sitemap.xml available | DONE | Dynamic sitemap includes static pages + work slugs + conditional services/blog details | `app/sitemap.ts` | No per-page toggle field; service/blog index routes not listed | Add includeInSitemap field per content and include index pages when public |
| Per-page canonical | PARTIAL | Canonical on work details and privacy/services/blog routes | `lib/cms/render-resolver.ts`, `app/privacy-policy/page.tsx`, `app/services/*`, `app/blog/*` | About/contact/work index/home mostly rely on default metadataBase behavior | Add explicit canonical on all indexable pages |
| Index/noindex + follow/nofollow controls | PARTIAL | Work supports `seo.noindex`; services/blog controlled by launch flag + optional `noindex` in local objects | `render-resolver.ts`, `lib/seo-content/*`, `app/services/*`, `app/blog/*` | No general `nofollow` control; not unified across all types | Extend SEO model with `nofollow` and apply universally |

## 5) Schema mapping system

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Site-level schema | DONE | Organization + WebSite JSON-LD in layout | `app/layout.tsx` | None | Keep |
| Per-content schema generation | PARTIAL | Work detail (`CreativeWork`), service detail (`Service`), blog detail (`BlogPosting`) | `app/work/[slug]/page.tsx`, `app/services/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` | No schema controls in CMS editor; mapping is code-driven | Add schema type selector + field mapping in CMS model |
| Schema editor/dropdown in CMS | MISSING | No schema panel in admin | N/A | Cannot control schema from content operations | Add schema config in SEO panel per content type |

## 6) Internal linking

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Cross-link services, work, blog | PARTIAL | Service/blog pages link related work and each other; work detail links related services (feature-flag) | `app/services/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `components/work/project/RelatedServicesLinks.tsx`, `lib/seo-content/services.ts` | Not centrally governed; based on static arrays for services/blog | Move relation mapping into CMS-managed relation fields |
| Internal links default dofollow | DONE | Standard Next.js links, no rel=nofollow defaults | `app/*`, `components/*` | No policy enforcement layer | Optional lint/check rule for accidental nofollow |
| Internal linking suggestions in editor | MISSING | No suggestion tool | N/A | Editors must manage links manually | Add relation helper UI in CMS editor |

## 7) Page speed / technical SEO

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Technical SEO baseline | PARTIAL | Metadata, sitemap, robots, JSON-LD, App Router SSR exist | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` | Performance budget and monitoring not codified | Add Lighthouse CI budget checks in pipeline |
| Media optimization pipeline (WebP/AVIF/resizing) | PARTIAL | Accepts modern formats and validates upload type/size | `lib/cms/media-storage.ts`, `components/admin/fields/MediaInputField.tsx` | No automatic resizing/transcoding/CDN variants | Add media processing step (derive optimized variants + dimensions) |
| Image component best practice site-wide | PARTIAL | Some places use `next/image`, many still use `<img>` | `components/Header.tsx` vs multiple page components | Many heavy images bypass Next image optimization | Prioritize critical page migration to optimized image components |

## 8) CTA / forms / thank-you pages

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Consistent high-intent CTAs | PARTIAL | Mailto CTA in header/footer and several visual CTA buttons | `components/Header.tsx`, `components/FooterSection.tsx`, `app/*` | CTA definitions are not centrally managed/tracked | Create CTA config model and shared CTA component |
| Contact form submission flow | MISSING | UI form exists only; no submit backend | `app/contact/page.tsx` | No lead persistence/notification/CRM handoff | Implement `/api/contact` with validation + secure handling |
| Thank-you page after submission | MISSING | No dedicated confirmation route | N/A | Missing conversion end state and user guidance | Add `/contact/thank-you` and form redirect |
| Tracking for CTA/form events | MISSING | No GTM/GA/dataLayer hooks found | No tracking modules found | Cannot measure conversion performance | Add analytics event wrapper + key event instrumentation |
| Multi-step qualification form | MISSING | Single static form only (and not wired) | `app/contact/page.tsx` | No qualification logic | Add optional multi-step form if required by sales process |
| Click-to-WhatsApp / messenger | MISSING | Not implemented | N/A | Missing preferred instant contact channel | Add controlled click-to-WhatsApp CTA if requirement confirmed |

## 9) Service pages / proof pages / blog / legal pages

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Proof pages (projects/case studies) | DONE | Work index + detail + publish state | `app/work/page.tsx`, `app/work/[slug]/page.tsx`, CMS modules | Fallback legacy path still present | Decommission legacy fallback once CMS dataset complete |
| Dedicated service pages | PARTIAL | `/services` and `/services/[slug]` built | `app/services/*`, `lib/seo-content/services.ts` | Local hardcoded model; not CMS-editable; launch gated | Keep gated for now or migrate service content to CMS before full launch |
| Blog/insights pages | PARTIAL | `/blog` and `/blog/[slug]` built | `app/blog/*`, `lib/seo-content/blog.ts` | Local hardcoded model; not CMS-editable; launch gated | Keep gated/noindex until editorial ops ready |
| Legal pages: privacy/cookies/terms | PARTIAL | Privacy page exists | `app/privacy-policy/page.tsx` | Cookies and terms pages missing | Add `/cookies-policy` and `/terms` pages before strict compliance launch |

## 10) Workflow / permissions / editorial review

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Admin login + protected admin routes | DONE | Token login + signed cookie + proxy guard + route assertions | `proxy.ts`, `lib/cms/auth.ts`, `lib/cms/admin-session.ts`, `lib/cms/admin-auth.ts` | Single shared token model | Keep for small team, plan user-based auth later |
| Draft/publish workflow | DONE | Draft and published statuses, public exposure only when published | `lib/cms/project-service.ts`, `render-resolver.ts`, API routes | No scheduled publish | Add optional scheduling only if needed |
| Editorial review workflow (draft->review->publish) | MISSING | No review state or role approvals | N/A | Accidental publish risk in multi-editor scenarios | Add review status and approval step |
| Role-based permissions | MISSING | Single admin token | N/A | No permission granularity or auditability | Add RBAC when moving beyond small trusted team |
| Version history / rollback | MISSING | No revision model | N/A | Hard to recover from content mistakes | Add revision snapshots per save/publish |

## 11) Taxonomy / categories / tags

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| SEO taxonomy system (category/tag clusters) | MISSING | No category/tag model for services/blog/work | `lib/seo-content/*` has keyword fields only | Cannot scale cluster-based internal linking/filtering | Add taxonomy entities and relation fields |
| Filtered resource hub by topic | MISSING | No faceted/filter page type | N/A | Cannot support topic-cluster navigation at scale | Add once content inventory grows |

## 12) Media pipeline / alt text / image naming

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Media object model (src/alt/type/size/poster) | DONE | Strong media type in CMS model | `lib/cms/types.ts` | None for project documents | Keep |
| Alt text required in CMS content | DONE | Validator requires `media.alt` non-empty | `lib/cms/validator.ts` | Not enforced for every non-CMS static image | Add lint/content checks for static pages |
| Safe filename handling | DONE | Sanitized names + unique suffixes | `lib/cms/media-storage.ts` | No naming policy in editor UI | Optional: enforce naming convention helper |
| Media optimization pipeline | PARTIAL | Upload validation exists; no transform pipeline | `media-storage.ts` | No auto resize/transcode/derivative management | Add optimization worker/service |

## 13) Security / backups / login hardening

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Login hardening basics | PARTIAL | Signed cookie session, httpOnly, secure/sameSite env, proxy protection | `auth.ts`, `admin-session.ts`, login/logout routes, `proxy.ts`, `config.ts` | No rate limiting, no account lockout, no per-user credentials | Add edge rate limit for `/api/admin/auth/login` and optional IP throttling |
| Backup/restore scripts for DB/media | PARTIAL | DB backup/restore scripts exist; media backup/restore local-mode only | `scripts/cms/backup-db.ts`, `restore-db.ts`, `backup-media.ts`, `restore-media.ts` | No automated schedule; S3/R2 backup relies on provider-native process | Document and automate provider backups + periodic restore test |
| WAF/rate limiting | MISSING | Not implemented in code | N/A | Increased brute-force/API abuse risk | Configure Vercel/Cloudflare protections |

## 14) Localization / hreflang / URL strategy

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| Multi-language URL strategy | MISSING | Single-language routes only | `app/*` | No locale path strategy | Define locale routing strategy before multilingual rollout |
| hreflang tags | MISSING | No hreflang metadata output | N/A | International SEO unsupported | Add hreflang when locale variants exist |
| Translation workflow | MISSING | No translator/reviewer workflow | N/A | No governance for translated content | Add translation workflow in CMS phase |

## 15) CRM / UTM / consent / lead routing

| Requirement | Status | Current implementation | Related files/modules | Gap / why not enough | Recommended next step |
|---|---|---|---|---|---|
| CRM field mapping from forms | MISSING | No contact submit backend/CRM integration | `app/contact/page.tsx` only UI | Leads are not captured to CRM | Build contact API + CRM mapping contract |
| UTM + referrer capture | MISSING | No UTM/referrer persistence flow found | N/A | Cannot attribute lead source | Capture first-touch/last-touch params in form submit payload |
| Consent logging | MISSING | No consent capture/logging pipeline | N/A | Compliance and audit gaps | Add consent checkbox + timestamp + source storage |
| Lead routing rules / SLA alerts | MISSING | No lead routing automation | N/A | No ops automation for high intent leads | Integrate notification routing (email/Slack/CRM queue) |

## Summary signal

- Strongest areas today: CMS project pipeline for `/work/[slug]`, repository abstraction, admin protection, technical metadata baseline.
- Largest gaps vs full client requirement: shared SEO/CMS across all content types, redirect manager, lead capture stack, compliance breadth, taxonomy/editorial governance.
