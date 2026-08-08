# Synthetic Media Preview Policy

**Status:** Stage 4A contract  
**Audience:** Engineering, design, owner intake  
**Related:** `PREMIUM-MEDIA-ART-DIRECTION.md`, `PREMIUM-MEDIA-SLOT-MAP.md`, `AI-CONCEPT-GENERATION-BRIEF.md`

---

## Purpose

Synthetic media exists **only** for development and art-direction preview.

It prototypes composition, crop, grading, motion, and replacement plumbing **before** owner-verified photography and video arrive.

It is **not** studio proof.

---

## Hard prohibitions

Synthetic media must **never** be used as:

- real branch proof (Airoli Sector 19 / 8, Ghansoli, Thane)
- real trainer proof
- real member proof
- testimonials or reviews
- transformation / before–after evidence
- business credentials or certifications
- evidence of facilities at a named location
- evidence of a specific neighbourhood studio exterior or interior
- a portrait of Ankit Nalawade or any named coach

Synthetic people remain **anonymous**.

Synthetic studio scenes are **conceptual atmosphere only** — not a claim about any physical branch.

---

## Status vocabulary

| Status | Meaning |
|---|---|
| `synthetic-preview` | AI / concept asset for local/preview art direction only |
| `verified-real` | Owner-verified photography or video cleared for production truth |
| `fallback` | Text-led or non-photographic surface until real media arrives |

Every synthetic media **record** must carry:

```txt
status: "synthetic-preview"
source: "ai-concept"
consentStatus: "not-applicable-synthetic"
```

Real media will eventually use:

```txt
status: "verified-real"
```

Slots without usable media remain:

```txt
status: "fallback"
```

---

## Feature flag

Synthetic rendering is gated by:

```txt
NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true
```

Default / absent / `false`:

- Production and local builds keep the approved **text-led / fallback** experience
- No synthetic surfaces, no “AI concept preview” label
- No accidental promotion of concept art to production truth

---

## Verified-real-only slots

These slots **reject** synthetic assets entirely (see code: `isVerifiedRealOnlySlot`):

- Founder portrait (`about.founder`)
- Trainer portraits
- Branch-specific photography (per-location heroes / exterior / interior)
- Testimonials / member media
- Transformations
- Review authors
- Certification evidence

---

## Replacement path (Stage 4B)

1. Owner supplies verified assets for a slot  
2. Record set to `status: "verified-real"` with consent metadata  
3. Synthetic catalogue entry removed or ignored  
4. Flag may remain off in production; verified-real assets render without the synthetic label  

---

## Labelling

When synthetic media is enabled in development and a synthetic-preview item renders, show a tiny unobtrusive **“AI concept preview”** marker at the media edge.

Never show that label for `verified-real` media.
Never show synthetic media or the label when the flag is false.
