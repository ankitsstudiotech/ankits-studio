import { permanentRedirect } from "next/navigation";

/**
 * Alias for the canonical trial booking route (`/trial`).
 * Prefer the permanent redirect in next.config.ts; this page is a fallback.
 */
export default function BookAFreeTrialAliasPage() {
  permanentRedirect("/trial");
}
