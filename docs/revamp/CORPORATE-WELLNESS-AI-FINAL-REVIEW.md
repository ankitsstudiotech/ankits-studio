# Corporate Wellness AI final review — 13 August 2026

Honest visual assessment after integrating the owner-supplied workplace wellness hero. Judged from rendered production UI (`next start`) plus `docs/revamp/screenshots/corporate-wellness-ai-final/` and the eight-programme family sheet.

**Asset classification:** `APPROVE_WITH_CROP` — landscape office session with left negative space and right-weighted subjects. Not rejected. Not a substitute from another programme.

Local preview screenshots include the mock-preview banner because `ALLOW_MOCK_PUBLISH=true`. That chrome is not a production deploy artefact.

---

1. **Does the image clearly communicate workplace wellness?** Yes. Coach-led group with resistance bands in an office-like interior, not a gym-floor class.

2. **Does it feel Indian/local rather than generic US corporate stock?** Yes. Adult participants read as Indian; wardrobe and space are contemporary office, not a US campus gym.

3. **Is anatomy believable?** Yes at display size. No collapsed limbs or extra joints flagged in the rendered crops.

4. **Are hands/bands believable?** Yes. Orange/red bands track with the lunges; hands are not the broken-finger AI tell from the missing-asset brief.

5. **Any fake text/logos?** No readable company names, fake UI, or award marks in the frame.

6. **Could it be mistaken for an actual client event?** It could be mistaken for documentary photography if someone ignored the footer disclosure. It is not labelled as an Ankit’s Studio session in alt text, and it does not show a named client or logo. Treat as illustrative only — which is the catalogue status.

7. **Is the image visually consistent with the other programme media?** Yes. Same cinematic low-key grade as Functional / Wedding / Home PT. It does not look like a bright stock cut-out.

8. **Is Corporate Wellness still compositionally distinct from Wedding?** Yes. Shared Service family, different variant: Corporate is a wide landscape B2B panel (`data-service-variant="corporate"`), Wedding stays ceremonial. Enquiry language vs couple rehearsal remains distinct.

9. **Does it still feel B2B rather than a consumer batch?** Yes. `FOR TEAMS` kicker, planning/availability copy, “Enquire about Corporate Wellness”, no free-trial hero CTA. Consumer sticky “WhatsApp trial” chrome still appears on this route (pre-existing site chrome, not introduced by this asset).

10. **Is mobile crop intentional?** Yes. Mobile aspect `4/3` with focal `70% 42%` — not `center center`. Coach and front participants stay in frame; some left interior remains as office context. Image is not a tall portrait.

11. **Is desktop negative space balanced?** Acceptable, not perfect. `3/2` cover crop at `64% 48%` keeps the group as the focus and trims the emptiest left third. A band of dark interior still sits on the left of the media panel; it blends with the field rather than reading as a unused page column.

12. **Does CTA remain obvious?** Yes. Desktop: left column, above the fold. Mobile: CTA stacks above the image, so the photo does not push conversion down.

13. **Did page height grow excessively?** No. Mobile hero is a `4/3` band (~233px at 390). Closing enquiry CTA and planning copy are unchanged.

14. **Did motion remain restrained?** Yes. Hero uses `reveal={false}`; motion tone stays `direct`. No Ken Burns, no extra GSAP.

15. **Any AI-slop signal?** Low. Cinematic grading is the catalogue house style. No fake signage, no extra fingers, no duplicated person spotted in the approved crops.

16. **Is the whole eight-programme family now media-complete?** Yes. Family sheet `programme-family-ai-production-comparison-final.png` shows Corporate with its own raster. TRAIN / MOVE / CELEBRATE / FOR TEAMS openings are not one template.

17. **Is this safe for production?** Yes as **illustrative-ai** with the existing global footer disclosure. Not verified-real. Not a named-client proof image.

---

## Trust-boundary regression

Unchanged:

- No AI founder portrait
- No named trainer portraits
- No branch-specific interiors
- No AI reviews
- No transformation evidence
- No fake certification/award content

## Performance (production, 390×844)

| Metric | Corporate Wellness |
|---|---|
| CLS | 0 |
| Overflow | 0px |
| H1 visible | yes |
| LCP | hero `img` via `/_next/image` (`programme-corporate-wellness-hero-ai-concept.webp`, w=828 q=75) |
| Served hero bytes | 29,060 |

Home and Functional CLS remained 0 with 0 overflow.

## P0 / P1

- **P0:** none
- **P1:** none for this media integration. Pre-existing sticky “Free trial / WhatsApp trial” on the B2B route is a conversion-chrome follow-up, not caused by the new asset. High-DPR `w=3840` optimizer stall was closed by capping `images.deviceSizes` at 1920.
