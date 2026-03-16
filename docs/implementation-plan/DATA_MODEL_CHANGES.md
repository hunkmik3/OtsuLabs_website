# Data Model Changes

Goal: evolve current model with minimal breakage while meeting client SEO/CMS requirements.

## 0) Migration strategy baseline

- Keep existing `CmsProjectDocument` compatibility during transition.
- Introduce additive models first (new tables/fields), then progressively migrate route resolvers.
- Maintain backward-compatible mappers until services/blog/generic/legal are fully CMS-driven.

## 1) Shared SEO model

Proposed shared object: `SeoFields`.

| Field | Type | Applies to | Migration impact | Backward compatibility concern |
|---|---|---|---|---|
| `seoTitle` | `string` | all URL content types | New required field with fallback from existing title | For existing projects map from `seo.title` |
| `metaDescription` | `string` | all URL content types | New required field with fallback | Existing `seo.description` maps directly |
| `canonicalUrl` | `string?` | all URL content types | Additive | If empty, resolver must auto-generate canonical |
| `noindex` | `boolean` | all URL content types | Additive/default false | Existing project `seo.noindex` maps directly |
| `nofollow` | `boolean` | all URL content types | New field default false | Must ensure robots output now derives from both flags |
| `ogTitle` | `string?` | all URL content types | Additive | Fallback to `seoTitle` |
| `ogDescription` | `string?` | all URL content types | Additive | Fallback to `metaDescription` |
| `ogImage` | `MediaAsset?` | all URL content types | Additive | Existing project `seo.ogImage` maps directly |
| `includeInSitemap` | `boolean` | all URL content types | New field default true for published, false for admin/private | Must update sitemap resolver to honor this |
| `schemaType` | `enum` | all URL content types | New field with per-type default | Must provide migration default (`CreativeWork` for work, etc.) |

## 2) Shared slug/URL model

Proposed object: `UrlFields`.

| Field | Type | Applies to | Migration impact | Backward compatibility concern |
|---|---|---|---|---|
| `slug` | `string` | all slugged content types | Existing field for projects; new for other types | Keep current slug normalize/unique checks |
| `slugHistory` | `string[]` | all slugged content types | New field populated on slug change | Ensure no duplicate and no stale self-reference |
| `routeBase` | `string` | content type config | New config-driven field | Avoid hardcoding route pattern logic in each page |
| `fullPath` (derived) | computed | all URL content types | Runtime derived | Not persisted to avoid inconsistency |

## 3) Redirect entity

New persistence entity: `redirects`.

| Field | Type | Applies to | Migration impact | Backward compatibility concern |
|---|---|---|---|---|
| `id` | `string` | redirect entity | New table/collection | None |
| `fromPath` | `string` | redirect entity | Required | Must be unique when active |
| `toPath` | `string` | redirect entity | Required | Validate to prevent loops |
| `statusCode` | `301 | 302` | redirect entity | Required | Default 301 for slug-history redirects |
| `isActive` | `boolean` | redirect entity | Required | Inactive records should not resolve |
| `sourceType` | `manual | slug-history | import` | redirect entity | Additive metadata | Useful for governance/reporting |
| `contentType` | `string?` | redirect entity | Optional relation | Helpful for cleanup when content removed |
| `contentId` | `string?` | redirect entity | Optional relation | Enables auto-maintenance |
| `createdAt/updatedAt` | `ISO string` | redirect entity | Required | Standard auditability |

## 4) Schema config model

Can be inline in SEO or separate per content type settings.

| Field | Type | Applies to | Migration impact | Backward compatibility concern |
|---|---|---|---|---|
| `schemaType` | `enum` | all URL content types | New required with defaults | Must not break existing hardcoded schema output |
| `schemaOverrides` | `Record<string, unknown>?` | advanced content | Additive optional | Validate keys to avoid malformed JSON-LD |
| `schemaEnabled` | `boolean` | all URL content types | Additive default true | Keep global schema in layout intact |

## 5) Sitemap/indexing controls

| Field | Type | Applies to | Migration impact | Backward compatibility concern |
|---|---|---|---|---|
| `includeInSitemap` | `boolean` | all URL content types | Additive | Existing sitemap behavior changes when false |
| `priority` | `number?` | optional per content | Additive | Validate bounds (0.0-1.0) |
| `changeFrequency` | enum? | optional per content | Additive | Keep defaults if unset |

## 6) Content entities needed

### A) `workProject` (existing -> extend)

- Keep existing section model and project document structure.
- Add/normalize shared `seo` fields to align with `SeoFields` naming.
- Add `slugHistory`.

### B) `servicePage` (new CMS entity)

Minimum fields:
- `id`, `status`, `order`, `slug`, `slugHistory`
- `title`, `heroIntro`, `serviceDefinition`
- `useCases[]`, `process[]`, `deliverables[]`, `whyChooseUs[]`
- `relatedWorkIds[]`, `relatedBlogIds[]`
- `cta`
- `seo`

Migration source: `lib/seo-content/services.ts` seed import.

### C) `blogArticle` (new CMS entity)

Minimum fields:
- `id`, `status`, `publishedAt`, `updatedAt`, `slug`, `slugHistory`
- `title`, `excerpt`, `intro`, `sections[]`
- `relatedServiceIds[]`, `relatedWorkIds[]`
- `cta`
- `seo`

Migration source: `lib/seo-content/blog.ts` seed import.

### D) `genericPage` (new CMS entity)

For `/about` variations, campaign landing pages, and future static-like pages.

Minimum fields:
- `id`, `status`, `slug`, `slugHistory`
- `title`, `pageBlocks[]`
- `seo`

### E) `legalPage` (new CMS entity)

Minimum fields:
- `id`, `status`, `slug` (fixed), `title`, `body`, `effectiveDate`
- `seo` (usually indexable true, possibly noindex depending policy)

## 7) Optional future entities

| Entity | Why | Migration impact | Compatibility concern |
|---|---|---|---|
| `taxonomy` (`category`, `tag`, `cluster`) | internal linking, filtered hubs | Medium | Must avoid overfitting before content scale |
| `revisions` | rollback + audit trail | Medium/High | Storage growth, UI complexity |
| `users` + `roles` | RBAC and approvals | High | Requires replacing token-only auth model |
| `leadSubmission` | CRM mapping + attribution | Medium | Must include consent and data retention policy |

## 8) Backward compatibility notes

1. Keep existing project routes and mappers functional while adding new content entities.
2. Provide migration adapters from old `seo` field names if renamed.
3. Do not remove local service/blog modules until CMS entities + resolvers are production-ready.
4. Keep fallback chain isolated and removable via one feature switch once migration completes.
