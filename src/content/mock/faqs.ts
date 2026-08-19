import type { Faq } from "../schema";

/**
 * Deliberately generic and safe: no medical claims, no guaranteed
 * weight-loss claims, no ratings/awards. See docs/BUSINESS-DATA-STATUS.md
 * and this task's mock-data rules.
 */
export const mockFaqs: Faq[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-first-class",
    question: "What should I bring to my first class?",
    answer:
      "Illustrative answer: comfortable workout clothing, a water bottle, and a towel. Specific requirements vary by programme.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-experience-needed",
    question: "Do I need prior experience to join?",
    answer:
      "Illustrative answer: most programmes welcome beginners, and instructors adjust pacing for different experience levels.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-book-trial",
    question: "How do I book a trial class?",
    answer:
      "Illustrative answer: use the trial booking option on the site, or contact the studio directly once contact details are confirmed.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-cancellation-policy",
    question: "What is the cancellation policy for a booked class?",
    answer: "Illustrative answer: the cancellation policy is not yet finalised — check with the studio directly.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-yoga-mat",
    question: "Do I need my own yoga mat?",
    answer: "Illustrative answer: bringing your own mat is recommended. Whether rentals are available is not yet confirmed.",
    programmeSlug: "yoga",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative FAQ copy — not yet reviewed or confirmed by the owner.",
    id: "faq-airoli-parking",
    question: "Is parking available at the Airoli branch?",
    answer: "Illustrative answer: parking availability at this branch is not yet confirmed — check with the studio directly.",
    branchSlug: "airoli-sector-19",
  },
];
