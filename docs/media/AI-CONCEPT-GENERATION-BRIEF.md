# AI Concept Generation Brief

**Stage:** 4A Part 1 — briefs only; **do not generate images in-repo**  
**Policy:** `SYNTHETIC-MEDIA-PREVIEW-POLICY.md`  
**Art direction:** `PREMIUM-MEDIA-ART-DIRECTION.md`

Pass this document to an external image workflow. Output files land under `public/media/synthetic-preview/` in Stage 4A Part 2.

Global negatives for every slot:

> No logos, no text, no watermarks, no neon cyberpunk, no purple disco lighting, no giant gym machines, no luxury mega-club interiors, no bodybuilder physiques, no plastic skin, no everyone looking at camera, no before/after, no identifiable Indian landmark claiming to be a named Ankit’s Studio branch, no readable signage.

---

## SLOT: `home.hero`

**FILE:** `home-hero-ai-concept.webp`  
**KIND:** image (poster for future video)  
**ORIENTATION:** landscape  
**ASPECT:** desktop 16:9 · mobile crop 4:5 from right-weighted subject cluster  

**SUBJECT:** Mixed adult group (3–5 people) mid functional / dance-floor movement — anonymous neighbourhood adults, varied body types, realistic fitness.  

**ENVIRONMENT:** Compact modern neighbourhood movement studio — open floor, mats, modest mirror edge, warm window light. Indian urban studio scale.  

**COMPOSITION:** Subjects weighted **right**; left third calmer / darker for type overlay safety.  

**CAMERA:** ~35mm documentary / editorial; slight depth; eye-level.  

**LIGHT:** Warm natural sidelight; soft falloff; premium dark grade.  

**WARDROBE:** Simple athletic wear — muted neutrals, one restrained accent. No branded logos.  

**MOTION IMPLICATION:** Mid-phrase energy, not posed smile lineup.  

**AVOID:** Machines, text, logos, giant rooms, purple glow, influencer poses.  

**FOCAL:** desktop `{x:68,y:42}` · mobile `{x:72,y:38}`  

**REPLACEMENT:** P0  

---

## SLOT: `home.community`

**FILE:** `home-community-ai-concept.webp`  
**ASPECT:** 16:9 / 3:2  

**SUBJECT:** Small group finishing or gathering after a session — warmth, conversation energy, anonymous.  

**ENVIRONMENT:** Same compact studio vocabulary.  

**COMPOSITION:** Horizontal group; faces not sharp identity portraits.  

**LIGHT / CAMERA:** Softer; 50mm feel; editorial.  

**AVOID:** Party lighting, drinks, staged “team cheer” cliché.  

**FOCAL:** `{x:50,y:45}` · mobile `{x:55,y:40}` · **P1**

---

## SLOT: `programme.functional.hero`

**FILE:** `programme-functional-hero-ai-concept.webp`  
**ASPECT:** 4:5 / 3:4 · **tone:** structured  

**SUBJECT:** One or two adults in decisive functional movement (hinge, carry, or floor-based strength) — coach-adjacent energy without inventing a named trainer.  

**COMPOSITION:** Clear rectangular crop; subject in strong vertical.  

**LIGHT:** Crisp sidelight; assertive contrast.  

**FOCAL:** `{x:55,y:40}` · **P0**

---

## SLOT: `programme.functional.action`

**FILE:** `programme-functional-action-ai-concept.webp`  
**ASPECT:** 16:9 / 3:2 · secondary beat · **P1**

**SUBJECT:** Wider action beat — feet / floor / mats in motion.  

---

## SLOT: `programme.zumba.hero`

**FILE:** `programme-zumba-hero-ai-concept.webp`  
**ASPECT:** 16:9 / 3:2 · **tone:** fluid  

**SUBJECT:** Group rhythmic movement — joyful, not nightclub.  

**COMPOSITION:** Wider movement crop; staggered depth.  

**LIGHT:** Lively but warm; no neon.  

**FOCAL:** `{x:60,y:45}` · **P0**

---

## SLOT: `programme.yoga.hero`

**FILE:** `programme-yoga-hero-ai-concept.webp`  
**ASPECT:** 4:5 · **tone:** calm  

**SUBJECT:** Breath-led pose or transition; calm adult; soft focus background.  

**COMPOSITION:** Extra breathing room; softer crop relationship.  

**LIGHT:** Soft window light; low contrast.  

**FOCAL:** `{x:48,y:42}` · **P0**

---

## SLOT: `programme.dance.hero`

**FILE:** `programme-dance-hero-ai-concept.webp`  
**ASPECT:** 4:5 / 3:4 · **tone:** expressive  

**SUBJECT:** Adult dance phrase mid-extension; refined energy.  

**COMPOSITION:** May feel slightly freer across vertical; still editorial.  

**FOCAL:** `{x:58,y:38}` · **P0**

---

## SLOT: `programme.wedding.hero`

**FILE:** `programme-wedding-hero-ai-concept.webp`  
**ASPECT:** 4:5 · **tone:** ceremonial  

**SUBJECT:** Rehearsal-like couple or small group practicing steps — warm, elegant, not wedding photography of a real event.  

**LIGHT:** Warmer grade; gentle highlight.  

**FOCAL:** `{x:52,y:40}` · **P0**

---

## SLOT: `programme.home-pt.hero`

**FILE:** `programme-home-pt-hero-ai-concept.webp`  
**ASPECT:** 4:5 / 3:4 · **tone:** direct  

**SUBJECT:** Coach-led movement in a modest home living space — Indian apartment realism.  

**AVOID:** Luxury penthouse gym.  

**FOCAL:** `{x:50,y:42}` · **P1**

---

## SLOT: `programme.online.hero`

**FILE:** `programme-online-hero-ai-concept.webp`  
**ASPECT:** 16:9 · **tone:** remote  

**SUBJECT:** Adult following a session near a laptop / phone — honest remote coaching context.  

**COMPOSITION:** Compact; not fake “Zoom UI” chrome.  

**FOCAL:** `{x:45,y:48}` · **P1**

---

## SLOT: `about.community`

**FILE:** `about-community-ai-concept.webp`  
**ASPECT:** 16:9 / 3:2  

**SUBJECT:** Community warmth — group in studio, anonymous.  

**FOCAL:** `{x:50,y:44}` · **P1**

---

## SLOT: `locations.atmosphere`

**FILE:** `locations-atmosphere-ai-concept.webp`  
**ASPECT:** 16:9 / 3:2  

**SUBJECT:** Conceptual studio texture — empty floor corner, mats, light on wall. **No people required.**  

**CRITICAL:** Must not read as a specific Airoli / Ghansoli / Thane branch. No exterior street that could be geo-claimed.  

**FOCAL:** `{x:50,y:50}` · **P2**

---

## DO NOT GENERATE (verified-real-only)

| Slot | Reason |
|---|---|
| `about.founder` | Real Ankit portrait only |
| `location.*.hero` (per branch) | Real branch photography only |
| Trainer / member / transformation / review slots | Real consent + verification only |

---

## Delivery checklist (external workflow)

- [ ] WebP (or AVIF) under 300KB where practical for heroes  
- [ ] No embedded text  
- [ ] Anonymous subjects  
- [ ] Filenames match this brief  
- [ ] Manifest entries use `status: synthetic-preview`, `source: ai-concept`
