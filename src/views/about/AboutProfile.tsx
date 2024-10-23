"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface Profile {
  greeting_en: string;
  greeting_id?: string;
  name: string;
  role: string;
  location: string;
  interests: string;
  experience_start: string; // ISO "2020-01-01"
}

function diffYears(a: Date, b: Date): number {
  return Math.floor(
    (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
}

export default function AboutProfile() {
  const t = useTranslations("about");
  const { locale } = useParams<{ locale: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "about", "profile"));
        if (snap.exists()) setProfile(snap.data() as Profile);
      } catch {
        // leave profile null
      }
    })();
  }, []);

  if (!profile) {
    return (
      <>
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-accent" />
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">Who I am</span>
          </div>
          <div className="h-10 bg-bg-card rounded-md w-1/2 animate-pulse mb-4" />
          <div className="h-4 bg-bg-card rounded-md w-2/3 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-lg p-3 animate-pulse">
              <div className="h-2.5 bg-border rounded w-2/3 mb-2" />
              <div className="h-3.5 bg-border/60 rounded w-4/5" />
            </div>
          ))}
        </div>
      </>
    );
  }

  const year = diffYears(new Date(), new Date(profile.experience_start));
  const greeting = locale === "id" && profile.greeting_id ? profile.greeting_id : profile.greeting_en;

  const infoItems = [
    { label: t("name"),       value: profile.name },
    { label: t("role"),       value: profile.role },
    { label: t("locate"),     value: profile.location },
    { label: t("experience"), value: `${year} ${t("years")}` },
    { label: t("interests"),  value: profile.interests },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-px bg-accent" />
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Who I am
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t("about_me")}
        </h1>
        {greeting && (
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            {greeting}
          </p>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
        {infoItems.map(({ label, value }) => (
          <div
            key={label}
            className="bg-bg-card border border-border rounded-lg p-3 hover:border-accent/50 transition-colors duration-300"
          >
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">
              {label}
            </p>
            <p className="text-text-primary text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
