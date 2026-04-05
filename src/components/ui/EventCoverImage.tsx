"use client";

import Image from "next/image";
import { useState } from "react";

interface EventCoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function EventCoverImage({
  src,
  alt,
  priority = false,
  className = "",
}: EventCoverImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 ${className}`}
    >
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-charcoal to-brand-charcoal animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100": "opacity-0"
        }`}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
