# Homepage critique resolution — Studio Pulse

**Date:** 2026-08-02  
**Direction:** Studio Pulse retained (not a new art direction)  
**Inputs:** Impeccable critique `2026-08-01T15-34-04Z`, owner data migration 2026-08-01, logo integration Option B  

Frozen prototypes `/design-lab/revamp-a|b|c` were **not** modified.

---

## Critique findings → changes

| Finding | Change | Why | Skill | Verification |
|---|---|---|---|---|
| P0 — Meta “Utility zone…” and hero process disclaimers | Removed utility jargon; hero has no verification/process copy; honesty stays in mock banner + footer | Customers should not read design-system notes | impeccable clarify | Grep homepage: no “Utility zone”, “TEMPO”, “HIT/HOLD/GROOVE” |
| P1 — Section bloat (timetable, evidence, voices, slogan triad) | Distilled to hero → services → differentiator → branches → practical → trial → short FAQ | Restore Pulse punch; no fake proof | impeccable distill | Page sequence matches Phase 3 |
| P1 — Equal tempo lanes / EQ gadgetry | Confirmed services only; per-service tempo CSS + selective beats (Zumba/Dance only) | Mitigate HIIT-club flattening | design-taste + emil | Yoga/home/online have no equalizer |
| P1 — Mobile first-viewport | Copy+CTA before media; single media plate; shorter hero stack | Brand + offering visible at 390 | impeccable adapt | Mobile CSS `heroCopy` order 0 |
| P1 — Jargon (TEMPO LANES, BRANCH NODES, Beat EQ) | Plain titles: “Choose how you want…”, “Find your nearest studio” | Neighbourhood-studio language | design-taste | User-facing strings |
| Warning≈CTA coral collision | Action → `#6B2F7A` / hover `#9E4B7B`; warning amber `#E5A100` | Logo integration Option B | impeccable colorize | tokens.css + MockModeIndicator |
| Multiple equal CTAs | Hero WhatsApp + final climax + restrained sticky; form secondary | Conversion hierarchy | emil / product | SiteChrome + FreeTrialCta |
| Boutique HIIT skew | Tempo/tone zones: calm yoga, warm wedding, practical home/online, structured functional | Pulse energy without nightclub-only read | design-taste | Service `data-tempo` variants |
| Mock timetable theatre | No slot table; honest “batches throughout the day” copy | Hours ≠ batch rows | product honesty | `#practical` band |
| Weak brand in hero | Official symbol on white plate + display name | Logo usage temporary rules | brand docs | Hero + SiteHeader |

---

## Final homepage sequence

1. Hero (brand, offering, four studios, WhatsApp + Find studio)  
2. Confirmed service discovery (7 owner services, differentiated)  
3. Machine-free / coach-led differentiator  
4. Four-branch discovery  
5. Practical information band  
6. WhatsApp free-trial climax  
7. Short factual FAQ  
8. Footer (shell)

### Removed from homepage
- Illustrative timetable preview / dense slots  
- Transformation / “honest evidence” band  
- Placeholder testimonials / voices  
- Community slogan triad (“ONE FLOOR…”)  
- BeatStrip / HIT·HOLD·GROOVE labels  
- Dual layered REPLACE media stack on mobile  
- Hero mock-disclaimer under lede  

### Retained (Pulse)
- Dark field + Bebas / Space Grotesk  
- Sharp geometry, Volt focus rings  
- Client motion islands only where purposeful  
- SSR primary copy  

---

## Motion storyboard (updated)

| Component | Purpose | Trigger | Properties | Duration | Easing | Mobile | Reduced motion |
|---|---|---|---|---|---|---|---|
| `PulseCta` | Press feedback on conversion | pointer tap | `scale` 1→0.96 | spring ~120ms feel | spring 500/24 | same | static (no scale) |
| `ServiceLane` (zumba/dance) | Express higher tempo without labels | mount | `scaleX` on 5 bars | 0.45–0.5s + stagger 40ms | easeOut | bars hidden | static bar widths |
| `ServiceLane` hover | Hierarchy on pointer devices | hover | `x` 3–6px | spring | spring 420/30 | none (no hover) | disabled |
| `ServiceLane` (yoga/home/online/functional/wedding) | Calm/practical/structured | — | no beat animation | — | — | mark line only | n/a |
| Hero / FAQ / utility | Reading | — | none | — | — | — | n/a |

### Motion removed
- Hero `BeatStrip` (decorative EQ)  
- Equalizer on every programme lane  
- Generic fade-up section reveals  
- Dual rotating media layer animation (simplified to one plate)  
- Non-interruptible entrance hides on H1  

### Motion retained and why
- CTA tap spring — confirms press without delaying content  
- Zumba/Dance beat bars — only where higher tempo is the product story  
- Lane hover translate — optional enhancement; full link without hover  

---

## Action colour decision

**Adopted Option B** from `docs/brand/STUDIO-PULSE-LOGO-INTEGRATION.md`:

- Action `#6B2F7A`  
- Hover `#9E4B7B`  
- Warning `#E5A100` (mock banner)  
- Volt retained for focus / high-energy accents, not CTA fill  

---

## Logo treatment

- Header: 32px symbol on white plate + wordmark text  
- Hero: 48px symbol on white plate + “Ankit’s Studio”  
- Full lockup not forced into compact chrome (per temporary usage doc)  
- No glow, recolour, or SVG auto-trace  

---

## Remaining limitations

- Real studio photography still pending (gradient plates remain placeholders, without “REPLACE” theatre labels)  
- Sector 8 Maps/address still pending  
- Programme fee tables and batch timetable still unpublished  
- Legacy programme routes still exist off-homepage (taxonomy pending)  
- Sticky CTA + mock banner still share vertical space on small phones — mitigated by shorter hero, not eliminated while mock mode is on  
