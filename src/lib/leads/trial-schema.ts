import { z } from "zod";
import { branchSlugSchema, programmeSlugSchema } from "@/content";
import { ageGroupValues, preferredTimingValues } from "./types";

export const trialLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a phone number we can reach.")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Phone number contains invalid characters."),
  branchSlug: branchSlugSchema,
  programmeSlug: programmeSlugSchema,
  preferredTiming: z.enum(preferredTimingValues),
  ageGroup: z.enum(ageGroupValues),
  message: z.string().trim().max(500).optional(),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Consent is required before we can take your trial request.",
    }),
});

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a phone number.")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Phone number contains invalid characters."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email.")]).optional(),
  message: z.string().trim().min(10, "Please include a short message.").max(1000),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Consent is required before we can take your message.",
    }),
});
