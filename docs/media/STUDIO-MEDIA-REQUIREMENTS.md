# Studio media requirements

**Status:** Production readiness model — real assets not yet received  
**Related:** `docs/BUSINESS-DATA-STATUS.md`, ADR-012 (`MediaAsset`), homepage Pulse plates  
**Do not:** download stock imagery, generate fake studio photos, invent member/transformation media, treat gradients as permanent proof, eager-load every slot, or add autoplay audio.

Temporary homepage plates remain **replaceable fallbacks** (`data-media-status="fallback"`). Layout structure must not change when real media arrives.

---

## Slot catalogue

| Content key | Preferred medium | Desktop AR | Mobile AR | Focal point | Alt (guideline) | Poster | Loading | Crop | Fallback | Provenance |
|---|---|---|---|---|---|---|---|---|---|---|
| `home.hero` | Video preferred; still photo OK | 16/9 | 16/9 (short height) | Subject mid-frame; faces upper-third | Coach-led session at Ankit’s Studio | Required if video | `priority` (LCP) | `object-fit: cover`; no letterbox | Gradient plate `strength` | Pending — owner |
| `home.differentiator` | Photograph | 16/9 | 16/9 | Machine-free floor / coach cue | Machine-free training floor | n/a | `lazy` | cover, center | Gradient plate `calm` | Pending — owner |
| `service.functional-training` | Photograph | 4/5 | 3/4 | Athlete + floor space | Functional training session | n/a | `lazy` | cover, focal | `strength` plate | Pending — owner |
| `service.yoga` | Photograph | 4/5 | 4/5 | Quiet room / breath posture | Yoga session at Ankit’s Studio | n/a | `lazy` | cover, soft center | `calm` plate | Pending — owner |
| `service.zumba` | Photograph or short muted loop | 4/5 | 3/4 | Group energy, faces readable | Zumba class at Ankit’s Studio | Required if video | `lazy` | cover, left-bias OK | `high-energy` plate | Pending — owner |
| `service.dance` | Photograph | 4/5 | 4/5 | Human technique, not nightclub | Adult dance class | n/a | `lazy` | cover | `high-energy` / brand hover tint | Pending — owner |
| `service.wedding-choreography` | Photograph | 4/5 | 4/5 | Warm, personal rehearsal | Wedding choreography rehearsal | n/a | `lazy` | cover | `warm` plate | Pending — owner |
| `service.home-personal-training` | Photograph | 4/5 | 3/4 | Home setting + coach (consented) | Home personal training session | n/a | `lazy` | cover | Neutral field plate | Pending — owner |
| `service.online-training` | Photograph or UI-free still | 16/9 | 16/9 | Coach on camera / simple setup | Online training session | n/a | `lazy` | contain or cover | Neutral field plate | Pending — owner |
| `branch.airoli` | Photograph | 16/9 | 3/2 | Exterior or entrance | Ankit’s Studio Airoli Sector 19 | n/a | `lazy` | cover | Field plate | Pending — address + photo |
| `branch.airoli-sector-8` | Photograph | 16/9 | 3/2 | Exterior or entrance | Ankit’s Studio Airoli Sector 8 | n/a | `lazy` | cover | Field plate | Pending — address + photo |
| `branch.ghansoli` | Photograph | 16/9 | 3/2 | Exterior or entrance | Ankit’s Studio Ghansoli | n/a | `lazy` | cover | Field plate | Pending — address + photo |
| `branch.thane` | Photograph | 16/9 | 3/2 | Exterior or entrance | Ankit’s Studio Thane | n/a | `lazy` | cover | Field plate | Pending — address + photo |
| `community.group` | Photograph | 16/9 | 3/2 | Consented group on floor | Group session at Ankit’s Studio | n/a | `lazy` | cover | Field plate | Pending — consent |
| `about.hero` | Photograph or muted video | 16/9 | 16/9 | Studio atmosphere mid-frame | Ankit’s Studio session atmosphere | Required if video | `priority` on About only | cover | `strength` plate | Pending — owner |
| `about.machine-free` | Photograph | 16/9 | 3/2 | Coach + floor, no gym machines | Machine-free Functional Training floor | n/a | `lazy` | cover | `calm` plate | Pending — owner |
| `about.community` | Photograph | 16/9 | 3/2 | Consented group energy | Group session community at Ankit’s Studio | n/a | `lazy` | cover | `warm` plate | Pending — consent |
| `about.team` | Photograph | 16/9 | 3/2 | Consented team group (no invented names in alt) | Ankit’s Studio coaching team | n/a | `lazy` | cover | `warm` plate | Pending — owner + consent |
| `about.disciplines` | Photograph sequence or single | 16/9 | 3/2 | Distinct movement modes readable | Multi-discipline activity at Ankit’s Studio | n/a | `lazy` | cover | `high-energy` plate | Pending — owner |
| `about.branches` | Photograph / collage later | 16/9 | 3/2 | Exterior or entrance; no invented street text | Neighbourhood branch exterior or interior | n/a | `lazy` | cover | Neutral field plate | Pending — address + photo |
| `trainers.coaching-action` | Photograph | 16/9 | 3/2 | Coach + member interaction (consented) | Coach-led session in progress | n/a | `lazy` | cover | `strength` plate | Pending — consent |
| `trainers.portrait` | Photograph | 4/5 | 3/4 | Face upper-third; natural light | Named trainer portrait | n/a | `lazy` | cover + focal | `warm` plate | **Inactive** until profile publishable (ADR-019) |

---

## Field definitions

For every slot:

| Field | Requirement |
|---|---|
| **Content key** | Stable string above; used in `data-media-slot` and content model |
| **Preferred medium** | `image` or `video` (muted, no autoplay audio) |
| **Desktop / mobile aspect** | Layout reserves these ratios; assets may be cropped to fit |
| **Focal-point support** | Prefer CSS `object-position` or future `MediaAsset` focal fields when added |
| **Alt text** | Descriptive, non-marketing hype; no fabricated outcomes |
| **Poster image** | Mandatory for video; still frame from the same shoot |
| **Loading priority** | Only `home.hero` uses `priority` / eager; all others lazy |
| **Crop behaviour** | Default `object-fit: cover`; online slot may `contain` if UI chrome must stay readable |
| **Fallback behaviour** | Keep current Pulse gradient plate + `data-media-status="fallback"` until verified asset ships |
| **Verification / provenance** | Must move to `verified` with owner consent before removing mock banner dependency for that asset |

---

## Implementation hooks

- Homepage plates: `PulseMediaPlate` with `slotKey`, `data-media-status="fallback"`, `data-mock-media="true"`.
- About plates: same pattern with `about.*` keys — do not describe fallbacks as real people or verified interiors.
- Trainers plates: `about.team` / `trainers.coaching-action` for team-level surfaces; `trainers.portrait` stays inactive until a profile passes the publishability gate (ADR-019). Never generate faces or stock trainers.
- Typed catalogue: `src/content/media-slots.ts` (keys + metadata only — no binary assets).
- Existing `MediaAsset` schema (`src` / `alt` / `width` / `height`) remains the runtime shape when assets arrive (ADR-012). Focal-point / poster may be extended later without changing homepage or About section order.

---

## Acceptance when media arrives

1. Swap plate → `next/image` or muted video without changing section sequence.  
2. Set `data-media-status="verified"` (or remove mock attributes).  
3. Confirm LCP still acceptable with only hero eager.  
4. Confirm reduced-motion: if hero is video, pause / show poster when `prefers-reduced-motion: reduce`.  
5. Do not invent captions that claim results, member counts, or unverified branch interiors.
