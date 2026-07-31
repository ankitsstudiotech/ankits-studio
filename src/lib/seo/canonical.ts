import { siteConfig } from "@/lib/metadata";

/**
 * Builds an absolute canonical URL from an internal path. Throws on any
 * malformed input rather than silently normalizing it — a bad canonical is
 * worse than a build-time error. See docs/SEO-STRATEGY.md metadata mechanics.
 */
export function buildCanonicalUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`buildCanonicalUrl: path must start with "/", got "${path}"`);
  }
  if (path.includes("?") || path.includes("#")) {
    throw new Error(`buildCanonicalUrl: path must not include a query string or fragment, got "${path}"`);
  }
  if (path.length > 1 && path.endsWith("/")) {
    throw new Error(`buildCanonicalUrl: path must not have a trailing slash (except "/"), got "${path}"`);
  }
  const normalizedBase = siteConfig.url.replace(/\/$/, "");
  return `${normalizedBase}${path}`;
}

/** True only for a well-formed absolute http(s) URL with no fragment. */
export function isValidCanonicalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && !url.includes("#");
  } catch {
    return false;
  }
}
