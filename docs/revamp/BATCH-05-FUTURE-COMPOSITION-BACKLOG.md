# Batch 05 — future composition backlog

Audit-only notes from the independent Claude live-production verification.
**Do not treat this as Batch 05 implementation scope.** CTA bands were not redesigned.

## Closing CTA-band left-cluster

Independent finding: closing CTA bands often contain heading + copy + button clustered left, with roughly 60–70% empty right.

Observed on (non-exhaustive):

| Surface | Pattern |
|---|---|
| Home `#trial` (`FreeTrialCta`) | `ctaBandInner` is `42rem + max-content + 1fr`. Copy and button sit left; the third track is an unused grid column. |
| About “Book a free trial” | Heading + lede + WhatsApp clustered in the left measure. |
| Programme closing CTA | Heading + copy + button left-clustered on the dark field. |
| Branch closing CTA | Same left-cluster as programme closings. |
| `/trainers` closing CTA | Heading + copy + button. |
| `/transformations` closing CTA | Heading + copy + button. |

This is a **separate composition family** from Batch 05 heroes. A later micro-batch should redesign the CTA band as an editorial close (balanced mass, still one primary action) without:

- four-stat cards
- fake Maps UI
- extra decorative quotes
- stretching the button to fill width

## Still out of scope (later batches)

- `.snapshotFacts` / “The session, at a glance” / odd-grid cells
- Single-item FAQs
- Google Reviews
- Pricing / timetable / trial / contact / legal utility measure
- Locations-aside thinness on programme related-discovery (Batch 04 P2 note)

Do not start those from this file.
