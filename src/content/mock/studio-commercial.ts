import type { StudioCommercial } from "../schema";
import { OWNER_INTERVIEW_2026_08_03 } from "../schema/owner-source";

export const mockStudioCommercial: StudioCommercial = {
  dataStatus: "verified",
  trialIsFree: true,
  trialOncePerPerson: true,
  trialAtEveryPhysicalBranch: true,
  trialForEveryService: true,
  advanceBookingCompulsory: false,
  registrationFeeInr: 300,
  registrationFeeOncePerPersonLifetime: true,
  programmeFeesStatus: "pending",
  feesDifferByBranch: true,
  gstIncludedInSuppliedPrices: true,
  discountsAvailableStatus: "pending",
  weddingPricingBasis: "per_couple",
  homePtPricingBasis: "per_session",
  onlineTrainingPlatform: "Zoom",
  onlineTrainingFormats: ["one-to-one", "group"],
  membershipPoliciesStatus: "owner_confirmed_pending_legal_copy",
  membershipNoCancellation: true,
  membershipNoRefund: true,
  membershipBranchTransferAllowed: true,
  membershipPauseAllowed: true,
  missedClassesPolicyStatus: "ambiguous",
  corporateFitnessStatus: "enquiry-only",
  corporateFitnessNote:
    "Corporate Fitness Sessions are available by enquiry on WhatsApp. Details are arranged when you get in touch.",
  typicalSessionMinutes: 60,
  maxGroupBatchSize: 15,
  ladiesOnlyBatchesAvailable: true,
  kidsOnlyBatchesAvailable: true,
  kidsDanceAgeGroups: ["3–8 years", "8–12 years"],
  enquiriesAcrossAgeGroups: true,
  beginnersWelcome: true,
  differentiator:
    "Machine-free Functional Training using bodyweight movement and portable training equipment such as bands, dumbbells and kettlebells. Group sessions are coach-led; personalised programming is available through personal training.",
  trainerCountNote: "15+ trainers across programmes and branches.",
  trainerWorkforceNote: "Workforce is a mix of employees and freelancers.",
  experienceNotePartial:
    "Owner stated hiring expectation of certification plus 2+ years — do not publish as proof that every trainer meets it until records are reviewed.",
  commercialPriorityNotePartial:
    "Owner wants to grow “fitness” — likely Functional Training; exact meaning requires clarification.",
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};
