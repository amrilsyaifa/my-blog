"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CommunityEvent {
  id: string;
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  title?:          string;
  description?:    string;
  date: string;
  location: string;
  photos: string[];
  order: number;
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-72 md:h-96 bg-bg-card rounded-2xl mb-8" />
      <div className="h-8 bg-bg-card rounded-md w-2/3 mb-4" />
      <div className="flex gap-4 mb-6">
        <div className="h-4 bg-bg-card rounded-md w-24" />
        <div className="h-4 bg-bg-card rounded-md w-28" />
        <div className="h-4 bg-bg-card rounded-md w-16" />
      </div>
      <div className="h-4 bg-bg-card rounded-md w-full mb-2" />
      <div className="h-4 bg-bg-card rounded-md w-5/6 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-bg-card rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function CommunityDetail() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "community", id));
        if (!snap.exists()) { setNotFound(true); return; }
        setEvent({ id: snap.id, ...snap.data() } as CommunityEvent);
      } catch (e) {
        console.log(e);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  /* Close lightbox on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const eventTitle = event
    ? (locale === "id" && event.title_id ? event.title_id : event.title_en || event.title || "")
    : "";
  const eventDesc = event
    ? (locale === "id" && event.description_id ? event.description_id : event.description_en || event.description || "")
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">

          {/* Back link */}
          <Link
            href={`/${locale}/community`}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Community
          </Link>

          {isLoading && <DetailSkeleton />}

          {notFound && !isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-text-muted">Event not found.</p>
              <Link href={`/${locale}/community`} className="text-accent hover:underline text-sm">
                Back to Community
              </Link>
            </div>
          )}

          {event && !isLoading && (
            <>
              {/* Hero cover photo */}
              <div className="relative w-full h-72 md:h-[420px] rounded-2xl overflow-hidden border border-border mb-8">
                {event.photos?.[0] ? (
                  <Image
                    src={event.photos[0]}
                    alt={eventTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-bg-card relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, var(--color-accent) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                      </div>
                      <p className="text-sm text-text-muted">No cover photo</p>
                    </div>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
              </div>

              {/* Event info */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{eventTitle}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  {event.date && (
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {event.date}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1.5 text-sm text-accent">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.027a8 8 0 00-16 0c0 3.33 1.556 6.024 3.5 8.027a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      {event.location}
                    </span>
                  )}
                  {event.photos?.length > 0 && (
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      {event.photos.length} photos
                    </span>
                  )}
                </div>
                {eventDesc && (
                  <p className="text-text-secondary leading-relaxed text-base border-l-2 border-accent/40 pl-4 italic">
                    {eventDesc}
                  </p>
                )}
              </div>

              {/* Photo gallery */}
              {event.photos && event.photos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-px bg-accent" />
                    <h2 className="text-sm font-semibold text-accent uppercase tracking-widest">Gallery</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {event.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightbox(photo)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border group hover:border-accent/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        <Image
                          src={photo}
                          alt={`${eventTitle} — photo ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="Full view"
              width={1200}
              height={800}
              className="object-contain rounded-xl max-h-[90vh] w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
