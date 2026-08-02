# Homepage + batch verification — Studio Pulse refinement

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**Tag baseline:** `studio-pulse-homepage-refinement-complete`  
**Screenshots:** `docs/revamp/screenshots/homepage-refinement-final/`  
**Machine findings:** `…/findings.json`  
**Related:** `docs/revamp/13-homepage-refinement-review.md`, `docs/audits/BATCH-AVAILABILITY-CONSISTENCY-AUDIT.md`

---

## Screenshot inventory

| File | Purpose |
|---|---|
| `{360,390,430,768,1024,1440,1920}_*_home.png` | First viewport |
| `*_home_full.png` | Full-page scroll capture |
| `390x844_sticky_mid.png` | Sticky revealed mid-page |
| `390x844_sticky_trial.png` | Sticky hidden at `#trial` |
| `390x844_reduced_motion_zoom200.png` | Reduced motion + CSS zoom probe |
| `1440x900_frozen_{a,b,c}.png` | Frozen prototype regression |
| `findings.json` | Automated metrics |

Capture script: `docs/revamp/_capture-homepage-refinement-final.mjs`

---

## Viewport findings

| Viewport | Overflow-X | Hero brand lockup | Hero CTA in view | Services | Functional primary | Banner |
|---|---|---|---|---|---|---|
| 360×800 | None | Hidden (header only) | Yes | 7 / Train·Move·Celebrate | Yes | Readable |
| 390×844 | None | Hidden | Yes | 7 | Yes | Readable |
| 430×932 | None | Hidden | Yes | 7 | Yes | Readable |
| 768×1024 | None | Hidden (≤768) | Yes | 7 | Yes | Readable |
| 1024×768 | None | Shown | Yes | 7 | Yes | Readable |
| 1440×900 | None | Shown | Yes | 7 | Yes | Readable |
| 1920×1080 | None | Shown | Yes | 7 | Yes | Readable |

Manual visual notes from captures:

- Service clusters remain editorial (not three equal cards).  
- Yoga lane retains calmer padding vs Functional.  
- Wedding lane remains warm/separate under Celebrate.  
- Touch targets for WhatsApp CTAs remain ≥44px CSS height.  
- Sticky shell padding `72px` reserved on mobile (`body` padding-bottom) → no CLS when sticky reveals.

**200% zoom:** CSS `zoom: 2` probe reported horizontal overflow on 390 CSS px (expected for that probe method). Native browser page-zoom reflow was not separately instrumented; first-viewport at 1× remains usable.

---

## Sticky CTA test results (390×844)

| Scenario | `data-sticky-cta-reveal` | Pass |
|---|---|---|
| Page top (hero CTA visible) | `false` | Yes |
| Mid-page (`#services`) | `true` | Yes |
| Final trial (`#trial`) | `false` | Yes |
| Fast scroll back to top | `false` | Yes |
| Reload then scroll mid | `true` | Yes |
| Body padding reserved | `72px` | Yes (no layout shift from toggle) |

Also exercised via capture flow: slow/mid scroll to services and trial. Orientation / resize: sticky logic is viewport IntersectionObserver-based; bar remains `lg:hidden`.

Reduced motion: show/hide uses `motion-reduce:transition-none`.

---

## Batch-data leaks found

| Surface | Leak | Fix |
|---|---|---|
| `getTimetableSlots()` | Returned mock slots | Verified-only filter |
| `/programs/[slug]` | Fake times in `BatchPreview` | Empty + WhatsApp |
| `/locations/[slug]` | Fake times in `BranchTimetable` | Empty + WhatsApp; operating window labelled |
| `/timetable` | Already fixed prior | Confirmed clean |
| Structured data | No schedule Events | Confirmed |
| Design-lab fixtures | Fake times | Left isolated (noindex) |

Post-fix live probes: no “Placeholder schedule”, “Illustrative classes”, “provisional class”, or “sample schedule” on `/`, `/timetable`, `/programs/yoga`, `/programs/functional-training`, `/locations/airoli`.

---

## Changes made

1. Public `getTimetableSlots` → verified only  
2. `BatchPreview` / `BranchTimetable` honest empty + WhatsApp  
3. Location OpeningHours caption + title clarification  
4. Programme/location pages wire WhatsApp availability CTAs  
5. Screenshot + findings capture for refinement final  
6. Unit coverage `src/content/timetable-public.test.ts`  
7. Audit + this verification doc  

Homepage sequence **unchanged**. Frozen A/B/C **unchanged**.

---

## Media fallback verification

| Check | Result |
|---|---|
| `data-media-status="fallback"` on homepage plates | Yes (`home.hero`, `home.differentiator`) |
| Slot keys present | Yes |
| Aria labels mark photography pending | Yes |
| Broken `<img>` icons | 0 |
| Stock/generated studio photos introduced | No |
| Catalogue aspect ratios | `src/content/media-slots.ts` + `docs/media/STUDIO-MEDIA-REQUIREMENTS.md` |
| Hero still CSS plate (no eager video) | Yes — LCP not blocked by missing media bytes |

---

## Frozen prototype verification

| Prototype | Root present | robots |
|---|---|---|
| revamp-a | Yes | `noindex, nofollow` |
| revamp-b | Yes | `noindex, nofollow` |
| revamp-c | Yes | `noindex, nofollow` |

Excluded from public primary nav and sitemap (existing policy). Design not altered.

---

## Test and build results

| Check | Result |
|---|---|
| Typecheck | Pass |
| Lint (changed files) | Pass |
| Unit | **163/163** pass (incl. `timetable-public`) |
| Smoke E2E | **Pass** (3/3) |
| Accessibility E2E | **Pass** (7/7) with `--workers=1` |
| Build `ALLOW_MOCK_PUBLISH=true` | **Pass** |

---

## Remaining limitations

- Real studio photography still pending (P1 atmosphere).  
- Exact batch schedules still PENDING — WhatsApp is the availability path.  
- CSS-zoom 200% probe is a coarse overflow signal; prefer real browser zoom QA on device.  
- Orientation-change sticky re-check is inferred from IntersectionObserver, not a separate device lab recording.  
