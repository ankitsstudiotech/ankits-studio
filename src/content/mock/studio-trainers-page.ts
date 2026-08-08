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
    "Ankit’s Studio works with a team of 15+ coaches across its fitness, yoga, Zumba and dance programmes.",
  teamSizeLabel: "15+",
  teamSizeBody:
    "Ankit’s Studio works with a team of 15+ coaches across its fitness, yoga, Zumba and dance programmes.",
  teamSizeProvenance: "owner_provided",
  teamSizeProvenanceNote:
    "Owner-provided team-size and employment-model statement. Individual names, photos, roles and qualifications are not published yet. Lead trainer first names are stored as unpublished pending data.",
  programmesTitle: "Coaching across programmes",
  programmesBody:
    "Coaches support classes and sessions across the studio’s programmes. Availability depends on the programme and branch you choose.",
  branchesTitle: "Four neighbourhood studios",
  branchesBody:
    "Coaching is offered across Airoli Sector 19, Airoli Sector 8, Ghansoli and Thane. Ask which coaches and batches are available at the studio nearest you.",
  readinessTitle: "Individual profiles",
  readinessBody:
    "Individual coach profiles will be added as team details and photo permissions are completed.",
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};
