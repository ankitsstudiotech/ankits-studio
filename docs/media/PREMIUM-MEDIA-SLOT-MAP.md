# Premium Media Slot Map

**Stage:** 4A Part 1 — high-value slots only  
**Policy:** `SYNTHETIC-MEDIA-PREVIEW-POLICY.md`  
**Art direction:** `PREMIUM-MEDIA-ART-DIRECTION.md`

Do not invent dozens of images. Initial high-value slots:

---

## HOME

### `home.hero`

| Field | Spec |
|---|---|
| Purpose | Immediate emotional proof of movement / energy |
| Desktop aspect | ~16:9 (editorial window; ~45–55% of hero canvas) |
| Mobile aspect | ~4:5 or 16:9 block in narrative flow |
| Crop | Cover; subjects weighted **right** on desktop so headline owns left |
| Text-safe zone | Left ~40–50% relatively calm / darker |
| Motion | Hero media reveal (subtle scale 1.02→1.00 once). No constant Ken Burns |
| Colour / contrast | Dark-grade friendly; text remains on field, not over busy midtones |
| Replacement priority | **P0** |
| Synthetic allowed | Yes (flagged) |
| Geometry preview (4A-1) | Yes when flag on |

### `home.community`

| Field | Spec |
|---|---|
| Purpose | Group / community energy below fold |
| Desktop / mobile | 16:9 / 3:2 horizontal |
| Crop | Cover; faces anonymous; mid-ground group |
| Motion | Section reveal |
| Replacement priority | **P1** |
| Synthetic allowed | Yes |

---

## PROGRAMMES

| Slot | Purpose | Desktop | Mobile | Motion | Priority | Tone cue |
|---|---|---|---|---|---|---|
| `programme.functional.hero` | Decisive training energy | 4:5 | 3:4 | Hero reveal | P0 | structured |
| `programme.functional.action` | Secondary action beat | 16:9 | 3:2 | Section | P1 | structured |
| `programme.zumba.hero` | Rhythmic group motion | 16:9 | 3:2 | Hero reveal | P0 | fluid |
| `programme.yoga.hero` | Calm breath-led stillness | 4:5 | 4:5 | Soft hero reveal | P0 | calm |
| `programme.dance.hero` | Expressive adult dance | 4:5 | 3:4 | Hero reveal | P0 | expressive |
| `programme.wedding.hero` | Ceremonial rehearsal warmth | 4:5 | 4:5 | Soft hero reveal | P0 | ceremonial |
| `programme.home-pt.hero` | Compact home coaching | 4:5 | 3:4 | Direct reveal | P1 | direct |
| `programme.online.hero` | Remote session honesty | 16:9 | 16:9 | Compact reveal | P1 | remote |

Composition variants are **metadata-driven** (same template), not seven page templates.

---

## ABOUT

### `about.community`

| Field | Spec |
|---|---|
| Purpose | Human warmth on About |
| Aspect | 16:9 / 3:2 |
| Motion | Section reveal |
| Priority | P1 |
| Synthetic allowed | Yes |

### `about.founder`

| Field | Spec |
|---|---|
| Purpose | Founder portrait — Ankit Nalawade |
| Status until real | `fallback` |
| Synthetic allowed | **Never** (`verified-real-only`) |
| Priority | P0 when owner portrait arrives |

---

## LOCATIONS

### `locations.atmosphere`

| Field | Spec |
|---|---|
| Purpose | **Generic** conceptual studio texture only |
| Aspect | 16:9 / 3:2 |
| Motion | Section reveal |
| Priority | P2 |
| Synthetic allowed | Yes |
| Constraint | Must **not** be labelled as Airoli / Ghansoli / Thane |

### Branch-specific (model only — remain fallback)

| Slot | Status | Synthetic |
|---|---|---|
| `location.airoli-sector-19.hero` | fallback | **Never** |
| `location.airoli-sector-8.hero` | fallback | **Never** |
| `location.ghansoli.hero` | fallback | **Never** |
| `location.thane.hero` | fallback | **Never** |

Branch detail pages stay text-led until verified owner media.

---

## Alias notes

Legacy catalogue keys in `src/content/media-slots.ts` (e.g. `service.yoga`, `branch.*`) remain for compatibility. Premium Stage 4A resolvers prefer the keys above and map programmes via slug helpers.
