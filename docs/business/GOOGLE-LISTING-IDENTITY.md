# Google listing identity

**Date:** 2026-08-03  
**Method:** Owner-confirmed Maps short URLs from central branch content only  
**Not used:** HTML scraping, browser automation against Google Maps, unofficial Place ID guessers, third-party directories  
**Credentials available in this audit:** None (no Places API key, no GBP OAuth)

---

## Owner-confirmed Maps URLs (source of truth)

From `src/content/mock/branches.ts` (2026-08-03 owner intake):

| Branch | Owner Maps URL |
|---|---|
| Airoli Sector 19 | `https://maps.app.goo.gl/JowoDwXZUVqiFfWC6?g_st=ic` |
| Airoli Sector 8 | `https://maps.app.goo.gl/7zLudwn1c6RUZZWUA?g_st=ic` |
| Ghansoli | `https://maps.app.goo.gl/fvGjyZ51AtHBBQAT7?g_st=ic` |
| Thane | `https://maps.app.goo.gl/bzzHhBbu5qg5J1pHA?g_st=ic` |

**Important:** A Maps short URL is an outbound deep link. It is **not**:

- A Google Business Profile management URL  
- A stable Place ID  
- A guaranteed review-source URI  
- Proof that the listing name matches “Ankit’s Studio” without Place Details verification  

`googleBusinessProfileUrl` remains `null` on all four branch records.

---

## Resolution table

| Branch | Owner Maps URL | Listing matched | Place ID | Review availability | Confidence | Blocker |
|---|---|---|---|---|---|---|
| Airoli Sector 19 | `…/JowoDwXZUVqiFfWC6?g_st=ic` | Not verified in this audit | **Unresolved** | Unknown | Low | Official Place ID lookup requires Maps Platform credentials (Place ID Finder / Place Details / Find Place) |
| Airoli Sector 8 | `…/7zLudwn1c6RUZZWUA?g_st=ic` | Not verified in this audit | **Unresolved** | Unknown | Low | Same |
| Ghansoli | `…/fvGjyZ51AtHBBQAT7?g_st=ic` | Not verified in this audit | **Unresolved** | Unknown | Low | Same |
| Thane | `…/bzzHhBbu5qg5J1pHA?g_st=ic` | Not verified in this audit | **Unresolved** | Unknown | Low | Same |

**Place IDs resolved in this task: 0 of 4.**

---

## Official setup required to resolve identity

Do **not** scrape short-link redirects or Maps HTML.

### Recommended official path (Places API)

1. Create a Google Cloud project with billing enabled.  
2. Enable **Places API (New)**.  
3. Create an API key restricted to Places / HTTP referrers (server key preferred for Place Details).  
4. For each branch, use an official method to obtain `place_id`, for example:  
   - [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) (Maps JavaScript + Places) operated by a studio operator, or  
   - Place Details / Text Search / Text Place with a field mask that includes `id` / `displayName` / `formattedAddress` / `googleMapsUri`  
5. Visually confirm returned `displayName` + `formattedAddress` against owner-confirmed printable address.  
6. Store **only** the Place ID (and optional operator notes) in content — Place IDs may be cached indefinitely per [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies).  
7. Do **not** persist review text, ratings aggregates, or author PII as permanent CMS records if that would violate caching restrictions; prefer runtime retrieval.

### Alternative / complementary path (Business Profile)

1. Ankit (or a manager) signs in to Google Business Profile for each verified location.  
2. Confirm ownership of the four listings and whether duplicates exist.  
3. Capture the GBP location resource names for API use (`accounts/{accountId}/locations/{locationId}`).  
4. Supply direct Business Profile / review management URLs for `googleBusinessProfileUrl` fields (distinct from Maps short links).

---

## Ambiguity checks (to run after credentials)

For each Place ID / GBP location, record:

- Exact listing name vs “Ankit’s Studio”  
- Address match vs owner-confirmed postal line  
- Whether reviews exist (`userRatingCount` / GBP `totalReviewCount`)  
- Duplicate or similarly named listings nearby  
- Whether the Maps short URL resolves to the same Place ID as the GBP location  
- Direct `googleMapsUri` for the place and per-review `googleMapsUri` when using Places

---

## Business Profile ownership access

| Need | Required? |
|---|---|
| Outbound “Open in Google Maps” links | No — already have owner short URLs |
| Places API Place Details (public reviews, max 5 relevance-sorted) | API key + billing; **ownership not required** |
| Full review corpus, reply management, exact GBP identity | **Yes** — Ankit (or manager) OAuth with `business.manage` / `plus.business.manage` |

---

## Status

Listing identity remains **blocked on credentials and owner confirmation**. Do not invent Place IDs or claim review counts until resolved through official APIs or GBP admin UI screenshots supplied by Ankit without scraping.
