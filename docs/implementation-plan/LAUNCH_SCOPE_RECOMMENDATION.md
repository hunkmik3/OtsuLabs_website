# Launch Scope Recommendation

Decision objective: launch the rebuilt site with improved technical SEO while avoiding over-expansion into content types not yet fully CMS-governed.

Reference inputs:
- `EXECUTIVE_SUMMARY.md`
- `ROUTE_URL_STRATEGY_REVIEW.md`
- `SEO_GAP_REVIEW.md`

## OPTION A — Conservative launch (recommended)

### Included routes (public indexable)
- `/`
- `/about`
- `/work`
- `/work/[slug]` (published only)
- `/contact`
- `/privacy-policy`

### Excluded/deferred from strong public launch
- `/services`, `/services/[slug]` -> keep reachable only if needed, but set noindex and remove from prominent nav/internal CTA emphasis until CMS migration.
- `/blog`, `/blog/[slug]` -> same as services.
- Admin/API routes remain non-indexed/private.

### SEO risks
- Lower risk of indexing content architecture that is not yet CMS-governed.
- Keeps topical breadth narrower until service/blog governance is ready.

### Conversion risks
- Lower TOFU reach from service/blog content in short term.
- Mitigated if work pages + contact CTA are strong.

### Operations risks
- Low: team focuses on one strong content system (`workProject`).
- Avoids dual source-of-truth pressure.

### Why recommended now
- Matches audit reality: work CMS is mature; services/blog still local-module-based.
- Minimizes launch risk while preserving technical SEO gains.

---

## OPTION B — Expanded launch

### Included routes (public indexable)
- All Option A routes
- `/services`, `/services/[slug]`
- `/blog`, `/blog/[slug]`

### Excluded/deferred
- None in core content scope (except admin/API private routes).

### SEO risks
- Medium-high: publishes content types not using same CMS/editor/SEO governance model.
- Redirect/schema/editor consistency risk increases.

### Conversion risks
- Potentially higher top-of-funnel traffic and intent capture if content quality is strong.
- But measurement stack is currently weak (tracking/CRM gaps), so ROI attribution remains limited.

### Operations risks
- High: requires maintaining both CMS and hardcoded local content modules.
- Increases content update bottlenecks and inconsistency probability.

### When to choose
- Only if business explicitly accepts temporary architecture debt and commits near-term migration in Phase 3.

---

## Route-by-route launch recommendation

| Route | Option A | Option B | Recommendation now |
|---|---|---|---|
| `/` | Public index | Public index | Public index |
| `/about` | Public index | Public index | Public index |
| `/work` | Public index | Public index | Public index |
| `/work/[slug]` | Public index (published only) | Public index (published only) | Public index |
| `/contact` | Public index | Public index | Public index |
| `/privacy-policy` | Public index | Public index | Public index |
| `/services` | Keep gated/noindex | Public index | Keep gated/noindex until CMS migration |
| `/services/[slug]` | Keep gated/noindex | Public index | Keep gated/noindex until CMS migration |
| `/blog` | Keep gated/noindex | Public index | Keep gated/noindex until CMS migration |
| `/blog/[slug]` | Keep gated/noindex | Public index | Keep gated/noindex until CMS migration |

## Final launch scope recommendation

Recommend **Option A (Conservative launch)** for immediate go-live alignment.

Rationale:
1. It aligns with current strongest architecture (work CMS + technical SEO foundation).
2. It avoids exposing incomplete governance on services/blog.
3. It reduces SEO and operational risk while Phase 1 and Phase 2 fixes land.
