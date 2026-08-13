import { describe, expect, it } from "vitest";
import { getGooglePlacesApiKey } from "@/lib/google-reviews/credentials";

describe("Google Places credentials", () => {
  it("returns null when GOOGLE_PLACES_API_KEY is missing", () => {
    expect(getGooglePlacesApiKey({})).toBeNull();
  });

  it("reads the server-side key and ignores NEXT_PUBLIC_ leakage", () => {
    expect(
      getGooglePlacesApiKey({
        GOOGLE_PLACES_API_KEY: "server-secret",
        NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: "public-leak",
      }),
    ).toBe("server-secret");
  });

  it("does not treat a public-only key as valid", () => {
    expect(
      getGooglePlacesApiKey({
        NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: "public-leak",
      }),
    ).toBeNull();
  });
});
