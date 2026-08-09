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
    "When members agree to share their experience, their stories appear here. Until then, explore programmes, neighbourhood studios, or book a free trial.",
  consentTitle: "Published with permission",
  consentBody: "We publish member stories only with the member’s permission.",
  readinessTitle: "Stories",
  readinessBody:
    "No member stories are published yet. Explore programmes and studios, or message WhatsApp for a free trial.",
  programmesTitle: "Programmes",
  programmesBody:
    "Learn about coach-led programmes and find a class that suits you.",
  branchesTitle: "Neighbourhood studios",
  branchesBody: "Train at Airoli Sector 19, Airoli Sector 8, Ghansoli or Thane.",
  ctaTitle: "Book a free trial",
  ctaBody:
    "Message Ankit’s Studio on WhatsApp to arrange a free trial. Experiences vary — we do not promise specific results.",
};
