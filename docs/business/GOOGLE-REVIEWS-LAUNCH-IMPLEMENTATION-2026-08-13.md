# Google Reviews launch implementation — 2026-08-13

Launch-safe Google social proof for Ankit’s Studio. No scraping. No third-party widgets. No review text stored as CMS.

## Source strategy

**V1 source:** Google Places API (New) Place Details, server-side only, when both a key and verified Place IDs exist.

**GBP / Business Profile API:** out of V1. Future operational tooling for full review corpus, owner replies, and review management — not required to launch.

**Launch mode without credentials:** `external-links` — owner-confirmed Maps URLs, no quotes/stars/counts.

## Credential availability

| Secret | Status |
|---|---|
| `GOOGLE_PLACES_API_KEY` | **Missing** |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Must never be used; ignored if set |
| GBP OAuth | Not configured (correct for V1) |

Missing credential: **`GOOGLE_PLACES_API_KEY`** (server-only Places API (New) key).

## Resolved Place IDs

See [GOOGLE-PLACE-ID-RESOLUTION-2026-08-13.md](./GOOGLE-PLACE-ID-RESOLUTION-2026-08-13.md).

**0 of 4 branches resolved.** No live API review content.

## Review-selection algorithm (when live)

For each verified branch, take the **first usable text review** from Google’s default relevance-sorted Place Details `reviews` array.

Usable means: non-empty review text, author display name, numeric rating, and review-level `googleMapsUri`.

- Maximum 1 displayed review per branch  
- Maximum 4 homepage reviews  
- No 5-star-only filter, keyword search, or manual favourites  
- Empty text is skipped; no handwritten substitute  

## Ordering / filtering disclosure

Live mode shows a restrained notice, for example:

- Four studios: “One text review per studio is shown from Google’s relevance-sorted results.”  
- Fewer: “Reviews shown are selected from Google’s relevance-sorted results. They are not displayed chronologically.”

Fallback mode does not claim relevance-sorted review display; it invites the visitor to Google.

## Attribution behaviour

Live reviews (Places content without an embedded map):

- Official **Google Maps** text attribution (`translate="no"`, Roboto/body sans, `#5E5E5E`, 12sp-class size) per [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies)  
- Author name, profile link, and Google-provided avatar when present  
- No generated initials when Google supplied a photo; no avatar invented when Google did not  
- No AI reviewer portraits  

Fallback (no Places content on-page): Google Maps logo/text lockup is not required because review text is not displayed. Branch rows use truthful **View on Google**.

## Individual review source-link treatment

Live: each review’s Google-provided `googleMapsUri` is linked as **View on Google Maps** (`target="_blank"` `rel="noopener noreferrer"`).

Fallback: owner Maps URL labelled **View on Google** — not “Read reviews”, because a generic Maps short link is not a guaranteed review-tab URI.

## Cache / storage behaviour

- Place IDs may be stored (none stored yet).  
- Review text, names, avatars, ratings, and timestamps are **not** written to git or static JSON.  
- Place Details fetch uses `cache: "no-store"`.  
- No database.  

## Failure fallback

API failure, quota, missing key, unresolved Place ID, or no usable reviews → homepage still renders. Proof mode becomes `external-links` (or `unavailable` only if Maps URLs are also missing). No visitor-facing error, spinner, or empty card shell.

## Structured data

Unchanged conservative strategy. No `Review` or `AggregateRating` on Organization, ExerciseGym, LocalBusiness, or WebPage.

## Homepage placement and visual treatment

Hero → Programmes → Branches (PAPER) → **Google Reviews (continues PAPER)** → Founder (FIELD) → Free Trial → FAQ → Footer.

Editorial rail, not four SaaS testimonial cards. No carousel.

## Branch pages

Keep existing **Open in Google Maps**. No fake “Read reviews” tab. No repeated review cards. Live rating/count on branch pages is reserved for when Place Details returns them.

## GBP future option

If Ankit later needs full review management, configure Google Business Profile API OAuth separately. That is operational tooling, not a homepage availability dependency.

## Privacy

Server-side Places fetch introduces no Google client script or cookie. Fallback loads no Google avatars. Privacy policy notes that live reviewer photos, if shown, may load from Google’s servers.
