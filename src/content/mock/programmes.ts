import type { Programme } from "../schema";

/**
 * The 7 programmes themselves are VERIFIED per docs/BUSINESS-DATA-STATUS.md
 * (the owner confirmed this list directly) — fees, timings, and trainers
 * attached to a programme are separate, still-mock records elsewhere.
 */
export const mockProgrammes: Programme[] = [
  {
    dataStatus: "verified",
    slug: "strength-training",
    name: "Strength Training",
    shortDescription: "Barbell and free-weight coaching for building real strength.",
    longDescription:
      "Structured strength programming for lifters at every stage, coached in small groups with attention to technique and progressive overload.",
    audienceTags: ["adults", "beginner-friendly", "strength-focused"],
    branchSlugs: ["airoli", "ghansoli", "thane"],
    heroAccent: "strength",
  },
  {
    dataStatus: "verified",
    slug: "personal-training",
    name: "Personal Training",
    shortDescription: "One-on-one coaching built around your goals and schedule.",
    longDescription:
      "Individualised programming with a dedicated coach — for members who want a plan tailored to their own goals, injuries, or timeline.",
    audienceTags: ["adults", "one-on-one", "goal-focused"],
    branchSlugs: ["airoli", "ghansoli", "thane"],
    heroAccent: "strength",
  },
  {
    dataStatus: "verified",
    slug: "yoga",
    name: "Yoga",
    shortDescription: "Breath-led movement and mobility work for every level.",
    longDescription:
      "Yoga classes spanning grounding, restorative sessions to more dynamic flows, taught with attention to breath and alignment.",
    audienceTags: ["adults", "beginner-friendly", "low-impact"],
    branchSlugs: ["airoli", "ghansoli"],
    heroAccent: "calm",
  },
  {
    dataStatus: "verified",
    slug: "zumba",
    name: "Zumba",
    shortDescription: "High-energy dance cardio set to music.",
    longDescription:
      "Group dance-cardio sessions that blend Latin and international rhythms into a high-energy, no-experience-needed workout.",
    audienceTags: ["adults", "high-intensity", "group-class"],
    branchSlugs: ["airoli", "ghansoli"],
    heroAccent: "high-energy",
  },
  {
    dataStatus: "verified",
    slug: "adult-dance",
    name: "Adult Dance",
    shortDescription: "Choreography-based dance classes for adult beginners and beyond.",
    longDescription:
      "Technique and choreography across dance styles, structured for adult learners from first-timers to more experienced dancers.",
    audienceTags: ["adults", "beginner-friendly", "group-class"],
    branchSlugs: ["airoli", "ghansoli", "thane"],
    heroAccent: "high-energy",
  },
  {
    dataStatus: "verified",
    slug: "kids-dance",
    name: "Kids Dance",
    shortDescription: "Dance fundamentals and confidence-building for children.",
    longDescription:
      "Age-appropriate dance classes focused on coordination, rhythm, and confidence, in a structured and encouraging group setting.",
    audienceTags: ["kids", "beginner-friendly", "group-class"],
    branchSlugs: ["airoli", "ghansoli"],
    heroAccent: "high-energy",
  },
  {
    dataStatus: "verified",
    slug: "weight-loss-fitness",
    name: "Weight-Loss & General Fitness",
    shortDescription: "General fitness programming focused on sustainable results.",
    longDescription:
      "A general fitness track combining conditioning and coached movement, aimed at members working toward weight-loss and overall fitness goals.",
    audienceTags: ["adults", "beginner-friendly", "goal-focused"],
    branchSlugs: ["airoli", "ghansoli", "thane"],
    heroAccent: "strength",
  },
];
