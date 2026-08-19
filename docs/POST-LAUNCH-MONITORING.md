# Post-launch monitoring

Operate after public premium V1 is live. **Do not add analytics, pixels, or third-party trackers without explicit approval.**

_Last updated: 2026-08-09 — Stage 8 final gate._

---

## Principles

1. Prefer first-party / platform-native signals (Vercel, Search Console) over marketing stacks.
2. Lab Lighthouse numbers are not field Core Web Vitals — confirm with real users when available.
3. Keep `ALLOW_MOCK_PUBLISH` unset and `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` false/absent on Production forever for the public site.
4. No conversion or WhatsApp click tracking until approved.

---

## Vercel analytics / Web Vitals (later)

| Item | Action |
|---|---|
| Vercel Analytics / Speed Insights | Enable **only after approval**; otherwise leave off |
| Field Web Vitals | When available: watch LCP, CLS, INP on `/`, key programmes, `/trial`, `/locations` |
| Lab vs field | Stage 7 lab mobile LCP was throttled-elevated; do not chase lab alone |
| Regression | If field LCP worsens after a deploy, bisect against `studio-pulse-before-final-stage-8` / prior production deploy |

---

## Search Console

| Item | Action |
|---|---|
| Property | Add `https://ankits-studio.vercel.app` (and custom domain when attached) |
| Sitemap | Submit `https://ankits-studio.vercel.app/sitemap.xml` after domain settled |
| Coverage | Confirm indexable routes; trainers / transformations / blog stay out as intended |
| Enhancements | Spot-check Organization / local business rich results — no Review/AggregateRating expected |
| Canonical | Watch for localhost or wrong-host canonicals after env changes |

---

## Indexing

| Check | Expectation |
|---|---|
| Public Tier 1–legal | `index, follow` when site-wide gate open |
| `/trainers`, `/transformations`, `/blog`, legacy programmes, `/design-lab` | noindex / withheld / disallow as designed |
| Sample blog fixtures | Hard 404 |
| After content publishes | Re-request indexing only for newly verified URLs |

---

## 404 monitoring

| Source | Watch for |
|---|---|
| Vercel / server logs | Spike in 404 on former soft-shell slugs (S8-01 fixed hard 404) |
| Search Console | Soft-404 / crawled-not-indexed surprises |
| Manual | Invalid programme/location/trainer slugs → hard 404; redirects `/locations/airoli` → Sector 19, `/book-a-free-trial` → `/trial` |

---

## Field LCP

| Item | Note |
|---|---|
| Priority routes | `/`, `/programs/functional-training`, other programme heroes, `/trial` |
| Known history | Stage 7 LCP correction kept first headline line visible; lab medians improved on home but remain lab-only |
| Action | Use field CWV (when approved) before further motion/perf surgery |
| Do not | Restart broad performance redesign without a confirmed field culprit |

---

## Maps & local accuracy

| Item | Action |
|---|---|
| Google Maps outbound links | Periodically open all four branch Maps URLs |
| Addresses / hours | Diff against owner updates; update content layer, not page hardcodes |
| GBP | When owner supplies profiles, verify site ↔ Maps consistency |

---

## Batch / pricing updates

| Surface | Cadence |
|---|---|
| `/timetable` | Update when batch availability changes |
| `/pricing` | Update when exact fees / policies arrive (see `docs/OWNER-INPUT-BACKLOG.md`) |
| Trial copy | Reconfirm free trial + ₹300 post-join language after commercial changes |
| Lead path | WhatsApp-first remains default until `LEAD_PROVIDER_URL` is approved and wired |

---

## Forms & customer feedback (manual)

| Item | Action |
|---|---|
| Trial / Contact | Spot-check submissions land in WhatsApp / configured adapter |
| Owner feedback | Log wording or hours corrections into content + backlog docs |
| No silent “success” | Keep fail-closed behaviour if lead provider unset |

---

## Conversion / WhatsApp click tracking (optional, gated)

- **Default:** off.
- If later approved: document tool, privacy impact, and Consent/Privacy Policy update before shipping.
- Prefer coarse funnel checks (Search Console + qualitative WhatsApp volume) until then.

---

## Branch / ops changes

When a studio moves, adds amenities, or changes phone:

1. Update verified content + `docs/BUSINESS-DATA-STATUS.md` only with owner confirmation.
2. Redeploy.
3. Re-check Maps links, Contact, footer, and JSON-LD address gating.

---

## Escalation

| Severity | Example | Response |
|---|---|---|
| P0 | Mock banner or synthetic “AI concept” on production | Immediate rollback; fix env |
| P1 | Broken trial WhatsApp / wrong tel / indexing of noindex surfaces | Hotfix or promote prior deploy |
| P2/P3 | Field LCP drift, CSP still deferred, S8-04..06 accepted items | Backlog; no emergency redesign |
