# Homepage motion storyboard — Studio Pulse production

Source skills: **emil-design-eng**. Reference: frozen `/design-lab/revamp-b`.  
Rule: every animation must state purpose; otherwise delete.

| Component | Purpose | Trigger | Properties | Duration | Easing | Mobile adaptation | Reduced-motion alternative |
|---|---|---|---|---|---|---|---|
| `BeatStrip` | Express room tempo in hero without hiding copy | Mount | `scaleY` on bars | 0.4–0.72s staggered | `easeOut` | Same; shorter viewport | Static bars at final heights |
| `TempoLane` beat marks | Show programme family tempo (HIT/HOLD/GROOVE) | Mount | `scaleX`, origin left | Family: 0.35 / 1.1 / 0.55s | `easeOut` | Full-width lane; beats under copy | Static filled bars |
| `TempoLane` hover/press | Affordance that lane is interactive | Pointer / tap | `x: 6`, `scale: 0.985` | Spring 420/28 | Spring | Hover optional; tap retained | No transform; focus ring only |
| `PulseCta` press | Immediate conversion feedback | Tap / click | `scale: 0.94` | Spring 500/22 | Spring | Full-width friendly | No scale; colour change via CSS `:active` if needed |
| Nav underline grow | Link affordance (shell) | Hover / focus | `background-size` | `--duration-fast` (~150ms) | standard | Hidden on mobile drawer | Instant / none |
| Mobile menu icon | Open/close state | Toggle | `transform` / opacity on bars | `--duration-fast` | standard | Mobile only | Instant snap |
| Sticky / header CTA | Press feedback | Active | `scale: 0.98` | fast | standard | Sticky mobile | `motion-reduce: scale-100` |

## Explicitly not used on homepage

| Rejected pattern | Why removed |
|---|---|
| `ScrollReveal` / `.motion-reveal` on every section | No narrative purpose; AI-slop parade |
| `TextReveal` on headings | Hides/softens primary reading |
| Card lift shadows | Soft-chrome language rejected |
| Hero opacity entrance on H1 | Must remain immediately readable |
| Scroll hijack / intro loader / parallax / custom cursor / WebGL | Out of budget and product constraints |

## Performance notes

- Animate **transform** only on beat/lane/CTA islands
- Cap concurrent lane mounts to programme count (≤7)
- Client islands: `PulseMotion.tsx` only; page remains server-rendered
- Art-directed CSS media plates — no heavy image decode on first paint
