import Link from "next/link";
import type { Trainer } from "@/content/schema";
import { isTrainerPublishable } from "@/content/schema/trainer";
import styles from "./trainers.module.css";

export type PublishableTrainerProfileProps = {
  trainer: Trainer;
  /** Only set when public `/trainers/[slug]` routes are enabled for publishable profiles. */
  href?: string;
};

/**
 * Renders a single publishable trainer profile.
 * Callers must pass profiles that already pass `isTrainerPublishable`.
 */
export function PublishableTrainerProfile({ trainer, href }: PublishableTrainerProfileProps) {
  if (!isTrainerPublishable(trainer)) return null;

  const photo = trainer.photo!;
  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- verified asset URL when publishable */}
      <img
        className={styles.profilePhoto}
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        style={
          trainer.mediaFocalPoint
            ? {
                objectPosition: `${trainer.mediaFocalPoint.x * 100}% ${trainer.mediaFocalPoint.y * 100}%`,
              }
            : undefined
        }
      />
      <div>
        <h3 className={styles.profileName}>{trainer.name}</h3>
        {trainer.role ? <p className={styles.profileRole}>{trainer.role}</p> : null}
        {trainer.bio ? <p className={styles.profileBio}>{trainer.bio}</p> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <li className={styles.profileItem}>
        <Link href={href} className={styles.profileLink}>
          {body}
        </Link>
      </li>
    );
  }

  return <li className={styles.profileItem}>{body}</li>;
}

export type PublishableTrainerListProps = {
  trainers: Trainer[];
  enableProfileLinks?: boolean;
};

/** Empty when no publishable profiles — never invent placeholder cards. */
export function PublishableTrainerList({
  trainers,
  enableProfileLinks = false,
}: PublishableTrainerListProps) {
  const publishable = trainers.filter(isTrainerPublishable);
  if (publishable.length === 0) return null;

  return (
    <ul className={styles.profileList}>
      {publishable.map((trainer) => (
        <PublishableTrainerProfile
          key={trainer.slug}
          trainer={trainer}
          href={enableProfileLinks ? `/trainers/${trainer.slug}` : undefined}
        />
      ))}
    </ul>
  );
}
