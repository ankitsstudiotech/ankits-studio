import type { ReactNode } from "react";
import { Caption } from "@/components/ui/Typography";

export type MockDisclaimerProps = {
  children: ReactNode;
  className?: string;
};

/** Visible mock/reference labelling — never omit for unverified domains. */
export function MockDisclaimer({ children, className = "" }: MockDisclaimerProps) {
  return (
    <Caption
      className={["text-ink-subtle", className].filter(Boolean).join(" ")}
      as="p"
    >
      {children}
    </Caption>
  );
}
