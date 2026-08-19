const SENSITIVE = /key|authorization|payload|reviewer|email|photo|text|name/i;

export function logGoogleReviewsDiagnostic(
  message: string,
  extra?: Record<string, unknown>,
): void {
  if (!extra) {
    console.warn(`[google-reviews] ${message}`);
    return;
  }

  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(extra)) {
    if (SENSITIVE.test(key)) continue;
    if (typeof value === "string" && value.length > 80) continue;
    safe[key] = value;
  }
  console.warn(`[google-reviews] ${message}`, safe);
}
