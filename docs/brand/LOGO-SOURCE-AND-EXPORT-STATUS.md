# Logo source and export status

**Updated:** 2026-08-03 (owner-data round 2)  
**Official editable source:** `brand-source/Ankit Studio logo.cdr final.cdr.zip`  
**Prior temporary source:** `brand-source/ankits_studio_logo_high_resolution.pdf` (see `LOGO-USAGE-TEMPORARY.md`)

---

## Provenance

| Field | Value |
|---|---|
| sourceType | owner-supplied brand file |
| sourceName | Ankit Nalawade |
| sourceDate | 2026-08-03 |
| verificationLevel | official editable source (CDR package) |

Treat the CDR zip as the official CorelDRAW document package. Do not auto-trace previews, redraw the wordmark, change the icon, change the descriptor, recolour, stretch, or claim any SVG is official unless exported directly from CorelDRAW.

---

## Environment check (2026-08-03)

| Tool | Available in agent environment? |
|---|---|
| CorelDRAW | No |
| Compatible professional CDR importer / vector exporter | No |
| Inkscape | Not found on PATH |
| ImageMagick | Not found on PATH |

**Conclusion:** Reliable official vector export is **not** available in this environment.

---

## Actions taken

1. Preserved `brand-source/Ankit Studio logo.cdr final.cdr.zip` unchanged.
2. Did **not** auto-trace embedded previews.
3. Did **not** replace production `public/brand/*` temporary assets.
4. Did **not** claim temporary PNG/WebP assets are official vector exports.
5. Discarded local inspect extracts (`brand-source/_cdr-inspect/`) from version control — inspect artefacts only.

---

## Production branding

Continue using the approved temporary web assets documented in `docs/brand/LOGO-USAGE-TEMPORARY.md` and integrated per `docs/brand/STUDIO-PULSE-LOGO-INTEGRATION.md`.

Studio Pulse layout and logo proportions remain unchanged.

---

## Manual export required (owner / design)

Open the CDR source in CorelDRAW (or a verified professional importer that preserves vectors and text) and export:

| Asset | Format / notes |
|---|---|
| Full lockup | SVG + transparent PNG @ 1× / 2× / 4× |
| Symbol only | SVG + transparent PNG @ 1× / 2× / 4× |
| Favicon set | PNG sizes matching current favicon ladder |
| Social / profile square | Transparent or brand-safe square |

### Verify before swapping production assets

- Wordmark spelling and apostrophe (`Ankit’s`)
- Descriptor `Dance & Fitness`
- Proportions vs current temporary lockup
- Font outlines / gradients / transparency
- No clipping, no white halo on intended transparent masters
- Small-size legibility (favicon / sticky bar)

Only then integrate without changing Studio Pulse composition, and keep accessible contrast.

---

## Status summary

| Item | Status |
|---|---|
| Official CDR source preserved | Yes |
| Official SVG / transparent PNG from CDR | **Blocked** — needs CorelDRAW export |
| Temporary web assets remain in production | Yes |
| Temporary assets labelled “official vector” | No |
