# Route and URL Strategy Review

Scope: public + admin + API route audit with SEO and URL risk lens.

Legend:
- Indexable: `Yes` / `No` / `Conditional`
- Route type: `Static` / `Dynamic`

## Route-level audit

| Route | Public/Admin/API | Route type | Indexable | Canonical source | Metadata source | Schema source | Slug risk | Redirect coverage | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Public | Static | Yes | Global default canonical (`/`) | `app/layout.tsx` + `app/page.tsx` | Global `Organization` + `WebSite` | None | N/A | Home is not CMS-driven |
| `/about` | Public | Static | Yes | Not explicitly set in page metadata | `app/about/page.tsx` | None page-specific | None | N/A | Should add explicit canonical |
| `/work` | Public | Static | Yes | Not explicitly set in page metadata | `app/work/page.tsx` | None page-specific | None | N/A | Listing data uses CMS published + legacy fallback |
| `/work/[slug]` | Public | Dynamic | Yes (published only) | `project.seo.canonical` fallback to `/work/{slug}` | `getProjectMetadataForRender` in `lib/cms/render-resolver.ts` | `CreativeWork` in route | High if slug changes | Missing auto 301 slug-history | Best implemented dynamic SEO route currently |
| `/services` | Public | Static | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Explicit `/services` | `app/services/page.tsx` | `ItemList` in route | None | N/A | If flag false, route still accessible but set noindex/nofollow |
| `/services/[slug]` | Public | Dynamic (`generateStaticParams`) | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC` and per-item noindex) | per service object canonical fallback `/services/{slug}` | `app/services/[slug]/page.tsx` + `lib/seo-content/services.ts` | `Service` in route | Medium (hardcoded content slug changes require code edit) | No redirect system | Content is local module, not CMS-managed |
| `/blog` | Public | Static | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Explicit `/blog` | `app/blog/page.tsx` | None | None | N/A | If flag false, route still accessible but noindex/nofollow |
| `/blog/[slug]` | Public | Dynamic (`generateStaticParams`) | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC` and per-post noindex) | per post canonical fallback `/blog/{slug}` | `app/blog/[slug]/page.tsx` + `lib/seo-content/blog.ts` | `BlogPosting` in route | Medium (hardcoded post slug changes require code edit) | No redirect system | Content is local module, not CMS-managed |
| `/contact` | Public | Static | Yes | Not explicitly set in page metadata | `app/contact/page.tsx` | None page-specific | None | N/A | Form has no backend submit flow |
| `/privacy-policy` | Public | Static | Yes | Explicit `/privacy-policy` | `app/privacy-policy/page.tsx` | None | None | Static redirects from `/privacy` | Privacy exists; cookies/terms missing |
| `/admin/login` | Admin | Static | No | N/A (admin layout noindex) | `app/admin/layout.tsx` | None | None | N/A | Whitelisted in proxy/auth |
| `/admin/projects` | Admin | Static | No | N/A | `app/admin/layout.tsx` | None | None | N/A | Protected by proxy + request auth |
| `/admin/projects/[id]` | Admin | Dynamic | No | N/A | `app/admin/layout.tsx` | None | ID route, not SEO slug | N/A | Protected by proxy + request auth |
| `/admin/projects/[id]/preview` | Admin | Dynamic | No | N/A | `app/admin/layout.tsx` | Uses renderer output; no page-level schema injection | ID route, not public | N/A | Draft preview only for admin |
| `/api/projects` | API (public) | Static endpoint | No | N/A | N/A | N/A | None | N/A | Published-only payload |
| `/api/projects/[slug]` | API (public) | Dynamic endpoint | No | N/A | N/A | N/A | If slug changed, old API URL breaks | No redirect layer for API slugs | Returns published only |
| `/api/admin/*` | API (admin) | Mixed | No | N/A | N/A | N/A | N/A | N/A | Protected by proxy + `assertAdminRequest` |
| `/robots.txt` | Public SEO endpoint | Static-generated | Yes | N/A | `app/robots.ts` | N/A | None | N/A | Disallows `/admin` and `/api/admin` |
| `/sitemap.xml` | Public SEO endpoint | Dynamic-generated | Yes | N/A | `app/sitemap.ts` | N/A | Work URLs depend on published slugs | No redirect manager if slug churns | Services/blog inclusion is feature-flag gated |

## Focus audit for requested routes

### `/work`
- Public, indexable.
- Metadata from `app/work/page.tsx`.
- No explicit canonical field in metadata.
- Data source: CMS published projects with legacy fallback via `getProjectsWithCmsFallback`.

### `/work/[slug]`
- Public, indexable only when project is published.
- Metadata source: CMS SEO fields in `render-resolver`.
- Canonical source: explicit per-project canonical fallback.
- Strongest SEO route currently.
- Risk: slug edits have no auto 301 support.

### `/services` and `/services/[slug]`
- Public routes exist.
- Indexing controlled by launch flag (`CMS_EXPANDED_CONTENT_PUBLIC`).
- Data source is static local module, not CMS repository.
- Risk: architecture diverges from requirement of one CMS-driven SEO/content system.

### `/blog` and `/blog/[slug]`
- Public routes exist.
- Indexing controlled by launch flag.
- Data source is static local module.
- Similar architecture risk as services.

### `/contact`
- Indexable static page with metadata.
- No form backend flow, no thank-you URL, no CRM mapping.

### `/about`
- Indexable static page.
- Has title/description metadata, no explicit canonical.

### `/privacy-policy`
- Indexable static page.
- Canonical explicitly set.

### `/admin/*`
- Non-indexed by admin layout metadata.
- Protected through proxy matcher + request-level auth checks.

### `/api/*`
- Non-indexed endpoints.
- Public API only exposes published projects.
- Admin API is protected.

## URL strategy risks

1. No redirect manager or slug history means published slug changes can orphan indexed URLs.
2. Services/blog slugs are code-level content values, not CMS lifecycle-managed.
3. Mixed content source strategy (`CMS + seed + legacy fallback`) can create inconsistent URL ownership until fallback is retired.
