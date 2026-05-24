"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useTranslations } from "next-intl";
import EventCard, { CommunityEvent } from "./EventCard";
import EventShimmer from "./EventShimmer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CommunityView() {
  const t = useTranslations("community");
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(db, "community"));
        const data: CommunityEvent[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as CommunityEvent));
        setEvents(data.sort((a, b) => b.order - a.order));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (!isLoading && events.length > 0 && listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".event-entry"),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [isLoading, events]);

  if (isLoading) return <EventShimmer />;

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">{t("no_data")}</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="space-y-8">
      {events.map((event) => (
        <div key={event.id} className="event-entry" style={{ opacity: 0 }}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
