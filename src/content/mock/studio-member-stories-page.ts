import type { StudioMemberStoriesPage } from "../schema/studio-member-stories-page";

/**
 * Verified page copy for /transformations (Member Stories heading).
 * No stories are publishable yet — readiness messaging only.
 */
export const mockStudioMemberStoriesPage: StudioMemberStoriesPage = {
  dataStatus: "verified",
  pageTitle: "Member Stories",
  seoTitle: "Member Stories | Ankit’s Studio",
  seoDescription:
    "Member stories from Ankit’s Studio are published with permission. Explore programmes and neighbourhood studios, or book a free trial.",
  headline: "Member Stories",
  lede:
    "Real experiences from people who train with Ankit’s Studio — shared only when the member agrees.",
  consentTitle: "Published with permission",
  consentBody: "We publish member stories only with the member’s permission.",
  readinessTitle: "What you can explore today",
  readinessBody:
    "More member stories will be added as they are approved for publication.",
  readinessSupporting:
    "Meanwhile, explore programmes and neighbourhood studios, or book a free trial.",
  programmesTitle: "Explore programmes",
  programmesBody:
    "Learn about coach-led programmes and find a class that suits you.",
  branchesTitle: "Neighbourhood studios",
  branchesBody: "Train at Airoli Sector 19, Airoli Sector 8, Ghansoli or Thane.",
  ctaTitle: "Book a free trial",
  ctaBody:
    "Message Ankit’s Studio on WhatsApp to arrange a free trial. Experiences vary — we do not promise specific results.",
};
