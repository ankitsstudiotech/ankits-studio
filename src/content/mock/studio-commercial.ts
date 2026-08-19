import type { StudioCommercial } from "../schema";
import { OWNER_FORM_2026_08_12 } from "../schema/owner-source";

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
  discountsAvailableStatus: "published",
  weddingPricingBasis: "per_couple",
  homePtPricingBasis: "per_session",
  onlineTrainingPlatform: "Zoom",
  onlineTrainingFormats: ["one-to-one", "group"],
  membershipPoliciesStatus: "published",
  membershipNoCancellation: false,
  membershipNoRefund: true,
  membershipBranchTransferAllowed: true,
  membershipPauseAllowed: true,
  missedClassesPolicyStatus: "withheld",
  corporateFitnessStatus: "published",
  membershipPolicyCopy: {
    cancellation:
      "Membership cancellation is subject to the terms communicated at enrolment. Contact the studio to discuss your situation.",
    refund:
      "Membership fees are generally non-refundable after membership has commenced, except where management specifically approves otherwise.",
    transfer:
      "Transfer between branches may be requested subject to programme availability, any fee differences and management approval.",
    freeze:
      "Membership freeze or pause may be available in eligible circumstances with prior approval. Applicable period and conditions are communicated when your request is handled.",
    expiry:
      "Membership is valid for the purchased duration and expires on the stated end date.",
  },
  pricingEnquiryNote:
    "Fees vary by programme, branch, batch, duration and membership or package. Current options and applicable offers are shared during enquiry.",
  discountsEnquiryNote:
    "Current or special offers may exist for couples, family members, siblings, students, long-term memberships, group enrolments, corporate tie-ups or new-admission campaigns. Eligibility depends on the current offer and is confirmed on enquiry.",
  freeTrialJourneyNote:
    "Enquire via WhatsApp, phone or the website trial path. The team confirms your preferred programme, branch and timing, shares an available trial option, and provides batch, location and attendance instructions. Membership options and fees can be discussed after your session.",
  typicalSessionMinutes: 60,
  maxGroupBatchSize: 15,
  ladiesOnlyBatchesAvailable: true,
  kidsOnlyBatchesAvailable: true,
  kidsDanceAgeGroups: ["3–8 years", "8–12 years"],
  enquiriesAcrossAgeGroups: true,
  beginnersWelcome: true,
  differentiator:
    "Coach-led training that prioritises bodyweight movement and functional equipment such as bands, dumbbells and kettlebells — not rows of conventional gym machines. Sessions stay approachable, energetic and built for consistency.",
  trainerCountNote: "15+ coaches across programmes and studios.",
  trainerWorkforceNote: "Coaches support programmes across the studio network.",
  experienceNotePartial:
    "Internal: owner hiring expectations — not published as proof that every coach meets specific criteria.",
  commercialPriorityNotePartial:
    "Internal growth priorities (2026-08-12): Corporate Wellness; Home + Online Personal Training; TTEA (future, not public).",
  ownerSource: OWNER_FORM_2026_08_12,
};
