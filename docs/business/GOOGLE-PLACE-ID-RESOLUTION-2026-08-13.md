# Google Place ID resolution — 2026-08-13

**Method:** Official Places API (New) Text Search only, when a server-side `GOOGLE_PLACES_API_KEY` is present.  
**Not used:** Maps HTML scraping, unofficial Place ID websites, browser DOM extraction, third-party widgets.

**Credential:** `GOOGLE_PLACES_API_KEY` is **missing** in local env files, `.env.example` (documented as optional), `src/lib/env.ts`, and this workspace. No `NEXT_PUBLIC_GOOGLE_*` review key is configured (correct — a public key must not be used).

Without an official key, Place IDs cannot be resolved. Unresolved branches are left unresolved. No IDs were invented.

Owner-confirmed printable addresses and Maps URLs are from `src/content/mock/branches.ts` (2026-08-12 owner form), not from the older short links in `GOOGLE-LISTING-IDENTITY.md`.

| Branch | Owner address | Place ID | Returned name | Returned address | Match status | Confidence | Maps URI |
|---|---|---|---|---|---|---|---|
| Airoli Sector 19 | Shop No. 05, Beside Bank of Maharashtra, Sector 19, Airoli, Navi Mumbai, Maharashtra 400708 | Unresolved | — | — | unresolved | n/a | Owner Maps: `https://maps.app.goo.gl/75pmKFuezsCSd5JP8` |
| Airoli Sector 8 | Swaraj Daffodils, Beside Airoli Sports Association, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701 | Unresolved | — | — | unresolved | n/a | Owner Maps: `https://maps.app.goo.gl/1J1KpmeYWsoWkckr6` |
| Ghansoli | Satyam Imperial, Opposite Sai Baba Mandir, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701 | Unresolved | — | — | unresolved | n/a | Owner Maps: `https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9` |
| Thane | Edulji Road, Dhobi Ali, Charai, Opposite Awaaz Radio, Thane, Maharashtra 400601 | Unresolved | — | — | unresolved | n/a | Owner Maps: `https://maps.app.goo.gl/6tQTXnrur5iggfJ6A` |

**Place IDs resolved: 0 of 4.**

`src/lib/google-reviews/place-ids.ts` stores only verified IDs and is empty until official resolution succeeds.

## Owner action required to resolve

1. Create a Google Cloud project with billing.  
2. Enable **Places API (New)**.  
3. Create a **server** API key restricted to Places API (New).  
4. Set `GOOGLE_PLACES_API_KEY` in the hosting environment (never `NEXT_PUBLIC_*`).  
5. Re-run official Text Search with business name + owner printable address; confirm `displayName`, `formattedAddress`, and `googleMapsUri` before persisting each Place ID.
