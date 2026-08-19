"use client";

import { useId, useState } from "react";
import styles from "./pulse/pulse-home.module.css";

const PREVIEW_CHARS = 220;

export function GoogleReviewText({ text }: { text: string }) {
  const previewId = useId();
  const needsToggle = text.length > PREVIEW_CHARS;
  const [expanded, setExpanded] = useState(false);

  if (!needsToggle) {
    return (
      <blockquote className={styles.googleProofQuote}>
        <p>{text}</p>
      </blockquote>
    );
  }

  const preview = `${text.slice(0, PREVIEW_CHARS).trimEnd()}…`;

  return (
    <blockquote className={styles.googleProofQuote}>
      <p id={previewId}>{expanded ? text : preview}</p>
      <button
        type="button"
        className={styles.googleProofReadMore}
        aria-expanded={expanded}
        aria-controls={previewId}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </blockquote>
  );
}
