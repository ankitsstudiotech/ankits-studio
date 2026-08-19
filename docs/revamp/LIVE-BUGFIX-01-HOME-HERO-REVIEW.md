# Live Bugfix 01 — Homepage hero review

Checkpoint: `studio-pulse-before-live-bugfix-01-home-hero` @ `ab0646f`.
Production compared: https://ankits-studio.vercel.app (`studio-pulse-v1.2.0-owner-final`).

Evidence: `docs/revamp/screenshots/live-bugfix-01-home-hero/`.

## Human visual questions

1. **Is the duplicate brand gone?**  
   Yes. The in-hero lockup (`heroBrand` + logo image + brand name) was removed from `Hero.tsx`, not CSS-hidden. Header still carries logo + ANKIT'S STUDIO. DOM check: `section[aria-labelledby='home-hero-title'] .hero-brand-motion` count is 0.

2. **Is the header still correctly branded?**  
   Yes. Global header logo (`ankits-studio-symbol-transparent`) and display name are unchanged.

3. **Does the hero image now blend into the dark composition?**  
   Yes on desktop. Media is full-bleed behind the copy field, with a CSS mask (left transparent → opaque) plus a dark-to-transparent overlay. It is no longer a separate grid column.

4. **Is there still a visible hard vertical seam?**  
   The previous grid-column rectangle edge is gone. A soft left-to-right dissolve remains so copy stays readable. Gym windows on the right still read as photography, not a pasted card.

5. **Is image subject visibility preserved?**  
   Yes. Focal point stays `72% 50%`. Primary kettlebell subject sits in the opaque right half, not under the H1.

6. **Is H1 still the dominant element?**  
   Yes. After lockup removal, H1 is the first hero content. Three editorial MaskedLines. Stage 3 line choreography preserved.

7. **Is H1 now consistent with the overall type system?**  
   Yes. Home H1 now uses `--text-hero` (same token as `.pulse-title` / About / Programmes / Functional / Locations / Pricing). Computed sizes match those routes at 390 / 768 / 1440.

8. **Does the homepage still feel more important without being oversized?**  
   Yes. Same physical size as other openings; Home still reads as the marketing hero because of three-line editorial setting, media, and CTA pairing — not a private clamp.

9. **Are line breaks intentional at all widths?**  
   Yes. Source lines are `Coach-led fitness,` / `yoga, Zumba and` / `dance.` Desktop mask lines are `nowrap` so the first line does not split. Checked 360–1920 in overflow gate; no clipping.

10. **Does mobile still read correctly?**  
    Yes. Stack remains H1 → copy → CTAs → 200px reserved crop. Duplicate lockup absent. Top-edge mask + fade so the photo is not a bordered card. H1 starts naturally under the header (no empty lockup hole).

11. **Any dead space created by removing the lockup?**  
    No. Copy stays `justify-content: center` inside the existing hero min-height. Mobile padding is the existing compact stack (`1.1rem` gutter).

12. **Any contrast/readability regression?**  
    No. Left-side field overlay keeps H1/copy on dark. Subjects remain on the brighter right. Body still uses `--text-body-lg` on `--color-muted-on-field`.

13. **Any motion regression?**  
    No. `#home-hero-title` MaskedLines + first-line visible pending / later-line soft rise unchanged. Support copy is not animated (LCP). Brand entrance CSS remains for programme kickers only.

14. **Any CLS regression?**  
    No layout-dimension animation. Desktop media is absolutely positioned in a reserved `min-height: min(78vh, 720px)` hero. Mobile crop stays 200px before decode.

15. **Is this objectively better than deployed V1.2?**  
    Yes. Duplicate brand is gone, Home type joins the shared scale, and the hero media belongs to one composition instead of a pasted rectangle.

## Computed H1 (Home)

| Width | Before (live V1.2) | After (`--text-hero`) |
|---|---|---|
| 390 | 37.6px / 36.848px lh | 40px / 36px lh |
| 768 | 53.76px / 52.685px lh | 49.28px / 44.352px lh |
| 1440 | 76px / 74.48px lh | 72px / 64.8px lh |

Family, weight, tracking, and uppercase match About/Programmes at all three widths after the fix.

## Acceptance

PASS against the hard list in the live-bugfix-01 brief, pending production deploy verification in this same change.
