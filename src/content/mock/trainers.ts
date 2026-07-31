import type { Trainer } from "../schema";

/**
 * `photo.src` points at `/mock-media/programme-placeholder.svg` — a real,
 * existing placeholder asset. It previously pointed at
 * `/mock/trainers/placeholder-{1,2}.svg`, which was never a real file
 * (would 404 under next/image); fixed while wiring trainer photos into the
 * new programme/location pages — see docs/HANDOFF-ROUTES.md.
 */
export const mockTrainers: Trainer[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative trainer profile — not a real staff member.",
    slug: "illustrative-trainer-1",
    name: "Illustrative Trainer — A.",
    photo: {
      src: "/mock-media/programme-placeholder.svg",
      alt: "Placeholder illustration standing in for a trainer photo",
      width: 480,
      height: 480,
    },
    qualifications: ["Placeholder certification — not verified"],
    specialties: ["strength-training", "personal-training"],
    branchSlugs: ["airoli", "ghansoli"],
    bio: "Illustrative bio text describing a strength and personal-training coach. Not a real person.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative trainer profile — not a real staff member.",
    slug: "illustrative-trainer-2",
    name: "Illustrative Trainer — B.",
    photo: {
      src: "/mock-media/programme-placeholder.svg",
      alt: "Placeholder illustration standing in for a trainer photo",
      width: 480,
      height: 480,
    },
    qualifications: ["Placeholder certification — not verified"],
    specialties: ["yoga", "zumba"],
    branchSlugs: ["airoli", "ghansoli"],
    bio: "Illustrative bio text describing a yoga and Zumba instructor. Not a real person.",
  },
];
