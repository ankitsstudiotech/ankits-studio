import type { Trainer } from "../schema";

/**
 * Production trainer roster is empty until owner-verified, publishable profiles exist.
 * Illustrative mock people must not render on /trainers (ADR-019).
 * Design-lab may use isolated fixtures — never this catalogue for public marketing.
 */
export const mockTrainers: Trainer[] = [];
