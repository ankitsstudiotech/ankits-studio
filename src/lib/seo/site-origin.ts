/**
 * Single source of truth for the absolute site origin used by:
 * metadataBase, canonicals, sitemap <loc>, robots Sitemap, JSON-LD @id/url, OG URLs.
 *
 * Change ONLY `NEXT_PUBLIC_SITE_URL` when promoting to the custom domain —
 * do not hardcode hosts in components.
 */

export function isLocalOrLoopbackHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1";
  } catch {
    return true;
  }
}

export type ResolveSiteOriginInput = {
  configured?: string | undefined;
  nodeEnv: string;
  /** Vitest sets VITEST=true — production stubs must not fail the suite. */
  isVitest?: boolean;
  /** Vercel: production | preview | development */
  vercelEnv?: string | undefined;
  /** Deployment host without protocol, e.g. ankits-studio-xxx.vercel.app */
  vercelUrl?: string | undefined;
};

/**
 * Resolves the canonical site origin.
 * - Development / test: may fall back to http://localhost:3000
 * - Vercel Preview: may use https://$VERCEL_URL when SITE_URL is unset
 * - Production builds (non-Vitest, non-preview): require a non-localhost absolute URL
 */
export function resolveSiteOrigin(input: ResolveSiteOriginInput): string {
  const configured = input.configured?.trim().replace(/\/$/, "") || undefined;
  const previewFallback =
    input.vercelEnv === "preview" && input.vercelUrl
      ? `https://${input.vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
      : undefined;
  const resolved = configured ?? previewFallback;
  const enforceProduction =
    input.nodeEnv === "production" &&
    input.isVitest !== true &&
    input.vercelEnv !== "preview";

  if (resolved) {
    if (enforceProduction && isLocalOrLoopbackHost(resolved)) {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL must not be a localhost/loopback host in production (received: ${resolved}).`,
      );
    }
    return resolved;
  }

  if (enforceProduction) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required for production builds. Set it to the public site origin (e.g. https://ankits-studio-eight.vercel.app).",
    );
  }

  return "http://localhost:3000";
}

/** Stable Organization @id — shared across JSON-LD graphs. */
export function organizationId(origin: string): string {
  return `${origin.replace(/\/$/, "")}/#organization`;
}

/** Stable branch LocalBusiness @id. */
export function branchBusinessId(origin: string, slug: string): string {
  return `${origin.replace(/\/$/, "")}/locations/${slug}/#business`;
}

/** Stable programme Service @id. */
export function programmeServiceId(origin: string, slug: string): string {
  return `${origin.replace(/\/$/, "")}/programs/${slug}/#service`;
}

/** Stable WebSite @id. */
export function websiteId(origin: string): string {
  return `${origin.replace(/\/$/, "")}/#website`;
}

/** Strip tracking/query params for sameAs profiles. */
export function cleanProfileUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}
