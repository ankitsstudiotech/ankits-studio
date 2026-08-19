const PRICING_ENQUIRY_ID = "pricing-enquiry";
const TIMETABLE_ENQUIRY_ID = "availability-enquiry";
const PROGRAMME_CLOSING_ID = "programme-closing";

export function getSoftHideTarget(): HTMLElement | null {
  return (
    document.getElementById(PRICING_ENQUIRY_ID) ||
    document.getElementById(TIMETABLE_ENQUIRY_ID) ||
    document.getElementById(PROGRAMME_CLOSING_ID)
  );
}

/** True when the in-page conversion block occupies a meaningful slice of the viewport. */
export function isSoftHideTargetInView(): boolean {
  const el = getSoftHideTarget();
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const viewH = window.innerHeight || 0;
  const visible = Math.min(rect.bottom, viewH) - Math.max(rect.top, 0);
  if (visible <= 0) return false;
  return visible / Math.min(rect.height, viewH) >= 0.15;
}

export function subscribeSoftHide(onStoreChange: () => void): () => void {
  const notify = () => onStoreChange();
  const intervalId = window.setInterval(notify, 200);
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify);
  const target = getSoftHideTarget();
  const observer =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(notify, {
          root: null,
          threshold: [0, 0.15, 1],
          rootMargin: "0px 0px -10% 0px",
        })
      : null;
  if (target && observer) observer.observe(target);
  notify();
  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
    observer?.disconnect();
  };
}
