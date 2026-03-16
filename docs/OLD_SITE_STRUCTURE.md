# OLD_SITE_STRUCTURE

## Crawl scope
- Domain crawled: `https://otsulabs.com` (redirects to `https://www.otsulabs.com`)
- Crawl date: 2026-03-14 (UTC+7)
- Crawl method: public HTML fetch only (no backend access)
- Note: The old site is highly JS/CSS-animated, so heading extraction is best-effort from server-rendered HTML.

## High-level site structure (old site)
- `/` (Home)
- `/about`
- `/projects`
- `/project/[slug]` (portfolio detail pages)
- `/careers`
- `/contacts`
- `/privacy`

## Main navigation (global)
- About: `/about`
- Projects: `/projects`
- Join Us: `/careers`
- Contact: `/contacts`
- CTA button in header: `/contacts`

## Portfolio URLs discovered
- `/project/leap-forward`
- `/project/nova-thera-initiation`
- `/project/whispers-of-taiji`
- `/project/valeria-games`
- `/project/nova-thera-the-reckoning`
- `/project/reel-2023`

## URL inventory (public crawl)

| URL | HTTP | Page title | Meta description | Canonical | Heading snapshot |
|---|---:|---|---|---|---|
| `/` | 200 | Otsu Labs | Animation production studio | `https://www.otsulabs.com/` | H1: `Otsu— labs` |
| `/about` | 200 | About \| Otsu Labs | Animation production studio | `https://www.otsulabs.com/` | H2: `Animators, Artists, Storytellers, and Just Weebs.` |
| `/projects` | 200 | (not reliably emitted in crawl HTML) | Animation production studio | `https://www.otsulabs.com/` | H2: `projects` |
| `/contacts` | 200 | Contact \| Otsu Labs | Animation production studio | `https://www.otsulabs.com/` | (heading not clearly emitted) |
| `/careers` | 200 | Join us \| Otsu Labs | Animation production studio | `https://www.otsulabs.com/` | H2: `Step into a culture where being weeby is a way of life.` |
| `/privacy` | 200 | Privacy \| Otsu Labs | Animation production studio | `https://www.otsulabs.com/` | (heading not clearly emitted) |
| `/project/leap-forward` | 200 | Otsu Labs \| Leap Forward | A fun teaser for an original character named Fwog. | `https://www.otsulabs.com/` | H2: `Leap Forward` |
| `/project/nova-thera-initiation` | 200 | Otsu Labs \| Nova Thera: Initiation | Pixelmon™ Official Anime Teaser... | `https://www.otsulabs.com/` | H2: `Nova Thera: Initiation` |
| `/project/whispers-of-taiji` | 200 | Otsu Labs \| Whispers of Taiji | A short animation teaser for Whispers of Taiji. | `https://www.otsulabs.com/` | H2: `Whispers of Taiji` |
| `/project/valeria-games` | 200 | Otsu Labs \| Valeria Game | An official game launch trailer for Valeria Games. | `https://www.otsulabs.com/` | H2: `Valeria Games` |
| `/project/nova-thera-the-reckoning` | 200 | Otsu Labs \| Nova Thera: The Reckoning | An official trailer for Pixelmon Anime Universe. | `https://www.otsulabs.com/` | H2: `Nova Thera: The Reckoning` |
| `/project/reel-2023` | 200 | Otsu Labs \| The Wrath of Gods | This compilation showcases our best work from 2023... | `https://www.otsulabs.com/` | H2: `Reel 2023` |
| `/contact` | 404 | (none) | Animation production studio | `https://www.otsulabs.com/` | Error heading: `500 Internal Server Error — Something went wrong.` |

## Internal linking pattern
- Header/footer links appear on most pages and point to:
  - `/`, `/about`, `/projects`, `/careers`, `/contacts`, `/privacy`
- `/projects` links to all discovered `/project/[slug]` pages.
- Each `/project/[slug]` page links back to `/projects` and global nav/footer links.
- No internal blog URLs discovered.
- No internal service landing URLs discovered.

## Technical endpoints observed
- `https://www.otsulabs.com/robots.txt` exists and is permissive.
- `https://www.otsulabs.com/sitemap.xml` returns 404 (no discoverable XML sitemap).
