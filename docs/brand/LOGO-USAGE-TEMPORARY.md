# Temporary logo usage — Ankit’s Studio

**Source file:** `brand-source/ankits_studio_logo_high_resolution.pdf`  
(Task referred to `ankits-studio-logo-original.pdf`; this is the supplied official PDF.)

**Extracted:** 2026-08-01  
**Status:** Temporary web-ready crops only. A proper SVG or transparent master is still required from design/brand.

---

## Source

| Property | Value |
|---|---|
| Format | PDF, 1 page |
| Page size | 595.28 × 841.89 pt (A4 portrait) |
| Content | Full-colour vertical lockup on a **white field** |
| Lockup structure | Circular symbol → “ANKIT’S STUDIO” wordmark → “DANCE & FITNESS” descriptor |
| Sampled brand colours | Deep purple ≈ `#5A2E68` (wordmark / gradient dark); magenta ≈ `#9E4B7B` (gradient light). Darkest purple sample ≈ `#381C58` |

The PDF was **not** used directly on the website. It was rasterised at 4× matrix (~288 dpi equivalent) then cropped.

---

## Exports under `public/brand/`

| File | Role | Approx. dimensions |
|---|---|---|
| `ankits-studio-lockup-light.png` | Full lockup, white background | 1933 × 1352 |
| `ankits-studio-lockup-light.webp` | Same, WebP | 1933 × 1352 |
| `ankits-studio-lockup-light-480.webp` | Scaled lockup | ≤480 px wide |
| `ankits-studio-lockup-light-960.webp` | Scaled lockup | ≤960 px wide |
| `ankits-studio-lockup-light-1440.webp` | Scaled lockup | ≤1440 px wide |
| `ankits-studio-symbol.png` | Circular symbol crop | 875 × 875 |
| `ankits-studio-symbol.webp` | Circular symbol crop | 875 × 875 |
| `favicon-16.png` … `favicon-512.png` | Favicon candidates from symbol | 16 / 32 / 48 / 180 / 192 / 512 |

Reference render (not for production `<img>`): `docs/brand/_logo-source-render-reference.png`.

---

## Cropping

1. Rasterise PDF page at high resolution.
2. Detect non-white content bounding box; pad ~40 px.
3. Export **full lockup** (symbol + wordmark + descriptor) as light-surface asset.
4. Detect circular disc in the upper lockup; square-crop with small padding for **symbol-only**.
5. Downscale symbol for favicon candidates with Lanczos resampling.

**No redraw, auto-trace SVG, recolour, stretch, descriptor removal, monochrome invent, glow, or logo animation was applied.**

---

## Background behaviour

The official lockup lives on a **white field**. Transparent knockout was **not** forced: edge halos are likely around the purple/pink antialiased edges if chroma-keyed carelessly.

**Rule:** Prefer the tightly cropped **white-background** PNG/WebP on light surfaces. Do not place these assets on dark Studio Pulse fields without a white plate, inverted master (not yet supplied), or future transparent asset from brand.

---

## Where to use what

| Asset | Appropriate | Avoid |
|---|---|---|
| Full lockup | Light headers, about/brand moments, print-like footers on light surfaces, splash/intro | Dark field chrome without a light plate; sizes under ~120 px wide (descriptor illegible) |
| Symbol only | Compact/mobile header mark, favicons, app icons, small avatars | Replacing the full lockup in hero brand moments where the wordmark matters |
| Favicon candidates | `icon` / `apple-touch-icon` wiring after QA at 16–48 px | Using the full lockup as a favicon |

---

## Why a proper SVG / transparent master is still required

- Current assets are **raster** from a print PDF — soft edges and fixed resolution.
- No official transparent or dark-surface variant exists; inventing one would recolour/redraw the mark (forbidden here).
- Wordmark is a custom serif; SVG path fidelity needs a brand-supplied vector, not an auto-trace.
- Favicons at 16 px need a verified simplified mark if the dance-figure “a” fills in.

Until that master arrives, treat `public/brand/*` as **temporary integration assets** only — see `docs/brand/STUDIO-PULSE-LOGO-INTEGRATION.md` before changing production tokens or chrome.
