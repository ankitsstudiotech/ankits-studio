# Google Reviews integration — production

**Date:** 2026-08-17  
**Checkpoint:** `studio-pulse-before-google-reviews-production` @ `7413078a15abee014383ea0f807301a5e74ff96c`  
**API:** Places API (New) Place Details  
**Credential:** server-only `GOOGLE_PLACES_API_KEY` (never `NEXT_PUBLIC_*`)

Official URLs checked before implementation:

- [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Place data fields (New)](https://developers.google.com/maps/documentation/places/web-service/data-fields)
- [Choose fields / FieldMask](https://developers.google.com/maps/documentation/places/web-service/choose-fields)
- [REST `places` resource / Review object](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places)
- [Places API policies and attribution](https://developers.google.com/maps/documentation/places/web-service/policies)
- [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)

No Maps HTML scraping, unofficial Place ID finders, or stored review copies.

## Four verified Place IDs

Resolved with Places API (New) Text Search using owner-confirmed business name + printable address. Each result was accepted only when:

1. `displayName` matched Ankit’s Studio (not a generic “Ankit” hit)
2. `formattedAddress` matched that branch’s locality (Sector 19 vs Sector 8 vs Ghansoli vs Thane)
3. `googleMapsUri` CID matched the already production-verified listing URL in `src/content/maps-place-listing.ts`

| Branch | Place ID | Google displayName | Google formattedAddress | CID (matches production listing) |
|---|---|---|---|---|
| Airoli Sector 19 | `ChIJ8cbuhKe_5zsRnlffZagyHhQ` | Ankit's Studio | Shop No.05, Besides Satu’s Sweets, Sector-19, Airoli, Navi Mumbai, Maharashtra 400708, India | `1449651828904908702` |
| Airoli Sector 8 | `ChIJ471ri1e_5zsR7onUOyeK8LU` | Ankit’s Studio | sports Association, Swaraj Daffodils, Besides, Gothivali Village, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701, India | `13110130416387656174` |
| Ghansoli | `ChIJyWp9rKXH5zsRvxE9mt5slNY` | Ankit’s Studio | Satyam Imperial, Bus Depot, Sec 11, opposite Sai baba mandir, Jijamata Nagar, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701, India | `15462103123995988415` |
| Thane | `ChIJ6cwFOYS55zsRoAWBQpoEv9M` | Ankit’s Studio | Edulji Rd, Dhobi Ali, Charai, Thane West, Thane, Maharashtra 400601, India | `15257919123141756320` |

Place IDs are stored as durable identifiers in `src/lib/google-reviews/place-ids.ts` and as `googlePlaceId` on each branch record. Owner Maps short URLs and CID listing hrefs are unchanged.

## Requested field mask

Place Details (New) GET `https://places.googleapis.com/v1/places/{PLACE_ID}`

Headers: `X-Goog-Api-Key`, `X-Goog-FieldMask` (never `*`, never query-string key):

```
id,displayName,formattedAddress,googleMapsUri,rating,userRatingCount,reviews.name,reviews.relativePublishTimeDescription,reviews.text,reviews.originalText,reviews.rating,reviews.authorAttribution,reviews.publishTime,reviews.googleMapsUri,reviews.flagContentUri
```

## API-request architecture

- Server-only: `src/lib/google-reviews/places-provider.ts` + `provider.ts`
- Homepage calls `getGoogleSocialProof()` once
- `connection()` on the homepage opts out of static HTML that would bake Google review content
- Fetch uses `cache: "no-store"` and a 4s `AbortSignal.timeout`
- Maximum **4** Place Details calls (one per verified branch), in parallel
- Text Search is used only for Place ID resolution, not on page render

## Caching / storage compliance

Google policy: do not pre-fetch, cache, or store Places content except Place IDs.

Decision:

- Place IDs stored indefinitely (allowed exception)
- Review text, names, avatars, ratings, and counts are **not** written to git, JSON, a database, localStorage, or ISR snapshots
- No build-time generation of review fixtures
- Runtime fetch is `cache: "no-store"`; homepage uses `connection()` so Next cannot serve a long-lived static copy of Google review content
- Homepage route is dynamic (`ƒ /`)

The rail uses native overflow + scroll-snap. `contain: paint` on the rail wrapper prevents Chromium from counting the scroller’s content width as document overflow.

`reviews-partial-failure.png` records the **View on Google** row treatment used when a branch has no usable API reviews. In this environment all four Place Details calls succeeded, so the live page does not show that row; the screenshot is the same component used by the full missing-key fallback. Partial-failure selection is covered by unit tests.

## Selection / filtering rule

Google’s default relevance order is preserved.

For each verified branch: reviews with usable text + author display name + individual `googleMapsUri` → **first 2 only**.

- Maximum 8 cards
- Rating is display data only and is not used to select, sort, or drop reviews
- Empty text is skipped; nothing is invented
- UI disclosure (compact metadata, not body copy): “Shown in Google relevance order · up to 2 per studio.”

## Attribution

- Author avatar, display name, and profile URI when Google returns them
- No generated initials or fake avatars
- Individual source link uses the review’s `googleMapsUri`: **View review on Google Maps** (`target="_blank"` `rel="noopener noreferrer"`)
- Google Maps text attribution (`translate="no"`, Roboto/sans, 12sp-class, white on the plum field) per Places policies for content shown without an embedded map
- `flagContentUri` shown as **Report review** when returned

## Error / fallback

- Missing key, zero Place IDs, or zero usable reviews globally → existing **Reviews on Google** four-row **View on Google** fallback
- One failed branch does not drop the others; that branch keeps **View on Google**
- No visitor-facing status, quota, or Place ID errors
- Homepage never fails because Google is slow or down

## Request-count / cost control

Instrumentation: `getPlaceDetailsRequestCount()` / `resetPlaceDetailsRequestCount()`. Tests assert 4 calls and no `key=` query string.

## Privacy / terms

- Privacy: live reviews are fetched server-side; reviewer photos may load from Google; Google’s Privacy Policy applies; reviews are not stored
- Terms: Google Maps content is subject to the Google Maps / Google Earth Additional Terms of Service

## Structured data

Unchanged. No `Review` or `AggregateRating` JSON-LD.

## Probe (counts only — no review text stored)

| Branch | rating | userRatingCount | API reviews returned | usable text | displayed |
|---|---|---|---|---|---|
| Airoli Sector 19 | 4.9 | 195 | 5 | 5 | 2 |
| Airoli Sector 8 | 4.9 | 172 | 5 | 5 | 2 |
| Ghansoli | 4.7 | 88 | 5 | 5 | 2 |
| Thane | 5 | 12 | 5 | 5 | 2 |
