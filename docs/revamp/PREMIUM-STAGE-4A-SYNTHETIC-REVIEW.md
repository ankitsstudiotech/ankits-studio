# Premium Stage 4A Part 2 — Synthetic Concept Media Review

Temporary AI concept previews only. Flag-gated. Not for Vercel Production.

## Anti-AI-slop checklist

1. **Does the hero now feel more like a premium editorial campaign?**  
   Yes — desktop left text / right cinematic plane (~45–55% media), edge-reaching, no rounded card. Mobile keeps copy/CTA first with an attached controlled crop.

2. **Does any page look like a generic stock-photo template?**  
   No. Media is sparse: home hero + one community strengthen; programme heroes only; Functional adds one action image; About team warmth; Locations one atmosphere strip. No gallery stuffing.

3. **Do all programme heroes look mechanically identical?**  
   No. Tone-aware compose: structured (Functional), fluid (Zumba), calm (Yoga), expressive (Dance), ceremonial (Wedding), direct (Home PT), remote (Online). Spacing, alignment, and crop personality differ.

4. **Do media crops feel intentional at 390/768/1440/1920?**  
   Yes. Catalogue carries desktop / tablet / mobile focals. Locations uses a floor/plant strip to avoid residual wall emblem.

5. **Does any AI artefact draw attention?**  
   Online: crop biases away from generated laptop UI. Locations: emblem cropped out of the atmosphere strip. Remaining subjects read as anonymous concept figures.

6. **Does any image visually imply it is a real branch/trainer/member?**  
   No. Alts and labels state concept preview. Branch detail pages stay text-led. Founder remains text-led. No trainer portraits.

7. **Does media compete with Stage 3 motion?**  
   No. Stage 3 H1/MaskedLines remain primary; MediaReveal is one-shot (~1.015→1.0 on heroes). No Ken Burns / parallax loops.

8. **Does mobile feel too image-heavy?**  
   No. Hero media sits after CTA at ~168–200px; community is one section strengthen; programme heroes stack without becoming a photo feed.

9. **Did page length materially regress?**  
   No new sections. Community and Functional action fold into existing bands. Atmosphere is a short strip, not a new narrative block.

10. **Which synthetic slots should be rejected before real-media replacement?**  
    - Keep for art-direction prototyping: home.hero, programme heroes (Functional/Zumba/Yoga/Dance/Wedding), home.community, about.community, Functional action.  
    - Caution until real assets: wedding (client implication risk), online (fake UI risk — crop helps), locations.atmosphere (was emblem-risky; now floor-crop only — still first to replace with real branch photography).  
    - Never synthetic: founder, trainers, branch heroes, testimonials, transformations, reviews, credentials.

## Safety

- `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` default false.
- Development marker: unobtrusive “AI concept preview”.
- Flag false: zero synthetic assets, zero markers, text-led fallback intact.

## Evidence

- Screenshots: `docs/revamp/screenshots/premium-stage-4a-synthetic-integration/`
- Motion: `docs/revamp/motion/premium-stage-4a-synthetic-integration/`
- Perf JSON: `perf-flag-true.json` / `perf-flag-false.json` in the screenshot directory

## Verdict

Accept for local/preview art-direction prototyping only. Do not deploy with the flag enabled.
