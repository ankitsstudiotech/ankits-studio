/**
 * Owner-confirmed `maps.app.goo.gl` short URLs currently 302 to Google's
 * `/maps/dir/` navigation experience (empty or inferred origin).
 *
 * Public "Open in Maps" actions must open that same studio listing as a
 * place destination — not Directions. CIDs below are the destination
 * encoded in those same owner short-link redirects. They are not
 * resurrected older intake URLs and not invented Place IDs.
 */

export const OWNER_CONFIRMED_MAPS_SHORT_URLS = {
  "airoli-sector-19": "https://maps.app.goo.gl/75pmKFuezsCSd5JP8",
  "airoli-sector-8": "https://maps.app.goo.gl/1J1KpmeYWsoWkckr6",
  ghansoli: "https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9",
  thane: "https://maps.app.goo.gl/6tQTXnrur5iggfJ6A",
} as const;

export const OWNER_MAPS_PLACE_LISTING_HREFS = {
  "airoli-sector-19": "https://www.google.com/maps?cid=1449651828904908702",
  "airoli-sector-8": "https://www.google.com/maps?cid=13110130416387656174",
  ghansoli: "https://www.google.com/maps?cid=15462103123995988415",
  thane: "https://www.google.com/maps?cid=15257919123141756320",
} as const;

const SHORT_TO_PLACE: Record<string, string> = Object.fromEntries(
  (Object.keys(OWNER_CONFIRMED_MAPS_SHORT_URLS) as Array<keyof typeof OWNER_CONFIRMED_MAPS_SHORT_URLS>).map(
    (slug) => [OWNER_CONFIRMED_MAPS_SHORT_URLS[slug], OWNER_MAPS_PLACE_LISTING_HREFS[slug]],
  ),
);

export function normalizeMapsOwnerUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/** Place-listing href for an owner short URL; unknown URLs pass through. */
export function toMapsPlaceListingHref(ownerUrl: string): string {
  return SHORT_TO_PLACE[normalizeMapsOwnerUrl(ownerUrl)] ?? ownerUrl;
}

export function isMapsDirectionsHref(href: string): boolean {
  return (
    /google\.[^/]+\/maps\/dir\//i.test(href) ||
    /[?&](destination|origin|travelmode|dir_action)=/i.test(href)
  );
}
