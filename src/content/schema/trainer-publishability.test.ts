import { describe, expect, it } from "vitest";
import {
  isTrainerPublishable,
  TRAINERS_ROUTE_INDEX_THRESHOLD,
  type Trainer,
} from "@/content/schema/trainer";

function baseTrainer(overrides: Partial<Trainer> = {}): Trainer {
  return {
    dataStatus: "verified",
    id: "t1",
    slug: "coach-one",
    name: "Verified Coach",
    photo: {
      src: "/media/trainers/coach-one.jpg",
      alt: "Verified Coach",
      width: 800,
      height: 1000,
    },
    role: "Functional Training coach",
    specialties: ["functional-training"],
    branchSlugs: ["airoli-sector-19"],
    qualifications: ["Owner-confirmed qualification"],
    certifications: [],
    publicationConsentStatus: "granted",
    profileVerificationStatus: "publishable",
    profilePublicationStatus: "published",
    photoPublicationPermission: true,
    ...overrides,
  } as Trainer;
}

describe("isTrainerPublishable", () => {
  it("accepts a fully publishable verified profile", () => {
    expect(isTrainerPublishable(baseTrainer())).toBe(true);
  });

  it("rejects owner-provided name alone without photo consent and publication", () => {
    expect(
      isTrainerPublishable(
        baseTrainer({
          profilePublicationStatus: "draft",
          photoPublicationPermission: false,
          profileVerificationStatus: "owner_provided",
        }),
      ),
    ).toBe(false);
  });

  it("rejects mock dataStatus even if other fields look complete", () => {
    expect(
      isTrainerPublishable(
        baseTrainer({
          dataStatus: "mock",
          mockDisclaimer: "Illustrative",
        } as Trainer),
      ),
    ).toBe(false);
  });

  it("rejects missing programme and branch relationships", () => {
    expect(
      isTrainerPublishable(
        baseTrainer({
          specialties: [],
          branchSlugs: [],
        }),
      ),
    ).toBe(false);
  });

  it("exports an indexing threshold of three publishable profiles", () => {
    expect(TRAINERS_ROUTE_INDEX_THRESHOLD).toBe(3);
  });
});
