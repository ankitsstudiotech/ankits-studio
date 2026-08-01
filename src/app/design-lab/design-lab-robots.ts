import type { Metadata } from "next";

/** Shared noindex policy for every /design-lab/** route. */
export const designLabRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

/** Nested revamp layouts use a compact robots object (inherits shell policy). */
export const designLabRevampRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};
