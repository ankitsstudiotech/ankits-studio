import type { Trainer } from "../schema";

export const mockTrainers: Trainer[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative trainer profile — not a real staff member.",
    slug: "illustrative-trainer-1",
    name: "Illustrative Trainer — A.",
    photo: {
      src: "/mock/trainers/placeholder-1.svg",
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
      src: "/mock/trainers/placeholder-2.svg",
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
