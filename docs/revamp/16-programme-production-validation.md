# Programme production validation

**Date:** 2026-08-02  
**Migration doc:** `docs/migrations/SERVICE-ROUTE-MIGRATION.md`  
**Motion:** `docs/revamp/15-programme-motion-review.md`  
**Screenshots:** `docs/revamp/screenshots/programmes-production/`

---

## Confirmed public programme routes

| Route | Name | Cluster |
|---|---|---|
| `/programs/functional-training` | Functional Training | Train (primary) |
| `/programs/home-personal-training` | Home Personal Training | Train (delivery) |
| `/programs/online-training` | Online Training | Train (delivery) |
| `/programs/zumba` | Zumba | Move |
| `/programs/yoga` | Yoga | Move |
| `/programs/adult-dance` | Dance | Move |
| `/programs/wedding-choreography` | Wedding Choreography | Celebrate |
| `/programs` | Index | Pulse editorial discovery |

## Legacy routes and final treatment

| Route | Treatment |
|---|---|
| `/programs/strength-training` | Temporary taxonomy-review page · **noindex** · no redirect |
| `/programs/personal-training` | Temporary taxonomy-review page · **noindex** · no redirect |
| `/programs/kids-dance` | Temporary taxonomy-review page · **noindex** · no redirect |
| `/programs/weight-loss-fitness` | Temporary taxonomy-review page · **noindex** · no redirect |

**Redirects added:** none (no confirmed semantic equivalence).  
**Noindex routes retained:** the four legacy programme URLs above (`forceNoIndex` via metadata).  
**Sitemap:** confirmed programmes only (`taxonomyStatus === "confirmed"`).

## Internal links changed

- Programme index lists confirmed 7 only  
- Branch floor programme grids exclude legacy + home/online  
- Legacy pages link to `/programs` + related confirmed service  
- Location redesign deferred — only programme slug lists on branches updated  

## Components

**Created:** `ProgrammeDiscovery`, `ProgrammeDetailView`, `LegacyProgrammeNotice`, `ProgrammePulseMotion`, `programme-pulse.module.css`  
**Retained (design-lab / unused on production programmes):** older `ProgrammeHero`, `BenefitsSection`, cards, etc.  
**Not deleted:** legacy programme components remain for design-lab fixtures  

## Motion

See `15-programme-motion-review.md` — retain gated hover/tap only; no global fades; no EQ gadgets.

## Metadata / a11y / responsive

- Unique titles/descriptions across programmes (unit tests)  
- Canonicals self-pointing  
- Course JSON-LD only on confirmed pages  
- Screenshots captured for index + each confirmed + legacy at 390 + multi-viewport index  
- Keyboard: native anchors; focus rings on Pulse CTAs/lanes  
- Reduced-motion capture saved  

## Test results

| Check | Result |
|---|---|
| Typecheck | Pass |
| Unit | **169/169** Pass |
| Smoke / a11y E2E | **10/10** Pass (`--workers=1`) |
| Build `ALLOW_MOCK_PUBLISH=true` | **Pass** |

## Remaining owner questions

1. Strength ↔ Functional mapping?  
2. In-studio PT vs Home PT?  
3. Kids Dance as named product vs attribute only?  
4. Weight-loss page merge/retire?  
5. Rename `adult-dance` → `dance`?  
6. Service pricing?  
7. Branch nuances for Wedding / Home / Online?
