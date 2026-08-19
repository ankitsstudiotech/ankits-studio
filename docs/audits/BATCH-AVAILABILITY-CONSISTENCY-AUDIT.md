# Batch availability consistency audit

**Date:** 2026-08-02  
**Scope:** Public marketing surfaces after Studio Pulse homepage refinement  
**Owner-confirmed:** Operating window 06:00–22:00; exact batch schedules **not** supplied  
**Rule:** Mock timetable rows must not render publicly; WhatsApp for current availability  

---

## Summary

Public accessors previously merged `mockTimetableSlots` into `getTimetableSlots()`, so `/programs/[slug]` and `/locations/[slug]` rendered invented start/end times (with disclaimers). `/timetable` had already been converted to honest Batch Availability. This pass closes the remaining public leaks without weakening launch-gate provenance (mock rows remain in `content/mock` for `content-mode` detection only).

---

## Audit table

| File/route | Previous behaviour | Risk | Change | Verification |
|---|---|---|---|---|
| `src/content/index.ts` → `getTimetableSlots()` | Returned merged mock + verified slots | Invented public batch rows | Filter to `dataStatus === "verified"` only | Unit: `timetable-public.test.ts` → length 0 |
| `src/content/mock/timetable.ts` | Mock slots with fake times | Leak if accessed publicly | Kept for provenance; documented not for public render | `siteHasUnverifiedContent` still true |
| `src/app/(marketing)/timetable/page.tsx` | Already honest Batch Availability | Low | No invented rows; WhatsApp CTA; operating window separate | Live: no placeholder/provisional copy |
| `src/app/programs/[slug]/page.tsx` | `BatchPreview` fed mock slots | High — programme SEO pages showed fake times | Slots from verified-only accessor; WhatsApp CTA on empty | Live `/programs/yoga`: no Placeholder schedule |
| `src/app/locations/[slug]/page.tsx` | `BranchTimetable` fed mock slots | High — branch pages showed fake times | Same; OpeningHours titled “Studio operating window” | Live `/locations/airoli`: Batch availability + 06:00 hours, no leak |
| `src/components/programs/BatchPreview.tsx` | “Illustrative slot preview” defaults | Misleading empty/filled copy | Honest empty state + WhatsApp props | Defaults + empty UI |
| `src/components/timetable/BranchTimetable.tsx` | “Illustrative classes…” / timetable eyebrow | Misleading | Batch availability eyebrow + WhatsApp empty state | Defaults + empty UI |
| `src/components/locations/OpeningHours.tsx` | Caption implied confirm visit times | Could read as class times | Caption clarifies operating window ≠ batches | Caption copy |
| Homepage `/` | Already no slot table | Low | Unchanged sequence | Leak probe clean |
| `src/lib/seo/structured-data.ts` | LocalBusiness/Course without schedule events | Low | No change needed | No OpeningHoursSpecification / Event slots |
| Sitemap `/timetable` | URL retained | Low | Label Batch Availability in nav; URL stable | ADR-016 |
| Design-lab fixtures (`design-lab/**`) | Fixture times on lab pages | Acceptable — noindex / not public nav | Untouched | Frozen/lab isolation |
| `content-mode` mock domain list | Includes mock timetable | Required for launch gate | Untouched | Unverified mode remains |

---

## Residual (acceptable)

| Item | Why acceptable |
|---|---|
| Mock rows still in repo | Launch-gate + future verified merge; not returned by public accessor |
| Design-lab `BatchPreview` / `BranchTimetable` fixtures | Isolated under `/design-lab`, noindex |
| Operating hours 06:00–22:00 on branch pages | Owner-verified window, labelled separately from batches |

---

## Explicit non-goals

- Do not invent replacement class rows  
- Do not convert operating window into continuous class time  
- Do not weaken `ALLOW_MOCK_PUBLISH` / noindex / empty sitemap while unverified  
