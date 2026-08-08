/**
 * NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA — default false / absent.
 * Synthetic surfaces render only when explicitly "true".
 */

export function isSyntheticMediaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA === "true";
}
