import { mockLeadAdapter } from "./mock-adapter";
import { productionLeadAdapter } from "./production-adapter";
import type { LeadAdapter } from "./types";

export * from "./types";
export * from "./trial-schema";
export { mockLeadAdapter } from "./mock-adapter";
export { productionLeadAdapter } from "./production-adapter";

/**
 * Resolve the active lead adapter.
 * - Development / mock-publish preview → mock adapter (local accept only)
 * - Production → production placeholder (fails closed until a provider is wired)
 */
export function getLeadAdapter(): LeadAdapter {
  if (process.env.NODE_ENV === "development") {
    return mockLeadAdapter;
  }
  if (process.env.ALLOW_MOCK_PUBLISH === "true" && !process.env.LEAD_PROVIDER_URL) {
    return mockLeadAdapter;
  }
  return productionLeadAdapter;
}
