# Homepage motion storyboard — Studio Pulse production

Source skills: **emil-design-eng**. Reference: frozen `/design-lab/revamp-b` (visual energy only).  
Critique resolution: `docs/revamp/10-homepage-critique-resolution.md`.  
Rule: every animation must state purpose; otherwise delete.

| Component | Purpose | Trigger | Properties | Duration | Easing | Mobile | Reduced motion |
|---|---|---|---|---|---|---|---|
| `PulseCta` | Conversion press feedback | Tap | `scale` → 0.96 | spring | stiffness 500 / damping 24 | same | no scale |
| `ServiceLane` (zumba, dance) | Higher-tempo product story without jargon labels | Mount | `scaleX` on 5 bars | 0.45–0.5s + 40ms stagger | easeOut | bars hidden | static widths |
| `ServiceLane` hover | Optional affordance | Hover | `x` 3–6px | spring 420/30 | spring | n/a | disabled |
| `ServiceLane` (yoga, home, online, functional, wedding) | Calm / practical / structured read | — | static mark line only | — | — | same | n/a |
| Nav underline | Link affordance (shell) | Hover / focus | `background-size` | `--duration-fast` | standard | drawer | none |
| Mobile menu icon | Open/close | Toggle | transform / opacity | fast | standard | mobile | instant |
| Sticky CTA | Press feedback | Active | `scale` 0.98 | fast | standard | sticky | `motion-reduce:scale-100` |

## Explicitly removed (critique resolution)

| Pattern | Why |
|---|---|
| Hero `BeatStrip` / EQ | Decorative; nightclub gadgetry |
| HIT / HOLD / GROOVE labels | Design jargon |
| Equalizer on every lane | Equal treatment; calm/kids inappropriate |
| `ScrollReveal` parade | AI-slop; delays reading |
| Dual rotating hero media layers on mobile | Crush first viewport |
| H1 opacity entrance | Must be immediately readable |

## Performance notes

- Transform-only on CTA / selective lane islands  
- ≤7 service mounts; only 2 animate beats  
- Client island: `PulseMotion.tsx`; page SSR  
- Placeholder media plates — no heavy decode on first paint  
