# Studio Pulse homepage review

Reviews against frozen `/design-lab/revamp-b`, `DESIGN.md`, and PRODUCT.md.  
Skills applied separately: **design-taste-frontend**, **impeccable**, **emil-design-eng**.

Screenshots: `docs/revamp/screenshots/studio-pulse-homepage/`

---

## design-taste-frontend

**Matches prototype:** Dark field hero, layered media plates, Bebas display, tempo lanes (not cards), branch nodes, coral pulse CTA, beat strip.

**Deliberate production deviations:**
- Utility timetable band (light) inserted for conversion/SEO job “check timings”
- Honest evidence + voices sections with provenance (not in minimal prototype)
- FAQ retained for trust/SEO
- Identity mock disclaimer under hero lede
- Branch nodes show `dataStatus` flags

**Remaining AI-slop risks:** Secondary routes still cascade new tokens onto old Section/card layouts (out of scope). Homepage itself avoids centred SaaS stack, equal cards, soft shadows, fade-ups.

**Corrections made during build:** Removed ScrollReveal from homepage path; deleted TrustStrip/Founder from `/`; flattened Card/Button shadows globally.

---

## impeccable

**Conversion clarity:** Single strong trial band + header/sticky CTAs; secondary “Browse programmes”. Timetable entry is calm utility.

**Mobile:** Crop-over-type hero stack; lanes become full-width; sticky coral CTA retained.

**Accessibility:** Skip link; focus rings on field use volt; drawer Escape/trap preserved; H1 always visible; reduced-motion storyboard covered.

**Findings / limits:** Secondary page chrome is Pulse but inner content not yet tempo-zoned (known). Long programme names wrap in lanes — OK.

---

## emil-design-eng

**Motion quality:** Purpose-led islands only (see `08-homepage-motion-storyboard.md`). Interruptible springs. No `transition: all`. No scroll-reveal parade.

**Corrections:** Hero title not animated away; beat/lane reduced-motion static paths.

---

## Where production matches Revamp B

| Prototype | Production |
|---|---|
| Pulse nav energy | Field header + underline links |
| Layered hero | `Hero` + `PulseMediaPlate` layers |
| Beat strip | `BeatStrip` |
| Tempo lanes | `TempoLane` / `ProgrammeShowcase` |
| Community story | `WhyStudio` |
| Branch nodes | `BranchExplorer` |
| Pulse CTA | `FreeTrialCta` / `PulseCta` |

## Mismatches / known limitations

- Production adds utility timetable, evidence, voices, FAQ (required product jobs)
- Real photography still absent — CSS mock media
- Programme/location **detail** routes not redesigned this pass
- Design-lab incumbent component review still uses LabShell + old fixtures partially
- Frozen A/B/C untouched

---

## Test / build

Recorded at commit time of homepage pass — see final report.
