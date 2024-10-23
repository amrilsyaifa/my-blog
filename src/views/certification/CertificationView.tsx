"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Image from "next/image";

const PAGE_SIZE = 20;

interface Certificate {
  id:     string;
  title:  string;
  issuer: string;
  href:   string;
  badge:  string;
  color:  string;
  order:  number;
}

export default function CertificationView() {
  const t        = useTranslations("certification");
  const gridRef  = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [certs,        setCerts]        = useState<Certificate[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(
        query(collection(db, "certifications"), orderBy("order", "desc"))
      );
      setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate)));
      setLoading(false);
    };
    fetch();
  }, []);

  const visible = certs.slice(0, displayCount);
  const hasMore = visible.length < certs.length;

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

  useEffect(() => {
    if (loading || !gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".cert-card"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out", delay: 0.1 }
    );
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.map((cert) => (
        <div
          key={cert.id}
          className="cert-card group bg-bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1"
          style={{ opacity: 0 }}
        >
          {/* Badge */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl overflow-hidden"
            style={{ background: `${cert.color}22`, border: `1px solid ${cert.color}44` }}
          >
            {cert.badge.startsWith("http") ? (
              <Image src={cert.badge} alt={cert.title} width={40} height={40} className="object-contain" unoptimized />
            ) : (
              cert.badge
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
              {t("issued_by")} {cert.issuer}
            </p>
            <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
              {cert.title}
            </h3>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Verified
            </span>
            <Link
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)` }}
            >
              {t("view")} →
            </Link>
          </div>
        </div>
      ))}
    </div>

    {hasMore && (
      <div ref={sentinelRef} className="flex justify-center py-10">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )}

    {!hasMore && certs.length > PAGE_SIZE && (
      <p className="text-center text-xs text-text-muted py-8">
        {certs.length} certifications loaded
      </p>
    )}
    </>
  );
}
