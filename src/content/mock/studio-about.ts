import type { StudioAbout } from "../schema";
import { OWNER_INTERVIEW_2026_08_03 } from "../schema/owner-source";

/**
 * Verified About-page copy — founder story outcome-safe; credentials unpublished.
 */
export const mockStudioAbout: StudioAbout = {
  dataStatus: "verified",
  seoTitle: "About Ankit’s Studio | Fitness, Yoga and Dance",
  seoDescription:
    "Learn about Ankit’s Studio, founded in 2019 by Ankit Nalawade — machine-free coach-led programmes and four neighbourhood branches in Navi Mumbai and Thane.",
  pageTitle: "About · Fitness, Yoga and Dance",
  headline: "A neighbourhood studio for fitness, yoga, Zumba and dance",
  lede:
    "Ankit’s Studio combines functional training, yoga, Zumba, dance and wedding choreography across four neighbourhood branches — with home and online training as delivery options. Sessions are machine-free and coach-led.",
  approachTitle: "Machine-free, coach-led",
  approachBody:
    "Ankit’s Studio does not rely on conventional gym-machine workouts. Group sessions are coach-led; personalised programming is available through personal training.",
  disciplinesTitle: "One studio, different ways of moving",
  disciplinesBody:
    "Functional training, Zumba, yoga, dance and wedding choreography in studio — plus home and online training. Choose the service that fits, then enquire for the current batch and fee.",
  branchesTitle: "Four neighbourhood branches",
  branchesBody:
    "Airoli Sector 19, Airoli Sector 8, Ghansoli and Thane. Each branch page has the address and a Maps link.",
  teamTitle: "Team and coaching",
  teamBody:
    "Ankit’s Studio works with a team of 15+ coaches across its programmes and branches.",
  teamCountProvenance: "Our coaching team covers fitness, yoga, Zumba and dance.",
  trainerProfileSlugs: [],
  founderStoryStatus: "verified",
  founderStory:
    "Ankit Nalawade founded Ankit’s Studio in 2019 after developing a passion for fitness, training members and building his coaching knowledge through practical experience and certification. The studio was created to make different forms of fitness and movement available through one neighbourhood studio network.",
  foundingDateStatus: "verified",
  foundingDateLabel: "2019",
  credentialsStatus: "pending",
  faqs: [
    {
      id: "about-faq-machine-free",
      question: "Are sessions machine-free?",
      answer:
        "Yes. The studio does not rely on conventional gym-machine workouts. Portable equipment such as bands, dumbbells and kettlebells may still be used.",
    },
  ],
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};
