import type { VerifiedGooglePlace } from "./types";

/**
 * Officially verified Place IDs only.
 * Resolved 2026-08-17 via Places API (New) Text Search using owner-confirmed
 * name + address, then checked against production Maps CID listing URLs.
 * Do not invent IDs from unofficial finders or Maps HTML.
 */
export const VERIFIED_GOOGLE_PLACE_IDS: readonly VerifiedGooglePlace[] = [
  {
    branchSlug: "airoli-sector-19",
    branchLocality: "Airoli Sector 19",
    placeId: "ChIJ8cbuhKe_5zsRnlffZagyHhQ",
    displayName: "Ankit's Studio",
    formattedAddress:
      "Shop No.05, Besides Satu’s Sweets, Sector-19, Airoli, Navi Mumbai, Maharashtra 400708, India",
    googleMapsUri: "https://maps.google.com/?cid=1449651828904908702",
    confidence: "high",
    matchStatus: "verified",
  },
  {
    branchSlug: "airoli-sector-8",
    branchLocality: "Airoli Sector 8",
    placeId: "ChIJ471ri1e_5zsR7onUOyeK8LU",
    displayName: "Ankit’s Studio",
    formattedAddress:
      "sports Association, Swaraj Daffodils, Besides, Gothivali Village, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701, India",
    googleMapsUri: "https://maps.google.com/?cid=13110130416387656174",
    confidence: "high",
    matchStatus: "verified",
  },
  {
    branchSlug: "ghansoli",
    branchLocality: "Ghansoli",
    placeId: "ChIJyWp9rKXH5zsRvxE9mt5slNY",
    displayName: "Ankit’s Studio",
    formattedAddress:
      "Satyam Imperial, Bus Depot, Sec 11, opposite Sai baba mandir, Jijamata Nagar, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701, India",
    googleMapsUri: "https://maps.google.com/?cid=15462103123995988415",
    confidence: "high",
    matchStatus: "verified",
  },
  {
    branchSlug: "thane",
    branchLocality: "Thane",
    placeId: "ChIJ6cwFOYS55zsRoAWBQpoEv9M",
    displayName: "Ankit’s Studio",
    formattedAddress: "Edulji Rd, Dhobi Ali, Charai, Thane West, Thane, Maharashtra 400601, India",
    googleMapsUri: "https://maps.google.com/?cid=15257919123141756320",
    confidence: "high",
    matchStatus: "verified",
  },
];
