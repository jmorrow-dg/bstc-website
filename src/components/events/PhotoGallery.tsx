import Image from "next/image";
import { EventPhoto, PHOTO_CAPTION } from "@/lib/event-photos";

// A grid of real night photos. Every image is lazy loaded (next/image's
// default without `priority`) and served at the size its column needs.
export default function PhotoGallery({
  photos,
  title = "Photos from the nights",
  headingLevel = "h2",
  variant = "grid",
}: {
  photos: EventPhoto[];
  title?: string;
  headingLevel?: "h2" | "h3";
  variant?: "grid" | "strip";
}) {
  if (!photos.length) return null;
  const Heading = headingLevel;
  const strip = variant === "strip";

  return (
    <figure className="m-0">
      <Heading
        className={
          strip
            ? "text-sm font-medium uppercase tracking-wider text-brand-grey mb-3"
            : "text-2xl md:text-3xl font-display font-bold mb-6"
        }
      >
        {title}
      </Heading>
      <ul
        className={`grid gap-2 md:gap-3 list-none p-0 m-0 ${
          strip ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {photos.map((photo) => (
          <li
            key={photo.src}
            className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg border border-ink/10 bg-ink/5"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes={
                strip
                  ? "(max-width: 768px) 50vw, 400px"
                  : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
              }
            />
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-brand-grey">{PHOTO_CAPTION}</figcaption>
    </figure>
  );
}
