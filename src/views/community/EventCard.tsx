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

const CameraPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative overflow-hidden bg-bg-secondary">
    {/* Dotted grid background */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: "radial-gradient(circle, var(--color-accent) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />
    {/* Camera icon */}
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
          />
        </svg>
      </div>
      <p className="text-xs text-text-muted font-medium">No photos yet</p>
    </div>
  </div>
);

const PhotoPlaceholder = ({ idx }: { idx: number }) => {
  const hues = ["from-accent/15 to-accent/5", "from-blue-500/15 to-blue-500/5", "from-purple-500/15 to-purple-500/5"];
  const bg = hues[idx % hues.length];
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${bg}`}>
      <svg className="w-5 h-5 text-text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </div>
  );
};

export default function EventCard({ event }: { event: CommunityEvent }) {
  const t = useTranslations("community");
  const [showAll, setShowAll] = useState(false);

  const photos        = event.photos ?? [];
  const coverPhoto    = photos[0] ?? null;
  const gridPhotos    = photos.slice(1);
  const visiblePhotos = showAll ? gridPhotos : gridPhotos.slice(0, 5);
  const hasMore       = gridPhotos.length > 5;

  return (
    <article className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300">

      {/* ── Cover photo ── */}
      <div className="relative w-full h-52">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <CameraPlaceholder />
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-card to-transparent" />
      </div>

      {/* ── Event header ── */}
      <div className="px-5 pb-4 -mt-2 border-b border-border flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
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
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.027a8 8 0 00-16 0c0 3.33 1.556 6.024 3.5 8.027a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {event.location}
            </span>
          )}
          <span className="text-xs text-text-muted">
            {photos.length} {t("photos")}
          </span>
        </div>
      </div>

      {/* ── Photo grid (remaining photos after cover) ── */}
      <div className="p-4">
        {gridPhotos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {visiblePhotos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-bg border border-border group"
                >
                  <Image
                    src={photo}
                    alt={`${event.title} photo ${idx + 2}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-3 w-full py-2 text-sm text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors duration-200"
              >
                {showAll ? "Show less" : `${t("view_all")} (${gridPhotos.length - 5} more)`}
              </button>
            )}
          </>
        ) : (
          /* Placeholder grid when no additional photos */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-border/50"
              >
                <PhotoPlaceholder idx={idx} />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
