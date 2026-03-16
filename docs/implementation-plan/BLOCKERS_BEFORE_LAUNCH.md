# Blockers Before Launch

Classification:
- Hard blockers: should be solved before confident launch
- Soft blockers: launch possible with explicit caveats
- Post-launch improvements: planned after launch stabilization

Complexity scale: `Low` / `Medium` / `High`

## 1) Hard blockers

| Blocker | Why it matters | Impact (user/business/SEO) | Fix complexity | Recommended timing |
|---|---|---|---|---|
| Missing slug-change auto-301 + redirect system | Published URL changes can break indexed links with no recovery path | SEO equity loss, 404 exposure, link rot | Medium | Before launch |
| Contact form backend missing | Core conversion route has no working lead submission | Business: no lead capture; User: dead-end flow | Medium | Before launch |
| Missing thank-you confirmation flow | No clear success UX and no conversion endpoint | Lower trust + weaker conversion clarity | Low | Before launch |
| Cookies/terms pages missing | Legal/compliance baseline incomplete | Compliance and trust risk | Low | Before launch |
| Canonical inconsistency on core static pages | Some indexable pages rely on implicit defaults only | SEO ambiguity and potential canonical drift | Low | Before launch |

## 2) Soft blockers

| Blocker | Why it matters | Impact | Fix complexity | Recommended timing |
|---|---|---|---|---|
| Services/blog not CMS-driven | Architecture split raises maintenance burden | Ops and consistency risk, not immediate outage | High | Phase 3 (after launch-safe)
| No per-page sitemap toggle | Cannot fine-tune indexing scope per document | SEO governance limitation | Medium | Phase 2 |
| No explicit nofollow control | Robots control incomplete for edge cases | SEO governance limitation | Low | Phase 2 |
| No snippet preview in editor | Editors cannot QA SERP presentation visually | Editorial quality friction | Low | Phase 2 |
| No schema selector in CMS | Schema strategy mostly code-driven | Harder non-dev SEO ops | Medium | Phase 2 |
| Legacy fallback still active for work | Source-of-truth can blur during anomalies | Data consistency caveat | Medium | Phase 1/3 |

## 3) Post-launch improvements

| Improvement | Why it matters | Impact if delayed | Fix complexity | Recommended timing |
|---|---|---|---|---|
| UTM/referrer capture | Needed for attribution quality | Lower marketing insight | Medium | Phase 4 |
| CTA event tracking | Needed for funnel optimization | Limited analytics depth | Medium | Phase 4 |
| CRM mapping + lead routing | Needed for operational lead handling | Manual triage overhead | Medium | Phase 4 |
| Consent logging | Needed for stronger compliance posture | Compliance caveat by region | Medium | Phase 4 |
| Review workflow (`review` state) | Prevent accidental publish in teams | Editorial governance risk | Medium | Phase 5 |
| RBAC | Multi-user security/governance | Access control limitations | High | Phase 5 |
| Revision history | Rollback and auditability | Recovery friction from mistakes | Medium | Phase 5 |
| Taxonomy model | Scalable content clustering/internal links | Slower SEO scale | Medium | Phase 5 |

## Launch readiness interpretation

- Launch can proceed safely only after hard blockers are resolved.
- Soft blockers are acceptable with documented caveats and a committed post-launch roadmap.
