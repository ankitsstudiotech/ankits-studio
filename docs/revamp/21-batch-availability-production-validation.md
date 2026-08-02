# 21 — Batch availability production validation

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**URL:** `/timetable` (label: Batch Availability)  
**Frozen prototypes:** untouched

---

## Previous route problems

- Honest copy existed, but no service-aware enquiry builder
- Pre-Pulse marketing `Section` + bordered link lists
- Generic trial WhatsApp CTA only (no Home/Online message variants)
- No on-page FAQ / audience / max-batch notes in Pulse utility form

## Final page sequence

1. Introduction — “Check current batches”
2. Operating hours — 6:00 AM–10:00 PM + pending schedules note
3. Availability enquiry builder (client island)
4. Ladies-only / kids-only + max group size (15)
5. Short FAQ
6. Related programme + location links

No fake timetable table. No calendar grid.

## Enquiry modes

| Mode | Branch | Locality | Batch preference | WhatsApp opener |
|---|---|---|---|---|
| Physical studio services | Strongly prompted (`aria-required`) | Hidden | Mixed / ladies / kids | Check availability + free trial |
| Home Personal Training | Hidden | Shown | Hidden | Enquire about Home PT |
| Online Training | Hidden | Hidden | Hidden | Enquire about Online Training |

Soft branch hint does **not** block opening WhatsApp.

## WhatsApp variants

Implemented in `src/lib/conversion/availability-whatsapp.ts` — central number, URL-encoded, optional fields.

## Structured data

`WebPage` + `BreadcrumbList` only. No Event / Course / Schedule / Offer / seat availability.

## Motion

See `docs/revamp/20-batch-availability-motion-review.md`.

**Retained:** instant field swaps via `startTransition`.  
**Removed/avoided:** equalizers, calendar motion, fade-ups, `transition: all`.

## Fake timetable logic removed

- Page does not call `getTimetableSlots`
- Public accessor remains verified-only (empty)
- Regression tests in `tests/routes/batch-availability.test.ts`

## Responsive / accessibility

- Screenshots: `docs/revamp/screenshots/batch-availability-production/`
- Axe on production build: **0 serious/critical** after muted-text contrast fix
- Mode smoke: Home shows locality; Online hides locality; Yoga shows branch

## Tests added

- `tests/routes/availability-whatsapp.test.ts` (6)
- `tests/routes/batch-availability.test.ts` (4)

## Verification results

| Check | Result |
|---|---|
| Unit tests (targeted) | Pass |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |
| Lint | 0 errors (pre-existing warnings elsewhere) |
| Structured-data safety | WebPage + Breadcrumb only |

## Remaining owner-data gaps

1. Exact branch/programme batch schedules  
2. Whether ladies/kids options differ by branch  
3. Home PT coverage areas  
4. Online platform / session format details  

---

## Commits in this rebuild

1. `docs: audit batch availability route`
2. `feat: rebuild batch availability enquiry experience`
3. `feat: add service-aware WhatsApp availability flow`
4. `fix: remove remaining timetable semantics and fake schedule assumptions`
5. `chore: validate batch availability production route` (this validation + contrast fix + screenshots)
