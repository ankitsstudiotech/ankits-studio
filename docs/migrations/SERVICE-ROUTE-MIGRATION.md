# Confirmed service route migration

**Date:** 2026-08-02  
**Status:** Approved for implementation (document first; production route changes follow)  
**Owner interview:** 2026-08-01  
**Homepage baseline:** `studio-pulse-homepage-verified`

---

## Confirmed public catalogue

| # | Name | Slug | Cluster |
|---|---|---|---|
| 1 | Functional Training | `functional-training` | Train |
| 2 | Zumba | `zumba` | Move |
| 3 | Yoga | `yoga` | Move |
| 4 | Dance | `adult-dance` | Move |
| 5 | Wedding Choreography | `wedding-choreography` | Celebrate |
| 6 | Home Personal Training | `home-personal-training` | Train (delivery) |
| 7 | Online Training | `online-training` | Train (delivery) |

**Audience / delivery attributes (not separate public services unless owner confirms):** ladies-only batches, kids-only batches, home delivery, online delivery.

---

## Migration table

| Existing route | Existing label | Confirmed status | Proposed action | Target route | SEO risk | Internal-link changes | Reason |
|---|---|---|---|---|---|---|---|
| `/programs` | Programmes (index) | Confirmed hub | **Keep** — rebuild as Pulse editorial discovery for confirmed 7 | — | Low | Index lists confirmed only; legacy linked only from temporary pages | Hub for taxonomy |
| `/programs/functional-training` | Functional Training | Confirmed | **Keep** | — | Low | Homepage, locations, related | Owner core fitness product |
| `/programs/zumba` | Zumba | Confirmed | **Keep** | — | Low | Homepage, locations, related | Owner core |
| `/programs/yoga` | Yoga | Confirmed | **Keep** | — | Low | Homepage, locations, related | Owner core |
| `/programs/adult-dance` | Dance | Confirmed | **Keep** (slug retained) | Optional later `/programs/dance` only if owner requests rename | Low | Homepage, locations; label already “Dance” | Confirmed “Dance”; renaming slug without need adds SEO churn |
| `/programs/wedding-choreography` | Wedding Choreography | Confirmed | **Keep** | — | Low | Homepage, related | Owner core |
| `/programs/home-personal-training` | Home Personal Training | Confirmed | **Keep** | — | Low | Homepage; **not** on branch floor grids | Delivery mode, not branch class |
| `/programs/online-training` | Online Training | Confirmed | **Keep** | — | Low | Homepage; **not** on branch floor grids | Delivery mode, not branch class |
| `/programs/strength-training` | Strength Training | Legacy ambiguous | **Preserve temporarily as noindex** | No permanent redirect | Medium if 301 to Functional without confirmation | Remove from sitemap, index cards, branch programme grids | Not confirmed equivalent to Functional Training |
| `/programs/personal-training` | Personal Training | Legacy ambiguous | **Preserve temporarily as noindex** | No permanent redirect to Home PT | Medium if conflated with Home PT | Remove from sitemap / public grids | In-studio PT ≠ Home Personal Training |
| `/programs/weight-loss-fitness` | Weight-Loss & General Fitness | Legacy ambiguous | **Preserve temporarily as noindex** | No permanent redirect | Medium if merged into Functional | Remove from sitemap / public grids | Outcome-adjacent naming; no owner merge confirmation |
| `/programs/kids-dance` | Kids Dance | Legacy ambiguous | **Preserve temporarily as noindex** | No permanent redirect to Dance | High if deleted without redirect | Remove from sitemap / public grids; Dance page mentions kids-only batches as attribute | Kids-only batches confirmed; separate Kids Dance product not confirmed |

**Redirects:** none for programmes in this pass (no confirmed semantic equivalence → no 301s → no chains).  
**Removals:** none — all legacy URLs remain reachable with honest temporary pages.

---

## Sitemap / robots / canonical

| Surface | Confirmed (7) | Legacy (4) |
|---|---|---|
| Sitemap | Include when site not noindex | **Exclude** (`taxonomyStatus !== "confirmed"`) |
| robots / page robots | Site-level mock noindex while unverified content exists | Additional `noindex` on legacy detail pages |
| Canonical | Self `/programs/{slug}` | Self `/programs/{slug}` (no canonical to a different service) |
| Structured data Course | Emit only for confirmed public programmes | **Do not** emit Course JSON-LD for legacy temporary pages |

---

## Internal-link inventory (to update in implementation)

| Source | Change |
|---|---|
| Homepage `HOMEPAGE_CLUSTERS` | Already confirmed 7 — keep |
| `/programs` index | Confirmed clusters only; optional footer note about taxonomy review |
| Branch `BRANCH_FLOOR_PROGRAMMES` / location grids | Confirmed in-studio only (exclude home/online + legacy) |
| Nav “Programmes” | Still `/programs` |
| Legacy detail pages | Link to `/programs` + relevant confirmed relatives (e.g. Strength → Functional as “related enquiry”, not as same product) |
| Media slots | Confirmed services only (already) |
| WhatsApp | Prefill confirmed programme **names**; template uses free-trial enquire wording |
| Tests | Assert sitemap excludes legacy; legacy pages noindex; confirmed routes 200 |

---

## Unresolved owner questions

1. Is **Strength Training** the same as **Functional Training**, a subset, or retired?
2. Does **in-studio Personal Training** still exist beside **Home Personal Training**?
3. Is **Kids Dance** a named public programme, or only kids-only batches under Dance / other services?
4. Should **Weight-Loss & General Fitness** merge into Functional, stay, or retire?
5. Should the Dance URL rename from `adult-dance` → `dance`?
6. Branch-level availability nuances for Wedding / Home / Online?
7. Service-specific pricing (all still pending)?

---

## Implementation order (this task)

1. This document (committed first)  
2. Content model + confirmed copy honesty  
3. Rebuild `/programs` Pulse discovery  
4. Rebuild confirmed detail pages  
5. Legacy temporary pages + sitemap/noindex + tests  
6. Motion review + browser QA + validation doc  

Frozen design-lab prototypes are **out of scope**. Locations route family is **not redesigned** — only programme links on locations may be filtered to confirmed in-studio services where the existing grid already lists programmes.
