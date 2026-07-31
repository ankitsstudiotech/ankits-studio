import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const timetableSlotSchema = provenanced({
  id: z.string().min(1),
  branchSlug: branchSlugSchema,
  programmeSlug: programmeSlugSchema,
  // 0 = Monday ... 6 = Sunday (ISO-style week, not JS Date.getDay()).
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  trainerSlug: z.string().optional(),
});
export type TimetableSlot = z.infer<typeof timetableSlotSchema>;
