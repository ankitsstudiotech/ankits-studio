import type { TimetableSlot } from "../schema";

/**
 * Illustrative placeholder slots — kept for provenance / launch-gate detection.
 * Public accessor `getTimetableSlots()` returns **verified slots only** and will
 * not surface these rows on marketing routes.
 */
export const mockTimetableSlots: TimetableSlot[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
    id: "airoli-strength-mon-am",
    branchSlug: "airoli",
    programmeSlug: "strength-training",
    dayOfWeek: 0,
    startTime: "06:30",
    endTime: "07:30",
    trainerSlug: "illustrative-trainer-1",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
    id: "airoli-yoga-tue-am",
    branchSlug: "airoli",
    programmeSlug: "yoga",
    dayOfWeek: 1,
    startTime: "07:00",
    endTime: "08:00",
    trainerSlug: "illustrative-trainer-2",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
    id: "ghansoli-zumba-wed-pm",
    branchSlug: "ghansoli",
    programmeSlug: "zumba",
    dayOfWeek: 2,
    startTime: "18:00",
    endTime: "19:00",
    trainerSlug: "illustrative-trainer-2",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
    id: "ghansoli-strength-thu-pm",
    branchSlug: "ghansoli",
    programmeSlug: "strength-training",
    dayOfWeek: 3,
    startTime: "18:30",
    endTime: "19:30",
    trainerSlug: "illustrative-trainer-1",
  },
];
