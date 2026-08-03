"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

const fieldClass =
  "mt-1.5 w-full min-h-12 rounded-none border border-border bg-surface-raised px-3 py-2.5 text-ink font-[family-name:var(--font-sans)] text-[length:var(--text-body)] shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-ink font-[family-name:var(--font-sans)]">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-[length:var(--text-caption)] text-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="[&_input]:aria-[invalid=true]:border-danger [&_select]:aria-[invalid=true]:border-danger [&_textarea]:aria-[invalid=true]:border-danger">
        {children}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) {
  const { className = "", invalid, ...rest } = props;
  return (
    <input
      className={[fieldClass, className].filter(Boolean).join(" ")}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function TextSelect(props: ComponentPropsWithoutRef<"select"> & { invalid?: boolean }) {
  const { className = "", invalid, children, ...rest } = props;
  return (
    <select
      className={[fieldClass, className].filter(Boolean).join(" ")}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {children}
    </select>
  );
}

export function TextTextarea(props: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) {
  const { className = "", invalid, ...rest } = props;
  return (
    <textarea
      className={[fieldClass, "min-h-28", className].filter(Boolean).join(" ")}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export { fieldClass };
