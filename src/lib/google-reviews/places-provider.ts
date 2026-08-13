import { PLACES_DETAILS_FIELD_MASK, type PlacesPlaceDetails } from "./types";
import { logGoogleReviewsDiagnostic } from "./log";

const PLACE_DETAILS_ENDPOINT = "https://places.googleapis.com/v1/places";

export type PlacesFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export async function fetchPlaceDetails(options: {
  placeId: string;
  apiKey: string;
  fetchImpl?: PlacesFetch;
}): Promise<PlacesPlaceDetails | null> {
  const { placeId, apiKey, fetchImpl = fetch } = options;
  const url = `${PLACE_DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}`;

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      cache: "no-store",
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
