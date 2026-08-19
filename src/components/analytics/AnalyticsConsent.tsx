"use client";

import { useCallback, useEffect, useReducer } from "react";
import { updateConsent } from "@/lib/analytics";

const STORAGE_KEY = "analytics_consent";

type Consent = "granted" | "denied" | null;

function getStoredConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

type State = { phase: "loading" | "prompt" | "resolved" };

function reducer(_: State, consent: Consent): State {
  return consent ? { phase: "resolved" } : { phase: "prompt" };
}

export function AnalyticsConsent() {
  const [state, dispatch] = useReducer(reducer, { phase: "loading" });

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) updateConsent(stored);
    dispatch(stored);
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "granted");
    updateConsent("granted");
    dispatch("granted");
  }, []);

  const reject = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "denied");
    updateConsent("denied");
    dispatch("denied");
  }, []);

  if (state.phase !== "prompt") return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "1rem var(--layout-gutter, 1.25rem)",
        background: "var(--color-field-raised, #1a1520)",
        borderTop: "1px solid var(--rule-structural, rgba(255,255,255,0.12))",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem 1.5rem",
        fontFamily: "var(--font-sans, sans-serif)",
        fontSize: "0.8125rem",
        color: "var(--color-muted-on-field, rgba(255,255,255,0.7))",
      }}
    >
      <p style={{ margin: 0, flex: "1 1 280px" }}>
        We use analytics cookies to understand how visitors use our site.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{
            padding: "0.5rem 1.25rem",
            background: "var(--color-accent, #7c3aed)",
            color: "var(--color-accent-foreground, #fff)",
            border: "none",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={reject}
          style={{
            padding: "0.5rem 1.25rem",
            background: "transparent",
            color: "var(--color-ink-inverse, #fff)",
            border: "1px solid var(--rule-structural, rgba(255,255,255,0.12))",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
