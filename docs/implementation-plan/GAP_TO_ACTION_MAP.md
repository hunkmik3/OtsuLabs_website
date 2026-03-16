# Gap-to-Action Mapping

Source of truth: `REQUIREMENT_MATCH_MATRIX.md`, `SEO_GAP_REVIEW.md`, `ROUTE_URL_STRATEGY_REVIEW.md`.

Legend:
- Priority: `P0` (urgent), `P1`, `P2`
- Launch blocker: `Yes` = should be solved before confident launch; `No` = can launch with caveat

| Gap | Current state | Target state | Implementation action | Priority | Launch blocker? | Depends on |
|---|---|---|---|---|---|---|
| Unified SEO layer across all URL content types | SEO panel mainly on `workProject`; services/blog static modules | One shared SEO model + shared resolver for all URL pages | Introduce shared `SeoFields`, migrate route metadata mapping to common helper | P0 | Yes | Data model update + content resolver refactor |
| Redirect manager missing | Static redirects only in `next.config.ts` | CMS-managed redirect registry | Add redirect entity + admin API/UI for redirects | P0 | Yes | URL/slug model extension |
| Slug history + auto 301 missing | Slug editable but no history tracking | Slug changes auto-generate 301 redirects | On slug PATCH, store old slug in history and create redirect record | P0 | Yes | Redirect entity + update service logic |
| Services/blog not CMS-driven | Runtime uses `lib/seo-content/services.ts` and `blog.ts` | Services/blog as first-class CMS content types | Build service/blog entities + migration seed + new resolvers | P0 | No (if gated) / Yes (if public) | Shared SEO model + content type abstraction |
| Contact submit backend missing | `/contact` is form UI only | End-to-end lead capture | Add `/api/contact` with server validation and secure submit handling | P0 | Yes (for conversion-focused launch) | Lead data model decision |
| Thank-you flow missing | No dedicated confirmation route | Submit -> thank-you route with clear UX | Add `/contact/thank-you` page and form redirect logic | P0 | Yes | Contact submit API |
| UTM/referrer capture missing | No UTM storage/tracking | Store first-touch + last-touch attribution per lead | Add hidden fields/session capture and persist with submission | P1 | No | Contact backend |
| Legal pages incomplete | Privacy exists; cookies/terms missing | Full minimal legal set | Add `cookies-policy` and `terms` pages/content | P0 | Yes | Legal content source choice |
| Per-page sitemap control missing | Sitemap route-level only | Fine-grained include/exclude control | Add `includeInSitemap` field and apply in sitemap resolver | P1 | No | Shared SEO model |
| follow/nofollow control missing | Only noindex used | Independent robots control | Add `nofollow` in SEO model + metadata mapping | P1 | No | Shared SEO model |
| Snippet preview missing | No SERP preview in editor | SEO panel provides snippet preview | Build reusable snippet preview component in SEO panel | P2 | No | Shared SEO panel |
| Schema selector missing | JSON-LD hardcoded by route | Per-content schema type mapping | Add `schemaType` field + schema factory | P1 | No | Shared SEO model |
| SEO panel not shared for all content types | Only work project editor has robust panel | Shared SEO panel component in all editors | Create reusable `SeoPanel` and wire into service/blog/page editors | P1 | No | Unified content system |
| Work listing/detail fallback complexity | CMS + seed + legacy fallback chain | Single source of truth from CMS in steady-state | Keep fallback gated; plan fallback retirement toggle and sunset criteria | P1 | No | CMS data completeness migration |
| Canonical coverage incomplete on core static pages | About/work/contact rely on defaults | Explicit canonical per indexable page | Add canonical in metadata for static core routes | P0 | Yes (SEO quality) | None |
| Robots/sitemap not CMS editable | Code-driven only | Optional CMS overrides/policy controls | Add config-based override model (phase-later) | P2 | No | SEO governance phase |
| Internal linking governance weak | Links exist but mostly static/manual | Relation-driven internal links from CMS | Add relation fields and editor linking helper for all content types | P1 | No | Unified content entities |
| CTA tracking missing | CTA buttons mostly visual | Event-tracked conversion path | Add analytics wrapper and trigger events on CTA/form milestones | P1 | No | Tracking stack selection |
| CRM mapping missing | No submit-to-CRM integration | Field-mapped lead routing | Add CRM adapter (webhook/CRM API) and deterministic field mapping | P1 | No | Contact backend + consent decision |
| Consent logging missing | No consent capture | GDPR-ready consent timestamp/source | Add consent checkbox + persistence with lead record | P1 | No (unless legal requirement strict) | Contact backend + legal policy |
| Editorial review workflow missing | Draft/publish only | Draft -> review -> publish with permissions | Add status enum + role checks for publish action | P2 | No | Auth/user model upgrade |
| RBAC missing | Single admin token session | Multi-user role model | Add user accounts + permissions matrix | P2 | No | Auth system redesign |
| Revision history missing | No rollback snapshots | Revision snapshots and restore | Add revisions table + snapshot on save/publish | P2 | No | Storage budget and editor UX |

## Priority interpretation

- `P0`: launch-alignment work that closes core SEO + conversion + URL governance risks.
- `P1`: high-value architecture improvements that can follow immediately after launch-safe milestone.
- `P2`: governance and advanced editor capabilities for scale.
