import type { StudioCommercial } from "../schema";
import { OWNER_INTERVIEW_2026_08_01 } from "../schema/owner-source";

export const mockStudioCommercial: StudioCommercial = {
  dataStatus: "verified",
  trialIsFree: true,
  registrationFeeInr: 300,
  programmeFeesStatus: "pending",
  maxGroupBatchSize: 15,
  ladiesOnlyBatchesAvailable: true,
  kidsOnlyBatchesAvailable: true,
  enquiriesAcrossAgeGroups: true,
  differentiator:
    "Machine-free, coach-led sessions adapted to individual needs and goals.",
  trainerCountNote: "15+ trainers (owner-confirmed count; qualifications unpublished).",
  experienceNotePartial:
    "Owner stated 2+ years of experience — subject (owner / studio / trainers) still requires clarification before public marketing use.",
  commercialPriorityNotePartial:
    "Owner wants to grow “fitness” — likely Functional Training; exact meaning requires clarification.",
  ownerSource: OWNER_INTERVIEW_2026_08_01,
};
