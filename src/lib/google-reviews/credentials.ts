/**
 * Server-only Places API key access.
 * Never expose via NEXT_PUBLIC_*, client bundles, or rendered HTML.
 */
export function getGooglePlacesApiKey(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const leaked = env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();
  if (leaked) {
    console.warn(
      "[google-reviews] NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is set; ignoring public key. Use GOOGLE_PLACES_API_KEY server-side only.",
    );
  }

  const key = env.GOOGLE_PLACES_API_KEY?.trim();
  return key ? key : null;
}
