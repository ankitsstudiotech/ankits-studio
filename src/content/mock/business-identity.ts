import type { BusinessIdentity } from "../schema";

/**
 * Display name and founding year owner-confirmed (2026-08-03).
 * Logo descriptor is lockup text only.
 */
export const mockBusinessIdentity: BusinessIdentity = {
  dataStatus: "verified",
  legalName: "Ankit's Studio",
  displayName: "Ankit's Studio",
  logoDescriptor: "Dance & Fitness",
  foundingYear: 2019,
  tagline: "Machine-free, coach-led sessions for dance and fitness.",
  description:
    "Ankit’s Studio is a fitness studio founded in 2019 with four neighbourhood branches in Navi Mumbai and Thane. Coach-led sessions cover functional training, Zumba, yoga, dance and wedding choreography, with home personal training and online training as delivery options. Group sessions are coach-led; personalised programming is available through personal training.",
};
