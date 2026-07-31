import type { PricingPlan } from "../schema";

export const mockPricingPlans: PricingPlan[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder pricing — not a real fee, do not publish or quote to members.",
    slug: "illustrative-monthly",
    name: "Illustrative Monthly Plan",
    billingPeriod: "monthly",
    priceInr: 999,
    programmeSlugs: ["strength-training", "personal-training", "weight-loss-fitness"],
    branchSlugs: ["airoli", "ghansoli"],
    inclusions: ["Placeholder inclusion — access to group classes"],
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder pricing — not a real fee, do not publish or quote to members.",
    slug: "illustrative-quarterly",
    name: "Illustrative Quarterly Plan",
    billingPeriod: "quarterly",
    priceInr: 2499,
    programmeSlugs: ["yoga", "zumba", "adult-dance"],
    branchSlugs: ["airoli", "ghansoli"],
    inclusions: ["Placeholder inclusion — access to group classes", "Placeholder inclusion — one trainer check-in"],
  },
];
