# OLD_SITE_SEO_GAPS

## Summary
The old public site has strong visual branding but limited indexable SEO architecture. Key issues reduce discoverability for service-intent and non-branded queries.

## 1) Information architecture gaps
- No dedicated service hub/pages (e.g., anime animation service pages).
- No blog/insights content area for long-tail search growth.
- Portfolio pages exist, but taxonomy is shallow and mostly project-only.
- Contact URL inconsistency: `/contacts` is live, `/contact` returns 404.

## 2) Metadata gaps
- Canonical appears fixed to homepage (`https://www.otsulabs.com/`) across many URLs, including project pages.
- Meta descriptions are repeated on core pages (`Animation production studio`).
- Homepage/title coverage is acceptable, but inner-page metadata uniqueness is weak.
- Some pages do not reliably emit a page-specific `<title>` in crawl HTML (notably `/projects`).

## 3) Structured data gaps
- No `application/ld+json` structured data found on crawled pages.
- Missing high-value schema types:
  - `Organization`
  - `WebSite`
  - `Service`
  - `CreativeWork`/`VideoObject` for portfolio pages
  - `BreadcrumbList`
  - `FAQPage` (if FAQ exists)

## 4) Technical SEO gaps
- No valid sitemap at `/sitemap.xml`.
- Robots exists but does not declare sitemap.
- Heading hierarchy is difficult to parse due animation-heavy markup (potentially weaker semantic clarity).
- Possible over-reliance on visual text rendering with less semantic copy depth.

## 5) Content strategy gaps
- No discoverable blog/resource section.
- Missing educational/comparison content for buyer-intent and long-tail keywords.
- Limited landing pages for client segments (games/startups/brands).

## 6) Internal link opportunity gaps
- Internal links are mostly global nav + projects list.
- Limited contextual links between project pages and thematic/service pages.
- No topic cluster structure linking services ↔ case studies ↔ educational content.

## Priority opportunities (new site should implement)
1. Build service architecture (`/services/*`) with dedicated search-intent pages.
2. Add blog/content hub (`/blog/*`) and tie each article to relevant service/project.
3. Fix canonical per-URL and generate valid sitemap + robots sitemap declaration.
4. Add structured data on all major templates.
5. Expand internal linking from portfolio to service and blog clusters.
6. Standardize URL policy (`/contact` vs `/contacts`) and 301 redirect legacy mismatch.
