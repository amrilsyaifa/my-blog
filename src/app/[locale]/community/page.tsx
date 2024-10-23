"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const PAGE_SIZE = 20;

interface CommunityEvent {
  id: string;
  /* bilingual */
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  /* legacy fallback */
  title?:          string;
  description?:    string;
  date: string;
  location: string;
  photos: string[];
  order: number;
}

function loc(en: string, id: string | undefined, locale: string): string {
  return locale === "id" && id ? id : en;
}

function EventSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border animate-pulse">
          <div className="w-24 h-24 shrink-0 rounded-xl bg-bg-card" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 bg-bg-card rounded-md w-3/5" />
            <div className="h-3 bg-bg-card rounded-md w-4/5" />
            <div className="flex gap-3 mt-2">
              <div className="h-3 bg-bg-card rounded-md w-16" />
              <div className="h-3 bg-bg-card rounded-md w-20" />
              <div className="h-3 bg-bg-card rounded-md w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventTeaser({ event, locale }: { event: CommunityEvent; locale: string }) {
  const title       = loc(event.title_en || event.title || "", event.title_id, locale);
  const description = loc(event.description_en || event.description || "", event.description_id, locale);
  const coverPhoto  = event.photos?.[0] ?? null;
  const photoCount  = event.photos?.length ?? 0;

  return (
    <Link href={`/${locale}/community/${event.id}`} className="group block">
      <div className="flex gap-4 p-4 rounded-2xl border border-border hover:border-accent/40 hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover thumbnail */}
        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-border">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt={title}
              fill
              sizes="96px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 to-bg-secondary relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle, var(--color-accent) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-7 h-7 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 flex-1">
              {title}
            </h2>
            <svg className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-auto">
            {event.date && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {event.date}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 text-xs text-accent">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.027a8 8 0 00-16 0c0 3.33 1.556 6.024 3.5 8.027a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {event.location}
              </span>
            )}
            {photoCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {photoCount} photos
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Community() {
  const t = useTranslations("community");
  const { locale } = useParams<{ locale: string }>();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "community"));
        const data: CommunityEvent[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as CommunityEvent));
        setEvents(data.sort((a, b) => b.order - a.order));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const visible = events.slice(0, displayCount);
  const hasMore = visible.length < events.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setDisplayCount((n) => n + PAGE_SIZE); },
      { rootMargin: "150px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, visible.length]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Events</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">{t("title")}</h1>
            <p className="text-text-secondary">{t("description")}</p>
          </div>

          {/* Event list */}
          {isLoading ? (
            <EventSkeleton />
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-text-muted text-sm">{t("no_data")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visible.map((event) => (
                  <EventTeaser key={event.id} event={event} locale={locale} />
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-10">
                  <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}

              {!hasMore && events.length > PAGE_SIZE && (
                <p className="text-center text-xs text-text-muted py-8">
                  {events.length} events loaded
                </p>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
