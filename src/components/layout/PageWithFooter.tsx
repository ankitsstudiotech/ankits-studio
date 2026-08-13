import type { ReactNode } from "react";
import { ResolvedSiteFooter } from "./ResolvedSiteFooter";

/**
 * Places the marketing footer after page content in the same RSC payload so
 * it cannot appear in the layout shell's first paint.
 */
export function PageWithFooter({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ResolvedSiteFooter />
    </>
  );
}
