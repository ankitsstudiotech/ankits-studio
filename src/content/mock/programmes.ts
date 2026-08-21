import type { Programme } from "../schema";

const ALL_BRANCHES = ["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"] as const;

const PENDING_PRICING = "pending" as const;
const PENDING_BATCHES = "pending" as const;

/**
 * Programme catalogue after owner interview 2026-08-01 + confirmed taxonomy rebuild.
 * Confirmed services: Functional, Zumba, Yoga, Dance, Wedding, Home PT, Online, Corporate Wellness.
 * Legacy routes remain `migration-pending` — reachable, noindex, no silent redirects.
 */
export const mockProgrammes: Programme[] = [
  {
    dataStatus: "verified",
    slug: "functional-training",
    name: "Functional Training",
    shortDescription:
      "Coach-led strength, mobility and conditioning — machine-free training, not a conventional gym floor.",
    longDescription:
      "Functional Training at Ankit’s Studio is energetic, coach-led and built around real-life movement — not rows of gym machines. If you are searching for strength training or coach-led fitness rather than a machine-based gym membership, this is the studio format: bodyweight work, resistance bands, dumbbells, kettlebells and mats, with strength circuits, HIIT and mobility adapted to your level. Many members join to work towards goals such as fat loss, strength or stamina; coaches focus on approachable, consistent progress rather than promises.",
    audienceTags: ["adults", "fitness", "working-professionals"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor:
      "Adults who want coach-led strength and conditioning with personal attention — including beginners and working professionals looking for machine-free training instead of a conventional gym.",
    classStructure:
      "Structured coach-led sessions typically last about one hour. Exercises are adapted to fitness level; batch times are confirmed on WhatsApp.",
    benefits: [
      "Coach-led strength and conditioning",
      "Mobility and everyday movement focus",
      "Bodyweight and portable equipment",
      "Resistance bands, dumbbells and kettlebells",
      "Strength circuits and HIIT",
      "Machine-free — not a conventional machine gym",
      "Personal attention within group sessions",
      "Motivating community atmosphere",
      "Beginner-friendly enquiries welcome",
      "Personalised programming available through personal training",
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
    seoTitle: "Functional Training — Strength & Conditioning",
    seoDescription:
      "Coach-led Functional Training for strength, mobility and conditioning at Ankit’s Studio in Airoli, Ghansoli and Thane. Machine-free — not a conventional gym. Free trial on WhatsApp.",
    relatedProgrammeSlugs: ["home-personal-training", "online-training", "yoga"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "ft-trial",
        question: "Is a trial available?",
        answer: "Yes. A free trial is available once per person. Message us on WhatsApp to book.",
      },
      {
        id: "ft-machines",
        question: "Is this the same as a conventional gym?",
        answer:
          "No. Functional Training is coach-led and machine-free — focused on strength, mobility and conditioning with portable equipment, not rows of gym machines. Coaches may use bands, dumbbells and kettlebells.",
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
          "Programme fees vary by service and branch and are confirmed when you enquire. GST is included in the fee quoted by the studio. There is a one-time registration fee of ₹300 per person after you join. The trial class is free.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "strength-training",
    name: "Strength Training",
    shortDescription: "This older link is kept for reference — see current fitness programmes.",
    longDescription:
      "This page is kept for people who found an older link. Strength Training is not listed among our current programmes. For coach-led machine-free fitness, see Functional Training.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "Enquire with the studio about current fitness options.",
    classStructure: "Strength Training session structure is not published on this legacy page.",
    benefits: ["Ask the studio which current fitness services apply", "See Functional Training for coach-led machine-free fitness"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "functional-training",
    seoTitle: "Strength Training",
    seoDescription:
      "This older Strength Training page is kept for reference at Ankit’s Studio. See current programmes for available services.",
  },
  {
    dataStatus: "verified",
    slug: "personal-training",
    name: "Personal Training",
    shortDescription: "This older link is kept for reference — see Home Personal Training.",
    longDescription:
      "This page is kept for people who found an older link. For one-on-one coaching at home, see Home Personal Training. Ask the studio which delivery option fits you best.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "People considering one-on-one coaching — ask which delivery mode fits.",
    classStructure: "Ask the studio about current personal training options.",
    benefits: ["Confirm studio vs home delivery with the team", "See Home Personal Training for home sessions"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "home-personal-training",
    seoTitle: "Personal Training",
    seoDescription:
      "This older Personal Training page is kept for reference. Home Personal Training is available as a home delivery option.",
  },
  {
    dataStatus: "verified",
    slug: "yoga",
    name: "Yoga",
    shortDescription: "Calm, structured yoga with breath, mobility and mindful movement.",
    longDescription:
      "Yoga at Ankit’s Studio is calm, structured and beginner-friendly — traditional asanas with attention to mobility, breathing, relaxation and mindfulness. Sessions support flexibility, strength, balance and body awareness for everyday stress management, with proper guidance from coaches. Ladies-only batches may be available — ask when you enquire.",
    audienceTags: ["adults", "low-impact"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "calm",
    whoItsFor:
      "People looking for structured, breath-led yoga with mindful movement — including beginners. Ladies-only batches are available on request.",
    classStructure:
      "Traditional asana-focused sessions with breathing and relaxation. Batch focus and times are confirmed on WhatsApp.",
    benefits: [
      "Traditional asanas with coach guidance",
      "Mobility, breathing and relaxation",
      "Mindfulness and body awareness",
      "Flexibility, strength and balance",
      "Beginner-friendly structure",
      "Ladies-only batches available on request",
      "Everyday stress management through movement",
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
      "Yoga at Ankit’s Studio in Airoli, Ghansoli and Thane. Breath-led sessions; free trial on WhatsApp. Message us for current batch times.",
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
        answer: "Yes. Free trial enquiries are welcome on WhatsApp.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "zumba",
    name: "Zumba",
    shortDescription:
      "Beginner-friendly Zumba classes — high-energy dance fitness and group cardio, easy to follow.",
    longDescription:
      "Zumba at Ankit’s Studio is high-energy dance fitness — a group cardio and full-body workout through simple, music-led movement. Sessions support stamina and coordination in a friendly, non-judgmental room, and are especially popular among women, homemakers and working professionals. No dance background is required to enquire. Ladies-only or kids-only batches may be available as audience options on request — ask when you enquire; availability varies by branch.",
    audienceTags: ["adults", "group-class"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor:
      "Anyone looking for Zumba classes or dance-based group fitness — especially popular among women, homemakers and working professionals. Beginners welcome; no dance background required.",
    classStructure:
      "High-energy group dance-fitness sessions with simple choreography. Batch times are confirmed on WhatsApp.",
    benefits: [
      "Zumba classes as dance-based group fitness",
      "High-energy, fun group sessions",
      "Easy-to-follow dance movement",
      "Cardio and full-body activity",
      "Stamina and coordination",
      "Friendly, motivating coaches",
      "Non-judgmental community",
      "No dance background required to enquire",
      "Ladies-only or kids-only batches on request where available",
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
    seoTitle: "Zumba Classes in Airoli, Ghansoli & Thane",
    seoDescription:
      "Zumba classes and dance fitness at Ankit’s Studio — beginner-friendly group sessions in Airoli, Ghansoli and Thane. Free trial on WhatsApp.",
    relatedProgrammeSlugs: ["adult-dance", "yoga", "functional-training"],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    faqEntries: [
      {
        id: "zumba-experience",
        question: "Do I need dance experience?",
        answer:
          "No. Zumba is dance fitness — you can enquire without a dance background. The studio will help match a suitable batch.",
      },
      {
        id: "zumba-vs-dance",
        question: "How is Zumba different from Dance classes?",
        answer:
          "Zumba is dance-based group fitness and cardio. Dance focuses on learning choreography and movement styles. Both are available as separate programmes — ask which fits your goal.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "adult-dance",
    name: "Dance",
    shortDescription:
      "Adult dance classes focused on choreography and movement — including Bollywood-style sessions where available.",
    longDescription:
      "Dance at Ankit’s Studio is for learning choreography and movement — fun, energetic studio dance classes in a relaxed, non-judgmental room. Adult Dance is open to all adults; styles (including Bollywood and other choreography focuses) and batch times are confirmed when you enquire. Ladies Dance is a ladies-only batch option; Kids Dance is a kids-only batch with age-appropriate choreography supporting confidence, coordination, rhythm and stage presence (age groups 3–8 and 8–12 years). This is not Zumba dance fitness — for workout-led sessions, see Zumba. Wedding and sangeet choreography is listed separately. Branch and timing availability is confirmed when you enquire.",
    audienceTags: ["adults", "group-class", "kids", "women"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor:
      "Adults looking for dance classes or adult dance with a choreography focus — including Bollywood-style movement where offered; women interested in ladies-only batches; families asking about kids-only Dance batches.",
    classStructure:
      "Choreography-focused studio dance classes, typically about one hour. Styles and batch times are confirmed on WhatsApp.",
    benefits: [
      "Adult dance classes with a choreography focus",
      "Bollywood and other styles confirmed per batch",
      "Fun, energetic movement learning",
      "Relaxed, non-judgmental environment",
      "Adult Dance for all adults",
      "Ladies-only Dance batches available",
      "Kids-only Dance batches (3–8 and 8–12 years)",
      "Confidence, coordination and rhythm",
      "Distinct from Zumba dance-fitness classes",
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
    seoTitle: "Dance Classes — Adult, Ladies & Kids Batches",
    seoDescription:
      "Adult dance classes and choreography at Ankit’s Studio in Airoli, Ghansoli and Thane. Bollywood-style sessions where available; kids-only and ladies-only Dance batches on request. Free trial on WhatsApp.",
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
      {
        id: "dance-vs-zumba",
        question: "How is Dance different from Zumba?",
        answer:
          "Dance is about learning choreography and movement styles. Zumba is dance-based fitness and cardio. Choose Dance to learn routines; choose Zumba for a group workout.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "kids-dance",
    name: "Kids Dance",
    shortDescription: "This older link is kept for reference — ask about kids-only Dance batches.",
    longDescription:
      "This page is kept for people who found an older link. Kids-only dance batches are available under Dance — age groups include 3–8 years and 8–12 years. See Dance and ask which batch fits.",
    audienceTags: ["taxonomy-pending", "kids"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor: "Families asking about kids-only dance options — confirm age fit with the studio.",
    classStructure: "Ask about kids-only Dance batches under the Dance programme.",
    benefits: ["Kids-only batches are available to enquire about", "See Dance for current dance options"],
    difficulty: "beginner",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "adult-dance",
    seoTitle: "Kids Dance",
    seoDescription:
      "This older Kids Dance page is kept for reference. Ask Ankit’s Studio about kids-only batches under Dance.",
  },
  {
    dataStatus: "verified",
    slug: "weight-loss-fitness",
    name: "Weight-Loss & General Fitness",
    shortDescription: "This older link is kept for reference — see Functional Training.",
    longDescription:
      "This page is kept for people who found an older link. Ankit’s Studio does not promise weight-loss or other outcomes. For current machine-free coach-led fitness, see Functional Training.",
    audienceTags: ["taxonomy-pending"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "Adults exploring fitness options — ask which current services apply.",
    classStructure: "This legacy fitness page does not publish a session structure.",
    benefits: ["No promised weight-loss outcomes", "See Functional Training for machine-free fitness"],
    difficulty: "all-levels",
    requiredEquipment: [],
    deliveryMode: "in-studio",
    taxonomyStatus: "migration-pending",
    trialAvailable: true,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    taxonomyRelatedSlug: "functional-training",
    seoTitle: "Weight-Loss & General Fitness",
    seoDescription:
      "This older page is kept for reference. See Functional Training for machine-free fitness at Ankit’s Studio.",
  },
  {
    dataStatus: "verified",
    slug: "wedding-choreography",
    name: "Wedding Choreography",
    shortDescription:
      "Wedding and sangeet choreography planned around your event, songs and comfort level.",
    longDescription:
      "Wedding Choreography at Ankit’s Studio covers wedding dance choreography and sangeet routines for couples, families and groups. We start by understanding your event, participants, song preferences, dance experience and performance needs. Coaches plan suitable songs and easy-to-learn choreography with planned practice sessions — adapted to participant comfort so the goal is a confident, coordinated, enjoyable performance. Pricing is arranged per couple; exact amounts are confirmed when you enquire on WhatsApp. This is a custom service, not a fixed public batch timetable.",
    audienceTags: ["adults", "event"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "high-energy",
    whoItsFor:
      "Couples, families and groups looking for a wedding choreographer or sangeet choreography for wedding dance performances.",
    classStructure:
      "Custom wedding and sangeet choreography arranged after WhatsApp enquiry — practice sessions planned around your event, not published as open studio batches.",
    benefits: [
      "Wedding dance and sangeet choreography",
      "Understands your event, participants and song preferences",
      "Easy-to-learn routines with planned practice sessions",
      "Couple, family and group performances",
      "Adapted to participant comfort and experience",
      "Priced per couple — ask for current details",
      "Start with a WhatsApp enquiry — no fixed public timetable",
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
    seoTitle: "Wedding & Sangeet Choreography",
    seoDescription:
      "Wedding choreography and sangeet dance routines with Ankit’s Studio across Navi Mumbai and Thane. Per-couple pricing — enquire on WhatsApp.",
    relatedProgrammeSlugs: ["adult-dance", "zumba"],
    faqEntries: [
      {
        id: "wedding-price",
        question: "How is wedding choreography priced?",
        answer:
          "Pricing is per couple. Exact amounts and packages are confirmed when you enquire. Registration after joining is ₹300 one-time per person where membership applies.",
      },
      {
        id: "wedding-start",
        question: "How do I start a wedding or sangeet enquiry?",
        answer:
          "Message us on WhatsApp with your event date, number of participants and any song preferences. The studio confirms suitability, practice planning and pricing after that conversation.",
      },
      {
        id: "wedding-sangeet",
        question: "Do you cover sangeet choreography as well as wedding dances?",
        answer:
          "Yes. Wedding Choreography includes wedding dance and sangeet-style routines for couples, families and groups — planned around your event needs.",
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "home-personal-training",
    name: "Home Personal Training",
    shortDescription: "One-to-one coach-led sessions at your home in Navi Mumbai and Thane.",
    longDescription:
      "Home Personal Training brings private, convenient one-to-one coaching to your location across Navi Mumbai and Thane, subject to location and trainer availability. Sessions suit beginners, busy professionals, homemakers and seniors — coaches consider your goals, fitness level, schedule, space and equipment when planning exercise selection, intensity, pace and progression. Pricing is per session; share your locality when you enquire.",
    audienceTags: ["adults", "home-delivery"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor:
      "People who want one-to-one coaching at home in Navi Mumbai or Thane — including beginners, busy professionals, homemakers and seniors.",
    classStructure:
      "Sessions scheduled after enquiry at your location. Typical sessions are about one hour.",
    benefits: [
      "Privacy and convenience at your location",
      "One-to-one coach-led sessions",
      "Navi Mumbai and Thane coverage — subject to availability",
      "Personalised exercise selection and progression",
      "Priced per session — ask for current rates",
      "Goals, space and equipment considered",
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
        answer:
          "Home Personal Training is available across Navi Mumbai and Thane, subject to location and trainer availability. Share your locality when you enquire.",
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
    shortDescription: "Live coach-led sessions on Zoom — one-to-one and small groups.",
    longDescription:
      "Online Training with Ankit’s Studio uses Zoom for live, coach-led sessions in one-to-one and structured small-group formats. Coaches guide workouts with demonstrations and form corrections, adapted to your fitness level, goals, available space, equipment and schedule — useful when you cannot visit a studio regularly.",
    audienceTags: ["adults", "online-delivery"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "strength",
    whoItsFor: "People who want coach-led sessions online via Zoom.",
    classStructure:
      "Online sessions on Zoom after enquiry — one-to-one or group. Typical sessions are about one hour.",
    benefits: [
      "Live sessions on Zoom",
      "One-to-one and structured small-group formats",
      "Demonstrations and form corrections",
      "Adapted to fitness level, goals and equipment",
      "Useful when studio visits are difficult",
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
  {
    dataStatus: "verified",
    slug: "corporate-wellness",
    name: "Corporate Wellness",
    shortDescription:
      "Corporate fitness for teams — employee yoga, Zumba and movement sessions at your workplace or online.",
    longDescription:
      "Corporate Wellness at Ankit’s Studio is a B2B fitness service for companies investing in employee fitness — not medical screenings or diagnostic health camps. Customised programmes can include corporate yoga, corporate Zumba, functional fitness, mobility, mindfulness and team movement sessions, delivered at your workplace or online. Programmes can support employee engagement, corporate events and workplace wellness activities, with coordination alongside HR, admin and facility teams. Plans depend on team size, objectives, duration, location and schedule; pricing is supplied on enquiry.",
    audienceTags: ["corporate", "workplace", "wellness"],
    branchSlugs: [...ALL_BRANCHES],
    heroAccent: "calm",
    whoItsFor:
      "Companies and HR teams looking for corporate fitness, employee fitness sessions or workplace movement programmes — on-site or online.",
    classStructure:
      "Programme scope, format and schedule are planned after enquiry with your HR or admin contact — this is a service enquiry, not a consumer free-trial class.",
    benefits: [
      "Corporate fitness and employee movement sessions",
      "Workplace or online delivery",
      "Corporate yoga and corporate Zumba options",
      "Functional fitness and mobility for teams",
      "Mindfulness and team movement sessions",
      "Employee-engagement and corporate event support",
      "Coordination with HR, admin and facility teams",
      "Plans tailored to team size, goals and schedule",
      "Pricing supplied on enquiry",
    ],
    difficulty: "all-levels",
    requiredEquipment: [],
    taxonomyStatus: "confirmed",
    serviceCluster: "teams",
    conversionIntent: "service-enquiry",
    trialAvailable: false,
    pricingStatus: PENDING_PRICING,
    batchScheduleStatus: PENDING_BATCHES,
    mediaSlotKey: "service.corporate-wellness",
    seoTitle: "Corporate Fitness & Employee Wellness Sessions",
    seoDescription:
      "Corporate fitness for teams — yoga, Zumba, functional training and workplace movement sessions with Ankit’s Studio, on-site or online. B2B enquiry on WhatsApp.",
    relatedProgrammeSlugs: ["functional-training", "yoga", "zumba", "online-training"],
    faqEntries: [
      {
        id: "corporate-delivery",
        question: "Where are corporate sessions delivered?",
        answer:
          "Sessions can be delivered at your workplace or online, depending on what suits your team. Scope and logistics are confirmed when you enquire.",
      },
      {
        id: "corporate-pricing",
        question: "How is Corporate Wellness priced?",
        answer:
          "Pricing depends on team size, programme scope, duration and delivery format. Message us for a tailored quote.",
      },
      {
        id: "corporate-content",
        question: "What can programmes include?",
        answer:
          "Programmes may include corporate yoga, Zumba, functional fitness, mobility, mindfulness and team movement sessions — planned around your objectives. This is fitness programming, not medical screening or diagnostic camps.",
      },
    ],
  },
];
