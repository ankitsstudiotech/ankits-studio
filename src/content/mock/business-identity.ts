import type { BusinessIdentity } from "../schema";

/**
 * Display name owner-confirmed. Logo descriptor is lockup text only.
 * Tagline/description use safe owner-aligned wording (no outcome promises).
 */
export const mockBusinessIdentity: BusinessIdentity = {
  dataStatus: "verified",
  legalName: "Ankit's Studio",
  displayName: "Ankit's Studio",
  logoDescriptor: "Dance & Fitness",
  tagline: "Machine-free, coach-led sessions for dance and fitness.",
  description:
    "Ankit’s Studio is a multi-branch dance and fitness studio in Navi Mumbai and Thane. Sessions are machine-free and coach-led, adapted to individual needs and goals. Core services include functional training, Zumba, yoga, dance, and wedding choreography, with home personal training and online training as delivery options.",
};
