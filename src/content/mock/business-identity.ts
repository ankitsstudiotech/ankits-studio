import type { BusinessIdentity } from "../schema";

/**
 * Display name and brand descriptor — owner form 2026-08-12.
 */
export const mockBusinessIdentity: BusinessIdentity = {
  dataStatus: "verified",
  legalName: "Ankit's Studio",
  displayName: "Ankit's Studio",
  logoDescriptor: "Dance & Fitness",
  foundingYear: 2019,
  tagline:
    "Premium, energetic coach-led dance and fitness across neighbourhood studios in Navi Mumbai and Thane.",
  description:
    "Ankit’s Studio is a dance and fitness studio founded in 2019 with four neighbourhood branches. Coach-led sessions cover functional training, Zumba, yoga, dance, wedding choreography and corporate wellness, with home personal training and online training as delivery options. Work towards your fitness goals with approachable, engaging sessions built for consistency.",
  socialLinks: {
    instagram:
      "https://www.instagram.com/ankitsstudio?igshid=MmIzYWVlNDQ5Yg%3D%3D",
    youtube: "https://youtube.com/@ankitsstudio?si=PhnLfioVa0zTTP2n",
  },
};
