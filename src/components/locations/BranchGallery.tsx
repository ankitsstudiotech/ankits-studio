import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { MediaProps } from "./types";

export type BranchGalleryProps = {
  photos: MediaProps[];
  title?: string;
  emptyLabel?: string;
  disclaimer?: string;
};

export function BranchGallery({
  photos,
  title = "Branch gallery",
  emptyLabel = "Branch photography to be confirmed. Placeholders keep layout stable until real assets arrive.",
  disclaimer,
}: BranchGalleryProps) {
  return (
    <Section id="gallery" eyebrow="Gallery" title={title}>
      {photos.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-sunken px-4 text-center text-ink-muted"
            role="img"
            aria-label="Branch photo placeholder one"
          >
            Photo slot — replace later
          </div>
          <div
            className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-sunken px-4 text-center text-ink-muted"
            role="img"
            aria-label="Branch photo placeholder two"
          >
            Photo slot — replace later
          </div>
          <Body className="sm:col-span-2">{emptyLabel}</Body>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.src}>
              <MediaFrame
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 1024px) 50vw, 30vw"
                placeholderLabel={photo.placeholderLabel ?? "Branch photo"}
              />
            </li>
          ))}
        </ul>
      )}
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
