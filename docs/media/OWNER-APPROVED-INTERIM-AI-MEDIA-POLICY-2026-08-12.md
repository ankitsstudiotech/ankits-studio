# Owner-approved interim AI media policy — 12 August 2026

**Status:** Supersedes Stage 4A *preview-only* deployment intent for the thirteen approved catalogue assets.  
**Historical reference:** `SYNTHETIC-MEDIA-PREVIEW-POLICY.md` (Stage 4A — unchanged).

---

## Owner decision

| Field | Value |
|---|---|
| Date | 12 August 2026 |
| Reason | Existing studio photography/video is outdated |
| Interim | Professionally art-directed AI-generated illustrative media |
| Future | Replace with new real photography/video after owner photoshoot |

---

## Allowed uses (illustrative-ai)

AI imagery may support:

- Editorial atmosphere
- Programme illustration
- Movement illustration
- Generic training environment
- Generic community/activity imagery

---

## Prohibited uses (hard trust boundaries)

AI imagery must **never** represent:

- A named branch interior/exterior as documentary proof
- A portrait of Ankit Nalawade
- A portrait of a named trainer
- A Google reviewer, member testimonial, or transformation subject
- Certification, award, or real event documentation

---

## Status vocabulary (active production)

| Status | Meaning |
|---|---|
| `fallback` | No usable media — text-led surface |
| `illustrative-ai` | Owner-approved temporary AI editorial imagery |
| `verified-real` | Owner-confirmed genuine photography/video |
| `synthetic-preview` | **Legacy/concept only** — experimental preview assets |

Catalogue fields for approved interim assets:

```txt
status: "illustrative-ai"
source: "ai-generated-illustration"
consentStatus: "not-applicable-ai"
replacementStatus: "replace-after-owner-photoshoot"
```

---

## Production rendering

- `illustrative-ai` renders in **public production** without `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA`.
- Resolver priority: `verified-real` > `illustrative-ai` > `fallback`.
- `synthetic-preview` requires concept-preview / legacy flag — never production default.

---

## Public disclosure

- **One** restrained global footer disclosure (not per-image badges).
- No warning banner, modal, or “AI concept preview” label on production illustrative assets.
- Concept-preview deployment may retain experimental labels for non-production assets.

---

## Replacement

When owner supplies real media, set slot to `verified-real` with new `src` — no component restructure required.

See `PRODUCTION-INTERIM-AI-MEDIA-MANIFEST-2026-08-12.md` and `FUTURE-PHOTOSHOOT-REPLACEMENT-MAP.md`.
