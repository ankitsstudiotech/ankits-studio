import type { StudioAbout } from "../schema";
import { OWNER_INTERVIEW_2026_08_01 } from "../schema/owner-source";

/**
 * Verified About-page copy — no founder biography, founding date, or credentials.
 * Team size is owner-provided count only.
 */
export const mockStudioAbout: StudioAbout = {
  dataStatus: "verified",
  seoTitle: "About Ankit’s Studio | Fitness, Yoga and Dance",
  seoDescription:
    "Learn about Ankit’s Studio, its machine-free coach-led approach, programmes and four neighbourhood branches in Navi Mumbai and Thane.",
  /** Document title segment — site template appends “| Ankit’s Studio”. */
  pageTitle: "About · Fitness, Yoga and Dance",
  headline: "A neighbourhood studio for fitness, yoga, Zumba and dance",
  lede:
    "Ankit’s Studio combines functional training, yoga, Zumba, dance and wedding choreography across four neighbourhood branches — with home and online training as delivery options. Sessions are machine-free and coach-led.",
  approachTitle: "Machine-free, coach-led",
  approachBody:
    "Ankit’s Studio does not rely on conventional gym-machine workouts. Sessions are coach-led and adapted to individual needs and goals. We do not promise specific results.",
  disciplinesTitle: "One studio, different ways of moving",
  disciplinesBody:
    "The same studio brand supports functional training, Zumba, yoga, dance and wedding choreography in the studio, plus home personal training and online training. Choose the service that fits — then enquire for the current batch and fee.",
  branchesTitle: "Four neighbourhood branches",
  branchesBody:
    "Ankit’s Studio operates through Airoli Sector 19, Airoli Sector 8, Ghansoli and Thane. Printable street addresses for some branches are still being confirmed — branch pages share what is verified today.",
  teamTitle: "Team and coaching",
  teamBody:
    "Ankit’s Studio works with a team of 15+ trainers across its programmes and branches.",
  teamCountProvenance: "Owner-provided team-size statement. Trainer names, roles and qualifications are not published yet.",
  trainerProfileSlugs: [],
  founderStoryStatus: "pending",
  foundingDateStatus: "pending",
  credentialsStatus: "pending",
  faqs: [
    {
      id: "about-faq-what",
      question: "What is Ankit’s Studio?",
      answer:
        "A multi-branch dance and fitness studio in Navi Mumbai and Thane. It offers functional training, Zumba, yoga, dance and wedding choreography, with home and online training as delivery options.",
    },
    {
      id: "about-faq-machine-free",
      question: "Are sessions machine-free?",
      answer:
        "Yes. The studio does not rely on conventional gym-machine workouts. Sessions are coach-led and adapted to individual needs and goals.",
    },
    {
      id: "about-faq-branches",
      question: "How many branches are there?",
      answer:
        "Four open neighbourhood branches: Airoli Sector 19, Airoli Sector 8, Ghansoli and Thane.",
    },
    {
      id: "about-faq-trial",
      question: "How do I book a free trial?",
      answer:
        "Message Ankit’s Studio on WhatsApp. Opening WhatsApp starts a chat — it does not mean your enquiry was already submitted.",
    },
  ],
  ownerSource: OWNER_INTERVIEW_2026_08_01,
};
