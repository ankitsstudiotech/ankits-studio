import { GARBA_NIGHT_2026, type GarbaNight2026 } from "./garba-night-2026";

export type {
  EventBookingMode,
  EventLifecycle,
  GarbaMediaAvailability,
  GarbaNight2026,
} from "./garba-night-2026";
export { GARBA_NIGHT_2026, GARBA_WHATSAPP_PREFILL } from "./garba-night-2026";

const EVENTS: readonly GarbaNight2026[] = [GARBA_NIGHT_2026];

export function getSeasonalEvents(): readonly GarbaNight2026[] {
  return EVENTS;
}

export function getGarbaNight2026(): GarbaNight2026 {
  return GARBA_NIGHT_2026;
}

/** Upcoming seasonal events eligible for homepage / contextual promotion. */
export function getActiveSeasonalPromos(): readonly GarbaNight2026[] {
  return EVENTS.filter((event) => event.lifecycle === "upcoming");
}

export function getEventBySlug(slug: string): GarbaNight2026 | undefined {
  return EVENTS.find((event) => event.slug === slug);
}
