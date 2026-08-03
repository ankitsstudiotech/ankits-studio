import type { Programme } from "../schema";

const ALL_BRANCHES = ["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"] as const;

const PENDING_PRICING = "pending" as const;
const PENDING_BATCHES = "pending" as const;

/**
 * Programme catalogue after owner interview 2026-08-01 + confirmed taxonomy rebuild.
 * Confirmed services: Functional, Zumba, Yoga, Dance, Wedding, Home PT, Online.
 * Legacy routes remain `migration-pending` — reachable, noindex, no silent redirects.
 */
export const mockProgrammes: Programme[] = [
  {
    dataStatus: "verified",
    slug: "functional-training",
    name: "Functional Training",
    shortDescription:
      "Machine-free Functional Training using bodyweight movement and portable equipment.",
    longDescription:
      "Functional Training is an owner-confirmed studio service. Machine-free means sessions do not rely on conventional gym machines; coaches may use bodyweight exercises, resistance bands, dumbbells, kettlebells, battle ropes, circuit training, mobility work, and strength and conditioning. Not every tool appears in every session or branch. Typical sessions last about one hour. Group sessions are coach-led; personalised programming is available through personal training. Beginners are welcome — we do not claim every programme is medically suitable for every individual. Exact batch times are confirmed when you enquire.",
    audienceTags: ["adults", "fitness", "working-professionals"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor:
      "Adults who want coach-led, machine-free fitness — including working professionals and beginners. Suitability depends on the batch. Ask when you book a free trial.",
    classStructure:
      "Typical session duration is about one hour. Exact warm-up, workout and cool-down splits are not published. Batch times are confirmed on WhatsApp.",
    benefits: [
      "Machine-free sessions (no conventional gym-machine circuits)",
      "Portable equipment such as bands, dumbbells and kettlebells may be used",
      "Typical sessions about one hour",
      "Beginners welcome",
      "Offered across studio branches",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "confirmed",
    serviceCluster: "train",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.functional-training",
    seoTitle: "Functional Training",
    seoDescription:
      "Machine-free, coach-led Functional Training at Ankit’s Studio across Airoli, Ghansoli and Thane. Typical sessions about one hour. Free trial on WhatsApp.",
    relatedProgrammeSlugs: ["home-personal-training", "online-training", "yoga"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "ft-trial",
        question: "Is a trial available?",
        answer:
          "Yes. A free trial is available once per person. Opening WhatsApp starts a chat — it does not mean a message was already delivered.",
      },
      {
        id: "ft-machines",
        question: "Is this machine-based gym training?",
        answer:
          "No. Machine-free means no reliance on conventional gym machines. Coaches may still use portable equipment such as bands, dumbbells and kettlebells.",
      },
      {
        id: "ft-duration",
        question: "How long is a session?",
        answer: "Typical sessions last about one hour. Exact structure varies by batch.",
      },
      {
        id: "ft-price",
        question: "What does it cost?",
        answer:
          "Programme fees vary by service and branch and are confirmed when you enquire. GST is included in supplied prices. There is a one-time registration fee of ₹300 per person after you join. The trial class is free.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "strength-training",
    name: "Strength Training",
    shortDescription: "Legacy programme page — taxonomy mapping still pending confirmation.",
    longDescription:
      "This URL remains available while Ankit confirms whether Strength Training stays as a distinct public programme or maps elsewhere. It is not currently listed among owner-confirmed public services. For coach-led machine-free fitness, see Functional Training.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "Enquire with the studio about current fitness options.",
    classStructure: "Strength Training class structure is not published while taxonomy is pending.",
    benefits: ["Ask the studio which current fitness services apply", "Taxonomy mapping still being confirmed"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "functional-training",
    seoTitle: "Strength Training (taxonomy review)",
    seoDescription:
      "This legacy Strength Training page is under taxonomy review at Ankit’s Studio. See current programmes for confirmed services.",
  },
  {
    dataStatus: "verified",
    slug: "personal-training",
    name: "Personal Training",
    shortDescription: "Legacy in-studio PT page — confirm alongside Home Personal Training.",
    longDescription:
      "Owner confirmed Home Personal Training as a delivery mode. Whether a distinct in-studio Personal Training product continues is not confirmed. This page remains temporarily while taxonomy is reviewed.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "People considering one-on-one coaching — ask which delivery mode fits.",
    classStructure: "In-studio Personal Training structure is not published while taxonomy is pending.",
    benefits: ["Confirm studio vs home delivery with the team", "Taxonomy mapping still being confirmed"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "home-personal-training",
    seoTitle: "Personal Training (taxonomy review)",
    seoDescription:
      "This legacy Personal Training page is under taxonomy review. Home Personal Training is the owner-confirmed home delivery option.",
  },
  {
    dataStatus: "verified",
    slug: "yoga",
    name: "Yoga",
    shortDescription: "Breath-led movement with space to settle — ask which batch suits you.",
    longDescription:
      "Yoga is an owner-confirmed studio service. Sessions emphasise breath-led movement. We do not make medical or spiritual outcome claims. Ladies-only batches may be available — ask when you enquire. Exact batch times are pending.",
    audienceTags: ["adults", "low-impact"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "calm",
    whoItsFor:
      "People looking for breath-led, lower-impact movement. Suitability depends on the batch. Ask about ladies-only options when booking a trial.",
    classStructure: "Breath-led session structure varies by batch. Exact times pending.",
    benefits: [
      "Breath-led studio sessions",
      "Ladies-only batches available on request",
      "Offered across studio branches",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "confirmed",
    serviceCluster: "move",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.yoga",
    seoTitle: "Yoga",
    seoDescription:
      "Yoga at Ankit’s Studio in Airoli, Ghansoli and Thane. Breath-led sessions; free trial on WhatsApp. Batch times confirmed on enquiry.",
    relatedProgrammeSlugs: ["functional-training", "zumba", "adult-dance"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "yoga-ladies",
        question: "Are ladies-only batches available?",
        answer: "Yes — ladies-only batches are available. Ask which options fit when you book a trial.",
      },
      {
        id: "yoga-trial",
        question: "Can I try a class first?",
        answer:
          "Yes. Free trial enquiries are welcome on WhatsApp. Opening the chat does not mean a message was delivered.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "zumba",
    name: "Zumba",
    shortDescription: "Music-led group energy. No dance background required to enquire.",
    longDescription:
      "Zumba is an owner-confirmed studio service: music-led group sessions. No prior dance experience is required to enquire. Exact batch times and formats are confirmed when you message us. We do not promise specific fitness outcomes.",
    audienceTags: ["adults", "group-class"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor:
      "Anyone who enjoys music-led group movement. Not every batch suits every age — ask the studio when you enquire.",
    classStructure: "Music-led group session. Exact batch times pending.",
    benefits: [
      "Music-led group sessions",
      "No dance background required to enquire",
      "Offered across studio branches",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "confirmed",
    serviceCluster: "move",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.zumba",
    seoTitle: "Zumba",
    seoDescription:
      "Zumba at Ankit’s Studio across Navi Mumbai and Thane. Music-led group sessions; free trial on WhatsApp.",
    relatedProgrammeSlugs: ["adult-dance", "yoga", "functional-training"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "zumba-experience",
        question: "Do I need dance experience?",
        answer: "No. You can enquire without a dance background. The studio will help match a suitable batch.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "adult-dance",
    name: "Dance",
    shortDescription: "Studio dance for adults — technique and choreography in a welcoming room.",
    longDescription:
      "Dance is an owner-confirmed studio service. Kids Dance and Ladies Dance are not separate general programmes — they are kids-only and ladies-only Dance batches. Children’s Dance age groups include 3–8 years and 8–12 years. Availability varies by branch and schedule. Wedding choreography is listed separately.",
    audienceTags: ["adults", "group-class", "kids", "women"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor:
      "Adults interested in studio dance, plus families asking about kids-only Dance batches (3–8 and 8–12 years) and ladies-only Dance batches.",
    classStructure: "Studio dance sessions. Exact styles and times confirmed on enquiry. Typical sessions are about one hour.",
    benefits: [
      "Studio dance sessions across branches",
      "Kids-only Dance batches (age groups 3–8 and 8–12 years) available to ask about",
      "Ladies-only Dance batches available to ask about",
      "Wedding choreography is a separate service",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "confirmed",
    serviceCluster: "move",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.dance",
    seoTitle: "Dance",
    seoDescription:
      "Dance classes at Ankit’s Studio. Kids-only (3–8 and 8–12) and ladies-only Dance batches available to ask about. Free trial on WhatsApp.",
    relatedProgrammeSlugs: ["zumba", "wedding-choreography", "yoga"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "dance-kids",
        question: "Do you offer kids-only dance batches?",
        answer:
          "Yes. Kids Dance is a kids-only Dance batch, not a separate general programme. Age groups include 3–8 years and 8–12 years. Ask when you enquire — availability varies by branch.",
      },
      {
        id: "dance-ladies",
        question: "Do you offer ladies-only dance batches?",
        answer:
          "Yes. Ladies Dance is a ladies-only Dance batch, not a separate general programme. Ask when you enquire.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "kids-dance",
    name: "Kids Dance",
    shortDescription: "Legacy named page — kids-only batches are confirmed as an audience option.",
    longDescription:
      "Owner confirmed kids-only batches are available. Whether Kids Dance remains a separately named public programme is not confirmed. See Dance for the confirmed Dance service and ask about kids-only batches there.",
    audienceTags: ["taxonomy-pending", "kids"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor: "Families asking about kids-only dance options — confirm age fit with the studio.",
    classStructure: "Not published as a confirmed named programme — taxonomy pending.",
    benefits: ["Kids-only batches are available to enquire about", "See Dance for the confirmed Dance service"],
    difficulty: "beginner",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "adult-dance",
    seoTitle: "Kids Dance (taxonomy review)",
    seoDescription:
      "This legacy Kids Dance page is under taxonomy review. Ask Ankit’s Studio about kids-only batches under Dance.",
  },
  {
    dataStatus: "verified",
    slug: "weight-loss-fitness",
    name: "Weight-Loss & General Fitness",
    shortDescription: "Legacy fitness page — mapping pending; no outcome guarantees.",
    longDescription:
      "This legacy page remains while taxonomy is confirmed against Functional Training. Ankit’s Studio does not promise weight-loss or other outcomes. For current machine-free coach-led fitness, see Functional Training.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "Adults exploring fitness options — ask which current services apply.",
    classStructure: "Weight-Loss & General Fitness structure is not published while taxonomy is pending.",
    benefits: ["No promised weight-loss outcomes", "See Functional Training for the confirmed fitness service"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "functional-training",
    seoTitle: "Weight-Loss & General Fitness (taxonomy review)",
    seoDescription:
      "This legacy page is under taxonomy review. See Functional Training for confirmed machine-free fitness at Ankit’s Studio.",
  },
  {
    dataStatus: "verified",
    slug: "wedding-choreography",
    name: "Wedding Choreography",
    shortDescription: "Personal choreography support for wedding routines and performances.",
    longDescription:
      "Wedding Choreography is an owner-confirmed service. Pricing is arranged on a per-couple basis; exact amounts and package details remain pending. Sessions are arranged after you enquire.",
    audienceTags: ["adults", "event"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor: "Individuals or groups preparing wedding dance routines.",
    classStructure: "Custom choreography arranged with the studio after enquiry.",
    benefits: [
      "Personal choreography support for wedding routines",
      "Pricing basis: per couple (exact amount pending)",
      "Enquire via WhatsApp",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "confirmed",
    serviceCluster: "celebrate",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.wedding-choreography",
    seoTitle: "Wedding Choreography",
    seoDescription:
      "Wedding choreography at Ankit’s Studio. Per-couple pricing — enquire on WhatsApp for current details.",
    relatedProgrammeSlugs: ["adult-dance", "zumba"],
    faqEntries: [
      {
        id: "wedding-price",
        question: "How is wedding choreography priced?",
        answer:
          "Pricing is per couple. Exact amounts and packages are confirmed when you enquire. Registration after joining is ₹300 one-time per person where membership applies.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "home-personal-training",
    name: "Home Personal Training",
    shortDescription: "Coach-led sessions at home — priced per session; coverage confirmed on enquiry.",
    longDescription:
      "Home Personal Training is an owner-confirmed delivery mode. It is not a physical branch class. The owner indicated it can cover the studio’s training offering apart from Zumba — exact home service lists and geographic coverage remain pending. Pricing is per session; exact rates are confirmed when you enquire. Personalised programming is available through personal training.",
    audienceTags: ["adults", "home-delivery"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "People who prefer coach-led personal training at home rather than in a branch.",
    classStructure:
      "Home sessions scheduled after enquiry — not on a branch timetable grid. Typical sessions are about one hour.",
    benefits: [
      "Coach-led sessions in a home setting",
      "Pricing basis: per session (exact rate pending)",
      "Personalised programming through personal training",
      "Coverage confirmed when you message us",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "home",
    taxonomyStatus: "confirmed",
    serviceCluster: "train",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.home-personal-training",
    seoTitle: "Home Personal Training",
    seoDescription:
      "Home Personal Training with Ankit’s Studio — per-session pricing. Coverage and rates confirmed on WhatsApp enquiry.",
    relatedProgrammeSlugs: ["online-training", "functional-training"],
    faqEntries: [
      {
        id: "home-area",
        question: "Which areas do you cover?",
        answer: "Service area is confirmed when you enquire. Do not assume coverage for every neighbourhood.",
      },
      {
        id: "home-price",
        question: "How is Home Personal Training priced?",
        answer: "Pricing is per session. Exact rates are confirmed when you enquire.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "online-training",
    name: "Online Training",
    shortDescription: "Remote coach-led sessions on Zoom — one-to-one and group formats.",
    longDescription:
      "Online Training is an owner-confirmed delivery mode delivered on Zoom. Formats include one-to-one and group sessions. Exact prices and schedules remain pending and are confirmed when you enquire. It is not a physical branch class.",
    audienceTags: ["adults", "online-delivery"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "People who want coach-led sessions online via Zoom.",
    classStructure:
      "Online sessions on Zoom after enquiry — one-to-one or group. Typical sessions are about one hour. Not a branch timetable row.",
    benefits: [
      "Remote coach-led sessions on Zoom",
      "One-to-one and group formats",
      "Schedule and fees confirmed on enquiry",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "online",
    taxonomyStatus: "confirmed",
    serviceCluster: "train",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.online-training",
    seoTitle: "Online Training",
    seoDescription:
      "Online Training with Ankit’s Studio on Zoom — one-to-one and group. Timing and fees confirmed when you enquire on WhatsApp.",
    relatedProgrammeSlugs: ["home-personal-training", "functional-training"],
    faqEntries: [
      {
        id: "online-platform",
        question: "Which platform do you use?",
        answer: "Online Training uses Zoom. One-to-one and group formats are available.",
      },
    ],
  },
];
