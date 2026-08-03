import type { StudioTrainersPage } from "../schema";
import { OWNER_INTERVIEW_2026_08_03 } from "../schema/owner-source";

/**
 * Honest trainers-index copy. No named profiles, certifications, or “2+ years”.
 */
export const mockStudioTrainersPage: StudioTrainersPage = {
  dataStatus: "verified",
  pageTitle: "Training Team",
  seoTitle: "Training Team | Ankit’s Studio",
  seoDescription:
    "Learn about the Ankit’s Studio coaching team and enquire about trainer, programme and branch availability.",
  headline: "The coaching team",
  lede:
    "Ankit’s Studio works with a team of 15+ trainers across its fitness, yoga, Zumba and dance programmes.",
  teamSizeLabel: "15+",
  teamSizeBody:
    "Ankit’s Studio works with a team of 15+ trainers across its programmes and branches. The workforce is a mix of employees and freelancers.",
  teamSizeProvenance: "owner_provided",
  teamSizeProvenanceNote:
    "Owner-provided team-size and employment-model statement. Individual names, photos, roles and qualifications are not published yet. Lead trainer first names are stored as unpublished pending data.",
  programmesTitle: "Coaching across programmes",
  programmesBody:
    "The team supports the studio’s confirmed programmes. Trainer availability varies by programme — we do not assign named coaches publicly until profiles are verified.",
  branchesTitle: "Branches",
  branchesBody:
    "Coaching is offered across the four neighbourhood branches. Trainer availability varies by branch and programme.",
  readinessTitle: "Individual profiles",
  readinessBody:
    "Individual trainer profiles and credentials are being prepared for publication. Enquire on WhatsApp about programme and branch availability for your trial.",
  readinessBodyMockPreview:
    "Development note: no publishable trainer profiles exist yet — mock illustrative names must not appear on this route.",
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};
