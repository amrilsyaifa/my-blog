"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  photos: string[];
  order: number;
}

const PLACEHOLDER = "https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/sample.jpg";

export default function EventCard({ event }: { event: CommunityEvent }) {
  const t = useTranslations("community");
  const [showAll, setShowAll] = useState(false);

  const photos = event.photos.length > 0 ? event.photos : Array(4).fill(PLACEHOLDER);
  const visiblePhotos = showAll ? photos : photos.slice(0, 6);
  const hasMore = photos.length > 6;

  return (
    <article className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300">
      {/* Event header */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">{event.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          {event.date && (
            <span className="text-xs text-text-muted whitespace-nowrap">{event.date}</span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1 text-xs text-accent">
              <span>📍</span>
              {event.location}
            </span>
          )}
          <span className="text-xs text-text-muted">
            {photos.length} {t("photos")}
          </span>
        </div>
      </div>

      {/* Photo grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {visiblePhotos.map((photo, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden bg-bg border border-border group"
            >
              <Image
                src={photo}
                alt={`${event.title} photo ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 w-full py-2 text-sm text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors duration-200"
          >
            {showAll ? "Show less" : `${t("view_all")} (${photos.length - 6} more)`}
          </button>
        )}
      </div>
    </article>
  );
}
