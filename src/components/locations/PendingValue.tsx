import type { ReactNode } from "react";
import { Caption } from "@/components/ui/Typography";
import { isToBeConfirmed } from "./types";

export type FieldDisclaimerProps = {
  children: ReactNode;
  className?: string;
};

export function FieldDisclaimer({ children, className = "" }: FieldDisclaimerProps) {
  return (
    <Caption className={["text-ink-subtle", className].filter(Boolean).join(" ")} as="p">
      {children}
    </Caption>
  );
}

export type PendingValueProps = {
  value: string | null | undefined;
  fallback?: string;
  className?: string;
  as?: "p" | "span" | "address";
};

export function PendingValue({
  value,
  fallback = "To be confirmed",
  className = "",
  as: Comp = "p",
}: PendingValueProps) {
  const pending = isToBeConfirmed(value);
  const text = pending ? fallback : (value as string);

  return (
    <Comp
      className={[
        "break-words text-pretty",
        pending ? "text-ink-muted italic" : "text-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {text}
      {pending ? <span className="sr-only"> (not yet confirmed)</span> : null}
    </Comp>
  );
}
