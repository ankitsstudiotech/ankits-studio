# Business Data Status

This is the **single source of truth** for what is real vs. mock in this project.
If this doc says a field is `MOCK`, no other doc, component, or commit message may
imply it is real. See [DECISIONS.md ADR-002](./DECISIONS.md#adr-002) for the
mechanism that enforces this at build/runtime.

Status values: `MOCK` (placeholder, invented for structure/design only),
`REFERENCE-ONLY` (owner supplied a pointer but it isn't structured/confirmed yet),
`VERIFIED` / `owner_confirmed` (owner confirmed this exact value for publication),
`PARTIALLY CONFIRMED` (owner stated something that still needs clarification before full public use).

Owner intake provenance for the 2026-08-01 interview:
`sourceType: owner_interview`, `sourceDate: 2026-08-01`, `sourceName: Ankit`,
`verificationLevel: owner_confirmed` (or partially_confirmed where noted).
Full audit: [business/OWNER-DATA-MIGRATION-2026-08-01.md](./business/OWNER-DATA-MIGRATION-2026-08-01.md).

## Domains

| Domain | Status | Notes |
|---|---|---|
| Business name (Ankit’s Studio) | VERIFIED | Owner-confirmed. Logo descriptor “Dance & Fitness” is **not** the legal name. |
| Logo descriptor | VERIFIED | Lockup text only. |
| Branch list (Sector 19, Sector 8, Ghansoli, Thane) | VERIFIED (existence / open) | Four branches currently open per owner. |
| Branch printable addresses | VERIFIED | All four branches have owner-confirmed printable addresses in `src/content/mock/branches.ts` (`fieldProvenance.address = owner_confirmed`). Published on branch pages and ExerciseGym JSON-LD. |
| Maps short URLs (all four branches) | VERIFIED | Owner-confirmed Maps short URLs + CID place listings for Sector 19, Sector 8, Ghansoli, Thane. |
| Central phone / WhatsApp (+91 93724 02074) | VERIFIED | Central studio enquiry number; branches inherit it — not unique per-branch lines. Dialable via `getStudioContactLinks()` / WhatsApp conversion helpers. |
| General enquiry email | VERIFIED | `ankitsstudio5@gmail.com` — owner-confirmed in `contact-details.ts`. |
| Operating window (06:00–22:00 all branches) | VERIFIED | Operating window only — **not** a batch timetable. Maps hours disagree (documented in migration audit); prefer owner window until clarified. |
| Batch / class timetables | MOCK / PENDING | Detailed slots remain placeholder; do not invent from the operating window. |
| Trial class free | VERIFIED | Primary conversion: WhatsApp free-trial message. |
| Registration fee INR 300 | VERIFIED | One-time. |
| Programme-specific fees | PENDING | Monthly/quarterly/annual not supplied. Illustrative plan rows removed. |
| Max group batch size 15 | VERIFIED | |
| Ladies-only / kids-only batches | VERIFIED (availability) | Audience/batch options — not automatic separate services. |
| Enquiries across age groups | VERIFIED | Do not claim every programme suits every age. |
| Differentiator (machine-free, coach-led, adapted) | VERIFIED (safe wording) | No outcome promises. |
| Trainer count 15+ | VERIFIED (count only) | No “highly qualified”. |
| Experience “2+ years” | PARTIALLY CONFIRMED | Subject unclear — do not market until clarified. |
| Certifications “government-approved” | PARTIALLY CONFIRMED / UNPUBLISHED | No names/issuers/trainers — do not publish. |
| Commercial priority “grow fitness” | PARTIALLY CONFIRMED | Likely Functional Training — confirm meaning. |
| Owner programme catalogue | VERIFIED (names) | Functional Training, Zumba, Yoga, Dance, Wedding Choreography; Home PT + Online as delivery modes. |
| Legacy programme routes (Strength, PT, Kids Dance, Weight-loss) | MIGRATION-PENDING | Kept live; taxonomy confirmation required — no silent deletes. |
| Photos / videos / testimonials | PENDING | Owner can supply; none received yet. Keep mock testimonials labelled illustrative. |
| Trainer names / bios | MOCK | Do not invent. |
| Transformations / ratings / awards | MOCK / ABSENT | Do not invent; do not scrape Maps ratings. |
| FAQs | MOCK | Still placeholder Q&A. |
| Primary/footer navigation structure | VERIFIED | IA structure. Primary CTA href overridden to WhatsApp at chrome layer when contact verified. |
| Conversion preference order | VERIFIED | WhatsApp → phone → trial-form → email. |

## Owner-confirmed branch addresses (source of truth: content records)

| Branch | Address | Maps short URL |
|---|---|---|
| Airoli Sector 19 | Shop No. 05, Beside Bank of Maharashtra, Sector 19, Airoli, Navi Mumbai, Maharashtra 400708 | https://maps.app.goo.gl/75pmKFuezsCSd5JP8 |
| Airoli Sector 8 | Swaraj Daffodils, Beside Airoli Sports Association, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701 | https://maps.app.goo.gl/1J1KpmeYWsoWkckr6 |
| Ghansoli | Satyam Imperial, Opposite Sai Baba Mandir, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701 | https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9 |
| Thane | Edulji Road, Dhobi Ali, Charai, Opposite Awaaz Radio, Thane, Maharashtra 400601 | https://maps.app.goo.gl/6tQTXnrur5iggfJ6A |

Earlier “Maps-observed only / Sector 8 missing” notes below are **historical** (2026-08-01 intake) and superseded by the verified content records above.

## Owner-supplied Maps links (labelled 2026-08-01 — historical intake)

| Branch | Short link | Browser resolution |
|---|---|---|
| Airoli Sector 19 | https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac | Resolved to Ankit's Studio, Sector-19 Airoli |
| Ghansoli | https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac | Resolved to Ankit’s Studio, Sector 11 Ghansoli |
| Thane | https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic | Resolved to Ankit’s Studio, Charai / Thane West |
| Airoli Sector 8 | — (intake gap; later owner-confirmed — see table above) | — |

Observed Maps address strings from the 2026-08-01 intake were provisional; current printable facts live in verified branch records.

## Verification workflow

1. Owner reviews this table and supplies the real value for a domain.
2. The corresponding content record's `dataStatus` field is flipped / updated in the same change that updates this table.
3. This table and the code must never disagree.
4. Only when **every domain required for a given route** is verified may that route leave mock-preview protections (ADR-002).
5. Full production launch still requires remaining mock/pending domains (timetable slots, trainers, media, programme fees, taxonomy cleanup) to be resolved or intentionally omitted. Branch addresses and enquiry email are verified.

## Ownership of this document

Only the business owner (or someone relaying an explicit, quotable instruction
from them) may change a status to `VERIFIED`. Neither Claude nor Cursor may mark
a row verified on their own inference — this is a hard rule, see
[DECISIONS.md ADR-002](./DECISIONS.md#adr-002) and [TASKS.md](./TASKS.md).
