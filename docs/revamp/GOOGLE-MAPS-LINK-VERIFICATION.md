# Google Maps link verification

Checkpoint: `studio-pulse-before-production-bug-batch-03-global-sweep` @ `ff079ca`.

## Root cause

Owner-confirmed `maps.app.goo.gl` short URLs in `src/content/mock/branches.ts` are stored correctly and were rendered **without** query rewriting.

Following those short URLs (HTTP 302) lands on Google’s **`/maps/dir/`** navigation experience for three branches (empty or inferred origin). Thane already 302s to `/maps/place/`.

That is why “Open in Maps” did not open the studio listing.

Older intake short URLs (`JowoDwXZ…`, `g_st=ic`, etc.) were **not** restored.

## Owner-confirmed source URLs (content, unchanged)

| Branch | Source owner URL |
|---|---|
| Airoli Sector 19 | `https://maps.app.goo.gl/75pmKFuezsCSd5JP8` |
| Airoli Sector 8 | `https://maps.app.goo.gl/1J1KpmeYWsoWkckr6` |
| Ghansoli | `https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9` |
| Thane | `https://maps.app.goo.gl/6tQTXnrur5iggfJ6A` |

## Public href (place listing for the same destination)

`getBranchMapsUrl` now returns the place `cid` encoded in that same short-link destination:

| Branch | Public href |
|---|---|
| Airoli Sector 19 | `https://www.google.com/maps?cid=1449651828904908702` |
| Airoli Sector 8 | `https://www.google.com/maps?cid=13110130416387656174` |
| Ghansoli | `https://www.google.com/maps?cid=15462103123995988415` |
| Thane | `https://www.google.com/maps?cid=15257919123141756320` |

No `origin`, `destination`, `travelmode`, or `dir_action=navigate` is appended.

## Rendered hrefs by surface

All four branches, every surface: **same public href**, `target="_blank"`, `rel="noopener noreferrer"`.

| Branch | Home | `/locations` | Branch page | Contact | Reviews fallback | Exact match to owner short URL | Place listing |
|---|---|---|---|---|---|---|---|
| Airoli Sector 19 | cid above | cid above | cid above | cid above | cid above | **no** (short URL 302s to `/dir/`) | **yes** |
| Airoli Sector 8 | cid above | cid above | cid above | cid above | cid above | **no** | **yes** |
| Ghansoli | cid above | cid above | cid above | cid above | cid above | **no** | **yes** |
| Thane | cid above | cid above | cid above | cid above | cid above | **no** | **yes** |

Reviews fallback label remains **View on Google** (not “Read reviews”, not “Directions”).

`hasMap` in LocalBusiness JSON-LD uses the same public place href.

## External links

| Surface | Result |
|---|---|
| Google Maps | Place listing; blank + noopener noreferrer |
| Instagram | Unchanged owner URL; blank + noopener noreferrer |
| YouTube | Unchanged owner URL; blank + noopener noreferrer |
| javascript:/localhost/debug | None found |
