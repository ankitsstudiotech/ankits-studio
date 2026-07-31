import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const pricingPlanSchema = provenanced({
  slug: z.string().min(1),
  name: z.string().min(1),
  billingPeriod: z.enum(["monthly", "quarterly", "annual", "per-session"]),
  priceInr: z.number().nonnegative(),
  programmeSlugs: z.array(programmeSlugSchema),
  branchSlugs: z.array(branchSlugSchema),
  inclusions: z.array(z.string()),
});
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
