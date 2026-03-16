# Content Type Map

Legend:
- `Yes` = implemented
- `No` = not implemented
- `Partial` = conditional or only for subset

| Content/Page Type | Route Pattern | Data Source | CMS Editable | SEO Fields (own) | JSON-LD Schema | Slug | Publish State | Included in Sitemap | Canonical | Internal Linking |
|---|---|---|---|---|---|---|---|---|---|---|
| Homepage | `/` | Hard-coded components | No | Partial (page metadata only) | Yes (global `Organization` + `WebSite` via layout) | No | No | Yes | Default root canonical via layout metadata | Partial (to about/work/contact only) |
| About page | `/about` | Hard-coded section components | No | Partial (title/description only) | No page-specific schema found | No | No | Yes | No explicit canonical in page metadata | Partial |
| Contact page | `/contact` | Hard-coded form + FAQ | No | Partial (title/description only) | No page-specific schema found | No | No | Yes | No explicit canonical in page metadata | Partial |
| Privacy Policy | `/privacy-policy` | Static page | No | Yes (title/description/canonical) | No | No | No | Yes | Yes | Minimal |
| Work index | `/work` | CMS published projects with legacy fallback (`getProjectsWithCmsFallback`) | Partial (list derives from CMS projects, page structure not editable) | Partial (title/description only) | No page-specific schema found | No | Partial (projects inside have status) | Yes | No explicit canonical in page metadata | Yes (to `/work/[slug]`) |
| Work detail | `/work/[slug]` | CMS render resolver (`getProjectBySlugForRender`) with seed/legacy fallback chain | Yes (project document sections) | Yes (`ProjectSeoMeta`) | Yes (`CreativeWork`) | Yes | Yes (`draft/published`) | Yes (published slugs only) | Yes (from project SEO canonical or generated) | Yes (more projects; related services conditional) |
| Services index | `/services` | Static local content module (`lib/seo-content/services.ts`) | No (not in admin CMS) | Yes (route metadata) | Yes (`ItemList`) | No | No | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Yes | Yes (to service details) |
| Service detail | `/services/[slug]` | Static local content module | No | Yes (per service object fields) | Yes (`Service`) | Yes | No | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Yes | Yes (to work/blog/contact) |
| Blog index | `/blog` | Static local blog module (`lib/seo-content/blog.ts`) | No | Yes (route metadata) | No index schema found | No | No | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Yes | Yes (to blog detail) |
| Blog detail | `/blog/[slug]` | Static local blog module | No | Yes (per post object fields) | Yes (`BlogPosting`) | Yes | No | Conditional (`CMS_EXPANDED_CONTENT_PUBLIC`) | Yes | Yes (to services/work/contact) |
| Admin login | `/admin/login` | Client form + auth API | No | Noindex inherited from admin layout | No | No | No | No | N/A | No |
| Admin projects list | `/admin/projects` | Admin API (`/api/admin/projects`) | N/A (editor UI) | Noindex inherited from admin layout | No | No | N/A | No | N/A | Yes (to project edit) |
| Admin project editor | `/admin/projects/[id]` | Admin API + editor state | Yes (project CMS) | Noindex inherited from admin layout | No | By project id route | Edits draft/published | No | N/A | Yes (preview/production links in editor) |
| Admin draft preview | `/admin/projects/[id]/preview` | Same renderer as work detail + preview resolver | Indirect (reflects editor state) | Noindex inherited from admin layout | Uses same section renderer; page-level schema not injected here | Id-based route | Includes draft in preview context | No | N/A | Same as detail renderer |
| Public projects API list | `/api/projects` | `listPublicProjects` service -> repository | N/A | N/A | N/A | N/A | Published only | No | N/A | N/A |
| Public project API detail | `/api/projects/[slug]` | `getPublicProjectBySlug` | N/A | N/A | N/A | Slug | Published only | No | N/A | N/A |
| Admin projects API | `/api/admin/projects*` | Service layer + repository | N/A | N/A | N/A | id/slug operations | Draft + Published | No | N/A | N/A |
| CMS project document (domain model) | Not a route (stored entity) | Repository (`file` or `postgres`) | Yes | Yes (`seo` object) | Indirect via render layer | Yes | Yes | Impacts sitemap via published docs | Yes support | Indirect via section content |

## Notes

1. Services/blog content exists but is not managed by the admin CMS editor currently.
   - Files: `lib/seo-content/services.ts`, `lib/seo-content/blog.ts`
2. Work detail is the only full CMS-driven public content type with draft/publish semantics and per-document SEO fields.
3. Work listing has a fallback chain to legacy hard-coded project data if CMS source is empty/unavailable.
   - Files: `lib/cms/fallback.ts`, `lib/projects.ts`
4. Sitemap inclusion for services/blog is feature-flagged.
   - File: `app/sitemap.ts`, `lib/seo-content/launch.ts`
