# Synthetic Preview Media — Final QA

Purpose: temporary visual/art-direction prototyping only. These files are not evidence of Ankit's Studio, its branches, trainers, members, reviews, or transformations.

## Final decisions

| Slot | Decision | Priority | Integration note |
|---|---|---:|---|
| `home.hero` | **ACCEPT** | P0 | Strongest asset. Clear dark negative space on left; movement weighted right; no text/signage. |
| `home.community` | **ACCEPT** | P1 | Useful as a single community/coach-led proof concept; do not create a new section just for it. |
| `programme.functional.hero` | **ACCEPT** | P0 | Strong functional-training concept. Keep crop focused on body movement/ropes. |
| `programme.functional.action` | **ACCEPT** | P1 | Secondary action image only. Never turn Functional page into a gallery. |
| `programme.zumba.hero` | **ACCEPT** | P0 | Energetic and human. Preserve faces/hands; avoid aggressive crop. |
| `programme.yoga.hero` | **ACCEPT** | P0 | Calm and believable. Use more breathing space than Zumba/Dance. |
| `programme.dance.hero` | **ACCEPT** | P0 | Expressive but still editorial. Keep full arm gesture visible when possible. |
| `programme.wedding.hero` | **ACCEPT_WITH_CAUTION** | P0 | Use strictly as choreography/rehearsal concept preview. Do not imply the people are real clients. |
| `programme.home-pt.hero` | **ACCEPT** | P1 | Clear home-training context. Keep wording explicit that coverage is confirmed on enquiry. |
| `programme.online.hero` | **ACCEPT_WITH_CAUTION** | P1 | Keep laptop UI secondary and unreadable; image is conceptual remote-training atmosphere only. |
| `about.community` | **ACCEPT** | P1 | Community/team atmosphere only. Never label anyone as Ankit or a named trainer. |
| `locations.atmosphere` | **ACCEPT_WITH_CAUTION** | P2 | Generic atmosphere only. Never associate with a specific branch. Residual synthetic wall detail was intentionally softened. |

## Hard restrictions

- Keep `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` by default and in Vercel Production.
- Never use synthetic imagery in founder, trainer, branch-specific, testimonial, transformation, review-author, or credential-proof slots.
- Never present `locations.atmosphere` as a specific Airoli/Ghansoli/Thane studio.
- Never identify synthetic people as Ankit, a named coach, or a real customer.
- Every rendered concept asset must carry `status: synthetic-preview` in the data model.
- Development preview must show a discreet `AI concept preview` marker.

## Art-direction verdict

The set is coherent enough for layout/motion prototyping: warm cinematic grading, realistic neighbourhood-scale environments, Indian subjects, and distinct programme moods. It is intentionally temporary. Real owner-approved media should replace it in Stage 4B.

## Replacement order when Ankit sends real assets

1. `home.hero`
2. all four real branch heroes (currently synthetic forbidden)
3. Functional / Zumba / Yoga / Dance / Wedding programme heroes
4. founder portrait (real-only)
5. community/team imagery
6. Home PT / Online
7. member stories / testimonials