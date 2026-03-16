# SEO_SITE_ARCHITECTURE

## Goal
Build a search architecture for the new Otsu Labs CMS website that outperforms old-site SEO while preserving portfolio-first UX.

Business context used:
- Studio type: anime-style animation studio
- Client segments: games, startups, brands
- Core services: product animation, game trailers, anime commercials

---

## 1) Recommended SEO site architecture

### Core pages
- `/` Home
- `/about`
- `/work`
- `/work/[slug]`
- `/contact`

### Service cluster
- `/services`
- `/services/anime-animation`
- `/services/game-trailer-animation`
- `/services/product-animation`
- `/services/anime-commercials`
- `/services/post-production-compositing`

### Audience/industry landing pages (optional but high value)
- `/industries`
- `/industries/gaming`
- `/industries/startups`
- `/industries/brands`

### Content / topical authority
- `/blog`
- `/blog/[slug]`
- `/resources` (optional)

### Trust/utility
- `/privacy`
- `/terms` (optional)
- `/sitemap.xml`
- `/robots.txt`

### URL conventions
- lowercase slugs only
- hyphen-separated words
- one canonical URL per page
- avoid duplicate route variants (`/contact` and `/contacts`); keep one + 301 redirect for the other

---

## 2) Template mapping (CMS-driven)

### A. Service page template
- H1: service keyword + value proposition
- Intro copy (problem → solution)
- Process section
- Deliverables section
- CTA section
- Related work cards
- FAQ (optional)
- Schema: `Service`, `FAQPage` (if present), `BreadcrumbList`

### B. Work detail template (`/work/[slug]`)
- Hero media + title + context
- About project
- Pre-production / production / highlights
- Fixed credits section
- Related projects
- Schema: `CreativeWork` (+ `VideoObject` when video is primary)

### C. Blog article template
- H1 + summary
- Table of contents (optional)
- Main body with subheadings
- Related services
- Related projects
- Schema: `BlogPosting`, `BreadcrumbList`

---

## 3) CMS SEO fields (project model)

Use these fields in each CMS project (already aligned with current model naming):
- `seo.title` (aka seoTitle)
- `seo.description` (aka seoDescription)
- `seo.ogImage` (aka seoImage)
- `seo.canonical`
- `seo.noindex`

Recommended additional cross-content fields:
- `seo.keywords` (optional editorial helper)
- `seo.twitterCard` (default `summary_large_image`)
- `seo.robotsOverrides` (advanced)

Field rules:
- title: 50–60 chars target
- description: 140–160 chars target
- canonical: absolute URL only
- noindex default `false` for published pages
- ogImage: minimum 1200x630, stable public URL

---

## 4) Keyword strategy

### Studio keywords (brand + category)
- anime animation studio
- anime style animation studio
- 2D animation studio
- animation studio for brands
- animation studio for games

### Service keywords (commercial intent)
- game trailer animation studio
- product animation studio
- anime commercial production
- animated ad production studio
- anime teaser trailer production
- post-production compositing studio

### Buyer-intent long-tail keywords
- hire anime animation studio for game trailer
- anime commercial studio for startup launch
- product animation for app promotion
- outsourced anime-style animation team
- end-to-end 2D anime production pipeline

### Blog/content keywords (topical authority)
- how to make an anime game trailer
- animation production pipeline for startups
- storyboard to final animation workflow
- anime ad examples for brand campaigns
- cost and timeline of animation commercials

---

## 5) Internal linking architecture

### Linking rules
1. Every service page links to 2–4 related work pages.
2. Every work page links back to 1 primary service + 1 secondary service.
3. Every blog post links to:
   - one service page (commercial bridge)
   - one relevant work case study (proof bridge)
4. Service pages link to 2–3 relevant blog posts.
5. Keep anchor text descriptive (avoid generic “click here”).

### Cluster model
- Hub: `/services/game-trailer-animation`
- Proof: `/work/nova-thera-initiation`, `/work/[other-relevant-project]`
- Education: `/blog/how-to-make-an-anime-game-trailer`

This creates a service → proof → education loop that supports both ranking and conversion.

---

## 6) Technical SEO implementation (Next.js App Router)

### Implemented now in this repo
- Global metadata base + OpenGraph/Twitter defaults in `app/layout.tsx`
- Global JSON-LD (`Organization`, `WebSite`) in `app/layout.tsx`
- Dynamic project metadata from CMS for `/work/[slug]`
- Project-level JSON-LD (`CreativeWork`) in `/work/[slug]`
- `app/robots.ts` with admin disallow rules
- `app/sitemap.ts` with static pages + dynamic work slugs
- Page-level metadata added for `/`, `/about`, `/work`, `/contact`
- Admin area marked `noindex` via `app/admin/layout.tsx`

### Next implementation targets (phaseable)
- Add `Service` schema for `/services/*`
- Add `BlogPosting` schema for `/blog/[slug]`
- Add `BreadcrumbList` schema for service/blog/work pages
- Add image/video dimension metadata to CMS media where available
- Add redirect rule for `/contacts -> /contact` (or inverse) in production config

---

## 7) SEO implementation plan

### Phase A (foundation)
- Finalize URL map + canonicals
- Launch robots + sitemap
- Ensure metadata on core pages

### Phase B (commercial coverage)
- Build `/services` and 3–5 service landing pages
- Link each service to relevant work projects

### Phase C (authority growth)
- Launch `/blog` with 8–12 high-intent articles
- Connect every article to service and work pages

### Phase D (optimization)
- Iterate titles/descriptions by Search Console CTR
- Expand internal links and cluster pages
- Add FAQ schema where applicable

---

## 8) Technical SEO checklist

### Indexing & crawl
- [ ] `robots.txt` reachable and correct
- [ ] `sitemap.xml` reachable and valid
- [ ] public pages indexable
- [ ] admin and private endpoints noindex/disallowed

### Metadata
- [ ] unique title per page
- [ ] unique meta description per page
- [ ] correct canonical per page
- [ ] OG/Twitter image on key templates

### Structured data
- [ ] `Organization` + `WebSite` on global layout
- [ ] `CreativeWork` or `VideoObject` on work detail
- [ ] `Service` on service pages
- [ ] `BlogPosting` on blog pages
- [ ] `BreadcrumbList` where relevant

### Content architecture
- [ ] service pages published
- [ ] work pages mapped to services
- [ ] blog cluster launched
- [ ] internal link rules applied

### Performance/UX
- [ ] mobile CWV acceptable
- [ ] LCP media optimized
- [ ] semantic heading hierarchy per template
- [ ] image/video alt and captions where useful
