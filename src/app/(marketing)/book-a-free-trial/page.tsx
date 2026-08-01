import { redirect } from "next/navigation";

/**
 * Alias for the canonical trial booking route (`/trial` per IA).
 * Keeps the user-requested `/book-a-free-trial` path working.
 */
export default function BookAFreeTrialAliasPage() {
  redirect("/trial");
}
