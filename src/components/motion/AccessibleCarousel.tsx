"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

export type CarouselSlide = {
  id: string;
  content: ReactNode;
};

export type AccessibleCarouselProps = {
  slides: CarouselSlide[];
  label: string;
  className?: string;
};

/**
 * Lightweight, keyboard-accessible carousel. Prefer static grids when a
 * carousel is not required — this exists for testimonials / galleries.
 * No autoplay (avoids vestibular / distraction issues).
 */
export function AccessibleCarousel({
  slides,
  label,
  className = "",
}: AccessibleCarouselProps) {
  const [index, setIndex] = useState(0);
  const labelId = useId();
  const trackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      const wrapped = (next + slides.length) % slides.length;
      setIndex(wrapped);
    },
    [slides.length],
  );

  useEffect(() => {
    const active = trackRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.focus({ preventScroll: true });
  }, [index]);

  if (slides.length === 0) return null;

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(slides.length - 1);
    }
  };

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
    >
      <p id={labelId} className="sr-only">
        {label}
      </p>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[length:var(--text-caption)] text-ink-muted" aria-live="polite">
          Slide {index + 1} of {slides.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-raised text-ink touch-target focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-raised text-ink touch-target focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative"
        onKeyDown={onKeyDown}
      >
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slides.length}`}
              data-active={active ? "true" : "false"}
              tabIndex={active ? 0 : -1}
              hidden={!active}
              className="rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            >
              {slide.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
