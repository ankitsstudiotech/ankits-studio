# Live Bugfix 02 — Visual review

Checkpoint: `studio-pulse-before-live-bugfix-02-layout-system` @ `b60e85d`.
Evidence: `docs/revamp/screenshots/live-bugfix-02-layout-system/`.
Local after captures include the Next.js mock-preview banner because `next dev` sets `ALLOW_MOCK_PUBLISH`. Production must not.

Measured at 1440 Home programme row: grid `834px / 417px` (8/4 of `--layout-content` 1280px), meta “All branches” at x=1275, cue `38×3px`. Branches `rgb(20,20,22)`, Reviews `rgb(22,18,24)`. Overflow 0 at 390 / 768 / 1024 / 1440 / 1920.

## Human visual questions

1. **Does Programmes still leave an unexplained empty right 50% at 1440?**  
   No. Rows are 1280px (`--layout-content`) centered with 80px side gutters. Copy 8fr / meta 4fr.

2. **At 1920?**  
   No unexplained half-page void. Same 1280px content column, centered (320px field each side). That is container framing, not a stranded tablet rail.

3. **Do programme rows use desktop width intentionally?**  
   Yes. Title + description left, delivery meta right, structural rule the full content width.

4. **Is paragraph line length still readable?**  
   Yes. Descriptions stay `max-width: 52ch`. Ledes stay `~65ch`. Not stretched to 80rem.

5. **Can a visitor distinguish structural dividers from accent cues?**  
   Yes. Long 1px `rgba(255,255,255,0.14)` hairline = structure. Short 38×3px coloured line = cue. Zumba/Dance keep extra short segments as personality, not as the row rule.

6. **Are structural dividers consistent?**  
   Yes in the audited families: programme rows, home branches, Google review rows, location index items. Same token, solid, full grid width.

7. **Are branch dividers consistent?**  
   Yes. Home and `/locations` use the same structural token and inset. Actions sit in the 4fr column at `>=1200px`. Cue on the branch row is the short grey personality line, not a dashed structure.

8. **Any unexplained dashed lines?**  
   No structural dashes remain on public marketing routes. Remaining `border-dashed` is placeholder media frames (empty-state photography), not row separators.

9. **Do Branches still look like a separate white website?**  
   No. Full-bleed elevated charcoal `--color-field-raised` (`#141416`).

10. **Do Google Reviews links still look like a separate white website?**  
    No. Full-bleed plum `--color-field-plum` (`#161218`), two-column layout.

11. **Is dark-surface hierarchy still visually rich?**  
    Yes. Field / raised charcoal / plum / purple conversion band. Not one flat black.

12. **Are utility forms still usable?**  
    Yes. Trial / pricing / contact / batch inputs remain light controls inside dark `.pulse-form-panel`. Not darkened.

13. **Any giant empty desktop fields elsewhere?**  
    Legal pages keep a reading measure (`72ch`) by design. Pricing FAQ bands stay `--width-container-narrow`. Conversion split bands use `--layout-content`. No remaining 42–54rem left-rail programme/branch rows.

14. **Any content stretched excessively merely to fill space?**  
    No. Titles span the copy column; body stays measured; meta is short right rail.

15. **Does whitespace now look intentional?**  
    Yes. Side field frames the 80rem grid. Interior 8/4 gap is occupied by meta/actions, not empty.

16. **Did mobile regress?**  
    No. 390 stacked, no overflow, no 12-col squeeze. Cues remain short. Branches/Reviews stay dark.

17. **Did tablet regress?**  
    No. 768 and 1024 stay one-column rows (split starts at 1200px) so metadata is not pinched.

18. **Did programme personality motion survive?**  
    Yes. Cue animation is still `scaleX` by tone (fluid segments, ceremonial `cueFine`). Structural rules are static. Reduced motion: cues rest at `scaleX(1)`.

19. **Does the whole site now look more cohesive?**  
    Yes. One container, one divider token, dark-first marketing chapters.

20. **Any P0/P1 remaining from this defect family?**  
    P0 = 0. P1 = 0 for unused half-page, inconsistent structural rules, dashed structure, and pale marketing slabs.

## PAPER / light-surface classification

| Use | Verdict | Why |
|---|---|---|
| Home `paperBand` (Branches) | CHANGE | Was full-width `--surface-paper`. Now elevated charcoal. Class name kept for tests. |
| Home `googleProof` | CHANGE | Was paper. Now plum elevation. |
| `.pulse-paper` utility class | KEEP | Token reserved; not used as a marketing band. |
| `--color-paper` / `--surface-paper` tokens | KEEP | Needed for any remaining utility islands. |
| Trial / pricing / contact / timetable **inputs** | KEEP | Light controls for contrast. |
| `.pulse-form-panel` | KEEP | Dark chrome around light fields. |
| Legal pages | KEEP | Dark field + measured prose. Not paper slabs. |
| Location `.utility` | KEEP unused | Class exists; LocationDiscovery uses `.field`. |
| Design-lab revamp A/B/C | Out of scope | Not public marketing. |
| Placeholder dashed media frames | KEEP | Empty-state, not structure. |

## Skills applied

- **design-taste-frontend:** preserve-mode redesign; page theme lock (no mid-scroll invert); unused desktop space treated as a defect, not gallery whitespace.
- **impeccable:** refinement preserves incumbent Studio Pulse identity; layout command only; no replacement visual world.
- **emil-design-eng:** structural vs decorative; animate `transform` (`scaleX`) not cue `width`; do not animate structural dividers; reduced-motion rest state.
- **visual-qa-gate:** before/after screenshots at 390 / 1440 / 1920; unused space, unexpected light sections, divider consistency closed as P1s with evidence.
