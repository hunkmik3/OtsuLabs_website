# SEO-Specific Gap Review

Scope: audit against requested SEO controls for client-level CMS operations.

Legend: `DONE` / `PARTIAL` / `MISSING` / `WRONG-DIRECTION`

| # | SEO Requirement Check | Status | Current state in code | Related files/modules | Gap and impact | Recommendation |
|---|---|---|---|---|---|---|
| 1 | SEO layer hien tai co phai layer chung chua? | PARTIAL | Shared helpers exist for metadata URL building, robots, sitemap, and project SEO | `lib/seo/site.ts`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/cms/render-resolver.ts` | SEO is unified only for part of the site; services/blog are separate local modules, core static pages not CMS-driven | Create a single SEO abstraction consumed by all content types in CMS |
| 2 | Content editor va SEO panel da tach biet chua? | PARTIAL | Project editor has separate SEO fields (`seoTitle`, `seoDescription`, `canonical`, `noindex`) | `components/admin/AdminProjectEditor.tsx`, `lib/cms/types.ts` | Separation exists only for work projects; not for services/blog/about/contact/home in CMS | Extend same editor pattern to all URL content types |
| 3 | Meta title/description co tach khoi title hien thi chua? | DONE | Display title in `basicInfo.title`; SEO title/description in `seo` object | `lib/cms/types.ts`, `lib/cms/project-service.ts`, `render-resolver.ts` | None for work projects | Keep, and standardize to other content models |
| 4 | Slug change co auto 301 chua? | MISSING | Slug updates are allowed but no redirect history | `lib/cms/project-service.ts`, `lib/cms/validator.ts` | Existing indexed URLs may 404 after slug change | Add redirect table + automatic 301 on slug updates |
| 5 | Redirect manager toan site da co chua? | MISSING | Only static redirects in Next config (`/contacts`, `/privacy`) | `next.config.ts` | SEO and operations cannot manage redirects without code deploy | Build CMS redirect manager API + admin UI |
| 6 | Robots.txt co editable trong CMS chua? | MISSING | Robots is code-defined route | `app/robots.ts` | Non-dev editors cannot adjust crawl policy quickly | Add optional CMS overrides or policy config table |
| 7 | Per-page sitemap toggle da co chua? | MISSING | Sitemap includes route groups but no per-document include toggle | `app/sitemap.ts`, project model in `lib/cms/types.ts` | Cannot exclude specific pages from sitemap while keeping indexable settings elsewhere | Add `includeInSitemap` to SEO model |
| 8 | Index/noindex + follow/nofollow da co chua? | PARTIAL | `noindex` available for projects and service/blog model; follow implicitly mirrors index; no explicit nofollow field | `lib/cms/types.ts`, `render-resolver.ts`, `app/services/*`, `app/blog/*` | Missing explicit follow/nofollow policy control | Extend SEO fields with `nofollow` and apply in metadata |
| 9 | OG override da co chua? | PARTIAL | OG image supported for project SEO and static service/blog objects | `render-resolver.ts`, `app/services/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` | Not CMS-manageable for all content types | Add centralized SEO media picker for every URL page type |
| 10 | Google snippet preview da co chua? | MISSING | No SERP snippet UI in admin | `components/admin/*` | Editors cannot pre-check SERP presentation | Add snippet preview component in SEO panel |
| 11 | Schema type dropdown + auto JSON-LD mapping da co chua? | MISSING | JSON-LD is hardcoded per route type | `app/layout.tsx`, `app/work/[slug]/page.tsx`, `app/services/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` | No editor-level schema control or schema templates | Add schema config model and controlled dropdown |
| 12 | H1 policy co duoc enforce chua? | MISSING | Pages mostly have one H1 by convention, but no lint/rule enforcement | `app/*`, `components/*` | Risk of future H1 inconsistency when pages grow | Add SEO lint rules/tests for heading policy |
| 13 | Internal links default dofollow chua? | DONE | Standard links without `nofollow` overrides | `app/*`, `components/*` | No governance layer, but default behavior is okay | Add occasional crawl checks to prevent accidental nofollow |
| 14 | Image alt text flow co bat buoc trong editor chua? | PARTIAL | CMS validator requires alt for CMS media assets | `lib/cms/validator.ts`, `MediaInputField.tsx` | Static site images outside CMS are not enforced by policy | Add lint/checklist for non-CMS image alt coverage |
| 15 | Content types moi (services/blog/page) co dung chung SEO logic hay hard-code rieng? | WRONG-DIRECTION | Services/blog SEO data is hardcoded in local modules, not in CMS content model | `lib/seo-content/services.ts`, `lib/seo-content/blog.ts`, `app/services/*`, `app/blog/*` | Breaks requirement that SEO should be field-driven from same CMS system | Migrate services/blog/page SEO into shared CMS content model |

## Overall SEO gap signal

- Strong now: technical foundation (`metadataBase`, robots, sitemap, canonical support, JSON-LD on major routes).
- Biggest mismatch to client SEO spec: SEO governance is not yet unified across all content types and lacks redirect/schema/snippet tooling in CMS.
