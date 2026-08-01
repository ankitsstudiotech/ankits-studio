import { mockLeadAdapter } from "./mock-adapter";
import { productionLeadAdapter } from "./production-adapter";
import type { LeadAdapter } from "./types";

export * from "./types";
export * from "./trial-schema";
export { mockLeadAdapter } from "./mock-adapter";
export { productionLeadAdapter } from "./production-adapter";

/**
 * True when trial/contact submissions are accepted locally only (not
 * delivered to a live studio inbox). Stakeholder mock previews must keep
 * `LEAD_PROVIDER_URL` unset so this stays true — see
 * docs/MOCK-PREVIEW-DEPLOYMENT.md.
 */
export function isLeadDemonstrationMode(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return process.env.ALLOW_MOCK_PUBLISH === "true" && !process.env.LEAD_PROVIDER_URL;
}

/**
 * Resolve the active lead adapter.
 * - Development / mock-publish preview → mock adapter (local accept only)
 * - Production → production placeholder (fails closed until a provider is wired)
 */
export function getLeadAdapter(): LeadAdapter {
  if (isLeadDemonstrationMode()) {
    return mockLeadAdapter;
  }
  return productionLeadAdapter;
}
