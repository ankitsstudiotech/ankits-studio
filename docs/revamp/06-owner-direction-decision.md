# Owner direction decision — Studio Pulse

**Date:** 2026-08-01  
**Branch context:** `revamp/studio-pulse-production`  
**Status:** Active — production redesign must follow Studio Pulse, not the agent-selected Kinetic Editorial direction.

This document does **not** rewrite historical evaluation scores. The original scored recommendation remains in `docs/revamp/04-prototype-evaluation.md`.

---

## Original agent recommendation

**Kinetic Editorial (Direction A)** — `/design-lab/revamp-a`

Weighted score in `04-prototype-evaluation.md`: **82.7** (highest of the three).

Agent rationale (preserved, not restated as current production choice): strongest brand distinctiveness without gym-bro / spa / kids-school / SaaS adjacency; programme index vs card grids; sparse purpose-led motion.

---

## Owner-selected direction

**Studio Pulse (Direction B)** — `/design-lab/revamp-b`

Weighted historical score: **75.7** (second). Owner selection **overrides** the agent recommendation for production implementation.

### Why the owner selected Studio Pulse

- Prefers its **rhythm-led visual energy**
- Layered media and movement better express **Zumba, dance, and active training**
- Feels more **emotionally engaging** than the more restrained alternatives
- Owner wants to present this **complete direction to Ankit first**

---

## Risks identified (from original evaluation — still valid)

From `04-prototype-evaluation.md` and skill critique:

- Condensed all-caps + near-black + coral/volt can skew toward **boutique HIIT / nightlife fitness**
- Risk of **bodybuilding-club adjacency** for a multi-discipline neighbourhood studio that includes kids dance and yoga
- Beat equalizer / multi-lane tempo motion can read as decorative gadgetry or raise a11y cost
- Parents scanning for kids dance + branch trust get less calm hierarchy if every band stays loud
- Branch “nodes” weaker than place-first geographic discovery

---

## Mitigations required during production

Production Studio Pulse **must not** make every section dark, loud, aggressive, or high-tempo.

Required **tempo zones**:

| Zone | Use for | Visual / motion posture |
|---|---|---|
| High-energy | Zumba, adult dance, active training moments | Darker fields, coral/volt accents, stronger motion (still interruptible; reduced-motion safe) |
| Strength | Strength & personal training | Structured, confident, denser type; controlled energy — not nightclub |
| Calm | Yoga, recovery-oriented content | Spacious, quieter surfaces, slower/held motion or static |
| Community / family | Kids dance, families, neighbourhood trust | Warm, human, readable; avoid aggressive tempo chrome |
| Utility | Booking, contact, timetable, pricing | Calm, direct, high clarity; minimal theatrical motion |

Additional rules:

- Represent strength, PT, yoga, Zumba, adult dance, kids dance, and community in **one coherent brand**
- Hard reduced-motion paths for all pulse/tempo animations (emil-design-eng)
- Do not invent unverified business facts to “sell” energy
- Preserve mock/verified honesty chrome
- A and C remain frozen alternatives — see below

---

## Status of Directions A and C

| Direction | Route | Status |
|---|---|---|
| A — Kinetic Editorial | `/design-lab/revamp-a` | **Preserved** historical concept + frozen visual artefact |
| B — Studio Pulse | `/design-lab/revamp-b` | **Owner-selected** production direction (prototype remains frozen baseline) |
| C — Movement System | `/design-lab/revamp-c` | **Preserved** historical concept + frozen visual artefact |

### Preservation rule (mandatory)

- Do **not** delete Routes A or C
- Do **not** silently restyle A or C to match production Studio Pulse
- Do **not** alter `04-prototype-evaluation.md` scores to pretend B originally won
- Prototype visual implementation may be duplicated/frozen under `src/components/design-lab/**` so production token changes cannot mutate historical artefacts
- Shared dependency allowed: centralised **content accessors** only (`@/content`) — not production UI tokens, cards, buttons, or nav chrome

Kinetic Editorial documentation snapshot (agent-era proposed system): `docs/revamp/KINETIC-EDITORIAL-DESIGN-SYSTEM.md`.

---

## Related docs

- Evaluation (unchanged scores): `docs/revamp/04-prototype-evaluation.md`
- Art directions: `docs/revamp/03-art-directions.md`
- Production rebuild plan (Studio Pulse mapping): `docs/revamp/05-production-rebuild-plan.md`
- ADR: `docs/DECISIONS.md` — ADR-014
