import {
  PLACES_DETAILS_FIELD_MASK,
  PLACES_REQUEST_TIMEOUT_MS,
  type PlacesPlaceDetails,
} from "./types";
import { logGoogleReviewsDiagnostic } from "./log";

const PLACE_DETAILS_ENDPOINT = "https://places.googleapis.com/v1/places";

export type PlacesFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

let placeDetailsRequestCount = 0;

export function resetPlaceDetailsRequestCount(): void {
  placeDetailsRequestCount = 0;
}

export function getPlaceDetailsRequestCount(): number {
  return placeDetailsRequestCount;
}

export async function fetchPlaceDetails(options: {
  placeId: string;
  apiKey: string;
  fetchImpl?: PlacesFetch;
  timeoutMs?: number;
}): Promise<PlacesPlaceDetails | null> {
  const {
    placeId,
    apiKey,
    fetchImpl = fetch,
    timeoutMs = PLACES_REQUEST_TIMEOUT_MS,
  } = options;
  const url = `${PLACE_DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}`;
  placeDetailsRequestCount += 1;

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACES_DETAILS_FIELD_MASK,
      },
    });

    if (!response.ok) {
      logGoogleReviewsDiagnostic("Place Details request failed", {
        status: response.status,
        placeIdPresent: Boolean(placeId),
      });
      return null;
    }

    return (await response.json()) as PlacesPlaceDetails;
  } catch {
    logGoogleReviewsDiagnostic("Place Details request threw", {
      placeIdPresent: Boolean(placeId),
    });
    return null;
  }
}

/**
 * Text Search (New) — used only for official Place ID resolution, never scraping.
 * https://developers.google.com/maps/documentation/places/web-service/text-search
 */
export async function searchPlaceByText(options: {
  textQuery: string;
  apiKey: string;
  fetchImpl?: PlacesFetch;
}): Promise<PlacesPlaceDetails[]> {
  const { textQuery, apiKey, fetchImpl = fetch } = options;

  try {
    const response = await fetchImpl("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(PLACES_REQUEST_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.googleMapsUri",
      },
      body: JSON.stringify({ textQuery }),
    });

    if (!response.ok) {
      logGoogleReviewsDiagnostic("Text Search request failed", {
        status: response.status,
      });
      return [];
    }

    const payload = (await response.json()) as { places?: PlacesPlaceDetails[] };
    return payload.places ?? [];
  } catch {
    logGoogleReviewsDiagnostic("Text Search request threw");
    return [];
  }
}
