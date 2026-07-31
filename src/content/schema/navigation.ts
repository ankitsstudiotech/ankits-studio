import { z } from "zod";
import { provenanced } from "./provenance";

export const navigationPlacementSchema = z.enum(["primary", "footer"]);
export type NavigationPlacement = z.infer<typeof navigationPlacementSchema>;

/**
 * Navigation items are structural IA facts we control directly (not
 * owner-supplied business facts needing confirmation), so mock content here
 * is `dataStatus: "verified"` — contrast with Branch/Trainer/etc., where
 * "verified" means the owner confirmed a real-world fact. Still carries
 * `dataStatus` per this task's rule that every content object must contain
 * a verification status, for a uniform accessor/testing story.
 */
export const navigationItemSchema = provenanced({
  id: z.string().min(1),
  label: z.string().min(1),
  path: z.string().min(1).startsWith("/"),
  placement: navigationPlacementSchema,
  order: z.number().int(),
  isPrimaryCta: z.boolean().optional(),
});
export type NavigationItem = z.infer<typeof navigationItemSchema>;
