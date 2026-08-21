import type { Guide } from "../schema/guide";

const PUBLISHED = "2026-08-21";

/**
 * SEO Growth Content Batch 1 — studio-authored evergreen guides.
 * Educational + commercial linking only. No invented fees, medical claims,
 * or unverified operational numbers (research/seo-market/site-growth/).
 */
export const mockGuides: Guide[] = [
  {
    dataStatus: "verified",
    slug: "zumba-for-beginners",
    title: "Zumba for Beginners: What to Expect in Your First Class",
    h1: "Zumba for beginners: what your first class feels like",
    description:
      "What a first Zumba class is like — no dance background needed. How instructor-led sessions work, what to wear, and how to try Zumba at Ankit’s Studio.",
    excerpt: "No dance background needed. What your first instructor-led Zumba class actually feels like.",
    cluster: "zumba",
    clusterLabel: "Zumba",
    primaryProgrammeSlug: "zumba",
    relatedGuideSlugs: ["zumba-vs-gym"],
    ctaKind: "free-trial",
    ctaLabel: "Book a free Zumba trial",
    publishedAt: PUBLISHED,
    modifiedAt: PUBLISHED,
    blocks: [
      {
        type: "p",
        children: [
          "Zumba is a group dance-fitness class. You follow an instructor through upbeat tracks — you do not need prior dance training, and nobody expects you to memorise a full routine before you walk in.",
        ],
      },
      {
        type: "h2",
        text: "Do you need dance experience?",
      },
      {
        type: "p",
        children: [
          "No. Most people join because they want a fun, music-led workout rather than a formal dance class. If a step feels unfamiliar, you keep moving with the room at a pace that feels workable for you.",
        ],
      },
      {
        type: "h2",
        text: "What a class generally feels like",
      },
      {
        type: "ul",
        items: [
          "The instructor leads from the front; the room follows.",
          "Tracks change through the session — energy rises and falls.",
          "You watch and copy rather than learning choreography for a stage.",
          "Intensity varies by song and by how hard you choose to push.",
        ],
      },
      {
        type: "p",
        children: [
          "If you need a lighter moment, step in place or take a short water break. Coaches expect beginners to find their rhythm over a few classes, not on minute one.",
        ],
      },
      {
        type: "h2",
        text: "Useful first-class preparation",
      },
      {
        type: "ul",
        items: [
          "Arrive a few minutes early so you can settle and meet the coach.",
          "Wear breathable clothes you can move in freely.",
          "Use supportive trainers or cross-trainers that stay secure when you turn.",
          "Bring water.",
        ],
      },
      {
        type: "h2",
        text: "Zumba vs Dance classes",
      },
      {
        type: "p",
        children: [
          "Zumba is workout-led dance fitness. ",
          { href: "/programs/adult-dance", label: "Dance classes" },
          " at the studio focus on learning choreography and movement for stage or personal skill — including adult, ladies-only, and kids batch options where available. If you want a fitness session set to music, start with Zumba. If you want to learn routines, start with Dance.",
        ],
      },
      {
        type: "h2",
        text: "Try Zumba at Ankit’s Studio",
      },
      {
        type: "p",
        children: [
          "Zumba runs across our neighbourhood studios in Airoli, Ghansoli and Thane. See ",
          { href: "/programs/zumba", label: "Zumba classes" },
          " for the programme overview, or browse ",
          { href: "/locations", label: "studio locations" },
          ". Batch times are confirmed when you enquire — book a free trial on WhatsApp to get started.",
        ],
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "functional-training-vs-gym",
    title: "Functional Training vs Gym: Which Suits You?",
    h1: "Functional training vs gym — how to choose",
    description:
      "Honest comparison of coach-led functional training and a conventional gym floor — who each suits, and how Ankit’s Studio approaches machine-free sessions.",
    excerpt: "Coach-led movement versus a machine gym floor — choose what matches how you like to train.",
    cluster: "functional",
    clusterLabel: "Functional Training",
    primaryProgrammeSlug: "functional-training",
    relatedGuideSlugs: ["zumba-vs-gym"],
    ctaKind: "free-trial",
    ctaLabel: "Try Functional Training",
    publishedAt: PUBLISHED,
    modifiedAt: PUBLISHED,
    blocks: [
      {
        type: "p",
        children: [
          "People often ask whether they should join a gym or try functional training. They solve overlapping goals with different environments. Neither is “wrong” — the better fit is the one you will actually return to.",
        ],
      },
      {
        type: "h2",
        text: "What people usually mean by “gym”",
      },
      {
        type: "p",
        children: [
          "A conventional gym is typically an equipment floor: machines, free weights, and self-directed sessions. Some members train alone; others add a personal trainer. Progress depends on your plan, consistency, and how comfortable you are navigating the floor.",
        ],
      },
      {
        type: "h2",
        text: "What functional training emphasises",
      },
      {
        type: "p",
        children: [
          "At Ankit’s Studio, ",
          { href: "/programs/functional-training", label: "Functional Training" },
          " is coach-led strength, mobility and conditioning — machine-free sessions built around real-life movement patterns rather than rows of gym machines. Work may include bodyweight, bands, dumbbells, kettlebells and mats, adapted to your level inside a guided group session.",
        ],
      },
      {
        type: "table",
        caption: "Quick comparison",
        headers: ["", "Conventional gym", "Functional Training (studio)"],
        rows: [
          ["Environment", "Equipment / machine floor", "Coach-led session space"],
          ["Guidance", "Self-directed or optional PT", "Coach leads the session"],
          ["Focus", "Often machine or free-weight goals", "Strength, mobility, conditioning patterns"],
          ["Best if you…", "Like independent training on equipment", "Want structured coaching without a machine floor"],
        ],
      },
      {
        type: "h2",
        text: "When a conventional gym may suit you better",
      },
      {
        type: "ul",
        items: [
          "You specifically want heavy barbell work or specialised machines.",
          "You prefer training alone on your own programme.",
          "You enjoy a large open floor and long self-paced sessions.",
        ],
      },
      {
        type: "h2",
        text: "When functional training may suit you better",
      },
      {
        type: "ul",
        items: [
          "You want a coach setting the session and watching form.",
          "You prefer machine-free training with clear structure.",
          "You like the accountability of showing up to a led class.",
        ],
      },
      {
        type: "p",
        children: [
          "If you want music-led cardio instead of strength sessions, see ",
          { href: "/guides/zumba-vs-gym", label: "Zumba vs gym" },
          " or ",
          { href: "/programs/zumba", label: "Zumba" },
          ". Ready to try coach-led training? Book a free trial and we will confirm the right batch for you.",
        ],
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "how-sangeet-choreography-works",
    title: "How Sangeet & Wedding Choreography Works",
    h1: "How sangeet and wedding choreography works",
    description:
      "How couples and families prepare sangeet and wedding dances — from songs and participants to practice — and how to enquire with Ankit’s Studio.",
    excerpt: "From songs and participants to practice — how wedding and sangeet choreography is usually planned.",
    cluster: "wedding",
    clusterLabel: "Wedding & Sangeet",
    primaryProgrammeSlug: "wedding-choreography",
    relatedGuideSlugs: [],
    ctaKind: "wedding-enquiry",
    ctaLabel: "Enquire about wedding choreography",
    publishedAt: PUBLISHED,
    modifiedAt: PUBLISHED,
    blocks: [
      {
        type: "p",
        children: [
          "Sangeet and wedding choreography is custom work. Couples, families and friend groups learn routines for a specific event — not a weekly open class. The process is collaborative, and details always depend on your songs, guests and timeline.",
        ],
      },
      {
        type: "h2",
        text: "What people usually prepare",
      },
      {
        type: "ul",
        items: [
          "Couple performances",
          "Family or friend group dances",
          "Entrances or special moments for the celebration",
        ],
      },
      {
        type: "h2",
        text: "A typical preparation flow",
      },
      {
        type: "p",
        children: [
          "Most planning starts with an enquiry: who will dance, which songs you love, how much dance experience the group has, and when the event is. From there a coach shapes choreography that fits the group, then you practise together on a schedule that works around work and travel. Exact rehearsal counts and timelines vary by wedding — we confirm those when we understand your event.",
        ],
      },
      {
        type: "h2",
        text: "If you are not a dancer",
      },
      {
        type: "p",
        children: [
          "That is normal. Good wedding choreography favours clear, repeatable steps over complex technique. Practice in shorter, regular sessions usually beats one long cram. Wear similar shoes to your event at least once so the floor feel is familiar.",
        ],
      },
      {
        type: "h2",
        text: "DIY vs hiring a choreographer",
      },
      {
        type: "p",
        children: [
          "Some families learn from videos and enjoy that process. A choreographer helps when you want structure, cleaner formations, or a coach who can adapt steps for mixed ages and confidence levels. Neither path is mandatory — choose based on time, group size and how polished you want the moment to feel.",
        ],
      },
      {
        type: "h2",
        text: "How Ankit’s Studio approaches it",
      },
      {
        type: "p",
        children: [
          { href: "/programs/wedding-choreography", label: "Wedding Choreography" },
          " covers wedding and sangeet routines for couples, families and groups across Navi Mumbai and Thane. We start by understanding your event, participants and songs, then plan practice around your schedule. Pricing is arranged per couple and confirmed when you enquire — we do not publish a fixed public batch timetable for this service.",
        ],
      },
      {
        type: "p",
        children: [
          "If you also want ongoing ",
          { href: "/programs/adult-dance", label: "studio Dance classes" },
          " beyond the wedding, that is a separate programme. Message us on WhatsApp to discuss your sangeet or wedding choreography.",
        ],
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "zumba-vs-gym",
    title: "Zumba vs Gym: Which Is Better for You?",
    h1: "Zumba vs gym — picking the workout you’ll stick with",
    description:
      "Zumba versus a conventional gym — different jobs, overlapping fitness goals. When group dance fitness fits, and when a gym floor (or Functional Training) may suit you better.",
    excerpt: "Music-led group fitness versus a gym floor — pick the format you’ll actually keep.",
    cluster: "zumba",
    clusterLabel: "Zumba",
    primaryProgrammeSlug: "zumba",
    relatedGuideSlugs: ["zumba-for-beginners", "functional-training-vs-gym"],
    ctaKind: "free-trial",
    ctaLabel: "Book a free Zumba trial",
    publishedAt: PUBLISHED,
    modifiedAt: PUBLISHED,
    blocks: [
      {
        type: "p",
        children: [
          "“Zumba or gym?” is really a question about format. One is an instructor-led group session set to music. The other is usually an equipment floor you navigate yourself. Many people use both at different times of the week.",
        ],
      },
      {
        type: "h2",
        text: "What Zumba is for",
      },
      {
        type: "ul",
        items: [
          "Instructor-led group energy",
          "Music and dance-fitness movement",
          "A cardio-style session you follow rather than programme alone",
        ],
      },
      {
        type: "p",
        children: [
          "It often suits people who get bored on machines, or who want a social class without needing dance exam technique. New to the format? Read ",
          { href: "/guides/zumba-for-beginners", label: "Zumba for beginners" },
          ".",
        ],
      },
      {
        type: "h2",
        text: "What a gym is for",
      },
      {
        type: "ul",
        items: [
          "Broader equipment options",
          "Self-directed strength or cardio on your own schedule",
          "Optional personal training depending on the facility",
        ],
      },
      {
        type: "h2",
        text: "They are not mutually exclusive",
      },
      {
        type: "p",
        children: [
          "Some members keep a gym membership for lifting and add Zumba for enjoyable cardio. Others replace solo cardio with classes and leave strength for another day. Consistency matters more than picking a “winner.”",
        ],
      },
      {
        type: "h2",
        text: "If you want coach-led strength instead",
      },
      {
        type: "p",
        children: [
          "If the gym feels intimidating but you still want structured strength and conditioning, look at ",
          { href: "/programs/functional-training", label: "Functional Training" },
          " — or the deeper comparison in ",
          { href: "/guides/functional-training-vs-gym", label: "Functional training vs gym" },
          ".",
        ],
      },
      {
        type: "p",
        children: [
          "Curious about Zumba at Ankit’s Studio? See ",
          { href: "/programs/zumba", label: "Zumba classes" },
          " and book a free trial on WhatsApp.",
        ],
      },
    ],
  },
  {
    dataStatus: "verified",
    slug: "home-personal-training-vs-gym",
    title: "Home Personal Training vs Gym: What’s the Difference?",
    h1: "Home personal training vs gym",
    description:
      "Home personal training versus a gym membership — privacy, coaching and convenience compared, plus honest limits of training at home in Navi Mumbai and Thane.",
    excerpt: "One-to-one coaching at home versus a gym floor — convenience, privacy and trade-offs.",
    cluster: "home-pt",
    clusterLabel: "Personal Training",
    primaryProgrammeSlug: "home-personal-training",
    relatedGuideSlugs: ["functional-training-vs-gym"],
    ctaKind: "home-pt-enquiry",
    ctaLabel: "Enquire about Home Personal Training",
    publishedAt: PUBLISHED,
    modifiedAt: PUBLISHED,
    blocks: [
      {
        type: "p",
        children: [
          "A gym membership buys access to a facility. Home personal training buys dedicated coach time at your location. They answer different constraints — commute, privacy, confidence, and how much guidance you want.",
        ],
      },
      {
        type: "h2",
        text: "Home personal training",
      },
      {
        type: "ul",
        items: [
          "One-to-one attention for the whole session",
          "No commute to a gym floor",
          "Privacy if you prefer not to train in public",
          "Sessions planned around your space, schedule and available equipment",
        ],
      },
      {
        type: "p",
        children: [
          "At Ankit’s Studio, ",
          { href: "/programs/home-personal-training", label: "Home Personal Training" },
          " covers Navi Mumbai and Thane subject to location and trainer availability. It often suits beginners, busy professionals, homemakers and anyone who wants individual coaching without a membership floor.",
        ],
      },
      {
        type: "h2",
        text: "A conventional gym",
      },
      {
        type: "ul",
        items: [
          "Wide equipment choice once you are there",
          "Independent schedule within opening hours",
          "Optional floor trainers or PT add-ons depending on the gym",
        ],
      },
      {
        type: "h2",
        text: "Honest limits of Home PT",
      },
      {
        type: "ul",
        items: [
          "Your available floor space shapes exercise selection.",
          "Equipment at home may be limited compared with a full gym.",
          "Session times depend on trainer scheduling in your area.",
        ],
      },
      {
        type: "h2",
        text: "Other options at Ankit’s Studio",
      },
      {
        type: "p",
        children: [
          "If travel or home visits are difficult, ",
          { href: "/programs/online-training", label: "Online Training" },
          " offers live coach-led sessions on Zoom. If you prefer studio strength sessions with a group coach, see ",
          { href: "/programs/functional-training", label: "Functional Training" },
          " or ",
          { href: "/guides/functional-training-vs-gym", label: "Functional training vs gym" },
          ".",
        ],
      },
      {
        type: "p",
        children: [
          "Pricing for Home Personal Training is per session and confirmed when you enquire — share your locality on WhatsApp and we will check availability.",
        ],
      },
    ],
  },
];
