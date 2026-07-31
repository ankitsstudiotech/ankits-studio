import type { Programme } from "../schema";

/**
 * The 7 programmes themselves are VERIFIED per docs/BUSINESS-DATA-STATUS.md
 * (the owner confirmed this list directly) — fees, timings, and trainers
 * attached to a programme are separate, still-mock records elsewhere.
 * `whoItsFor`/`classStructure`/`benefits`/`difficulty`/`requiredEquipment`
 * are the same kind of category-level description as `shortDescription`/
 * `longDescription`, not a specific verifiable business fact — see the
 * schema comment in `../schema/programme.ts` and docs/HANDOFF-ROUTES.md.
 * Benefits are phrased generically (no guaranteed outcomes, no medical
 * claims) per docs/BUSINESS-DATA-STATUS.md.
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
    whoItsFor: "Adults who want structured, coached strength work — from first-timers to experienced lifters.",
    classStructure: "Warm-up and mobility, technique coaching, a main lift block, and accessory work.",
    benefits: [
      "Builds strength through progressive, coached programming",
      "Small-group coaching keeps attention on technique",
      "Programming adapts as you progress",
    ],
    difficulty: "intermediate",
    requiredEquipment: ["Comfortable training shoes", "Water bottle"],
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
    whoItsFor: "Anyone who wants a coach-led plan built around their own goals, schedule, or physical considerations.",
    classStructure: "One-on-one sessions: goal check-in, coached training block, and progress notes each session.",
    benefits: [
      "Programming tailored to your own goals and pace",
      "Direct coach attention every session",
      "Flexible scheduling around a dedicated coach",
    ],
    difficulty: "all-levels",
    requiredEquipment: ["Comfortable workout clothing"],
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
    whoItsFor: "Beginners and experienced practitioners looking for breath-led, low-impact movement.",
    classStructure: "Grounding/breathwork opening, guided asana sequence, and a closing rest period.",
    benefits: [
      "Supports mobility and flexibility over time",
      "Low-impact — accessible to most fitness levels",
      "Breath-focused pacing suited to beginners",
    ],
    difficulty: "beginner",
    requiredEquipment: ["Yoga mat (rentals may be available — to be confirmed)"],
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
    whoItsFor: "Anyone who enjoys dancing and wants a high-energy, music-led group cardio session.",
    classStructure: "Warm-up choreography, a sequence of dance-cardio tracks, and a cool-down.",
    benefits: [
      "High-energy cardio in a group setting",
      "No dance experience required to join",
      "Music-led pacing keeps sessions varied",
    ],
    difficulty: "all-levels",
    requiredEquipment: ["Supportive athletic shoes"],
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
    whoItsFor: "Adult beginners through more experienced dancers who want structured technique and choreography.",
    classStructure: "Technique warm-up, choreography breakdown, and full run-throughs.",
    benefits: [
      "Structured technique progression",
      "Choreography-based learning in a group setting",
      "Welcoming to first-time dancers",
    ],
    difficulty: "beginner",
    requiredEquipment: ["Comfortable clothing that allows movement"],
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
    whoItsFor: "Children learning dance fundamentals in a structured, encouraging group setting.",
    classStructure: "Warm-up games, coordination/rhythm drills, and simple choreography practice.",
    benefits: [
      "Builds coordination and rhythm through practice",
      "Encouraging, age-appropriate group setting",
      "Structured progression of dance fundamentals",
    ],
    difficulty: "beginner",
    requiredEquipment: ["Comfortable clothing that allows movement"],
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
    whoItsFor: "Adults working toward general fitness and weight-management goals through coached conditioning.",
    classStructure: "Warm-up, a coached conditioning circuit, and a cool-down/mobility close.",
    benefits: [
      "Supports general fitness and weight-management goals",
      "Coached conditioning suited to beginners",
      "Sessions build progressively over time",
    ],
    difficulty: "beginner",
    requiredEquipment: ["Comfortable training shoes", "Water bottle"],
  },
];
