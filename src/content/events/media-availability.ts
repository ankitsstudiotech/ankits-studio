import { existsSync } from "node:fs";
import { join } from "node:path";
import { GARBA_NIGHT_2026, type GarbaMediaAvailability } from "./garba-night-2026";

export type { GarbaMediaAvailability };

function publicPath(urlPath: string): string {
  const relative = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  return join(process.cwd(), "public", relative);
}

/** Build-time / RSC check for optimized Garba media under public/. */
export function getGarbaMediaAvailability(): GarbaMediaAvailability {
  const poster = existsSync(publicPath(GARBA_NIGHT_2026.media.poster));
  const promoTeaser = existsSync(publicPath(GARBA_NIGHT_2026.media.promoTeaser.src));
  const previousEdition = existsSync(publicPath(GARBA_NIGHT_2026.media.previousEdition.src));
  return {
    poster,
    promoTeaser,
    previousEdition,
    campaignComplete: poster && promoTeaser && previousEdition,
  };
}
