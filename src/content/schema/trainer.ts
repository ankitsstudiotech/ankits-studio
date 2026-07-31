import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const trainerSchema = provenanced({
  slug: z.string().min(1),
  name: z.string().min(1),
  photo: mediaAssetSchema,
  qualifications: z.array(z.string()),
  specialties: z.array(programmeSlugSchema),
  branchSlugs: z.array(branchSlugSchema),
  bio: z.string().min(1),
});
export type Trainer = z.infer<typeof trainerSchema>;
