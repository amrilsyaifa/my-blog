"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useTranslations } from "next-intl";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  href: string;
  badge: string;
  color: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "frontend-react",
    title: "Frontend Developer (React)",
    issuer: "HackerRank",
    href: "https://www.hackerrank.com/certificates/4ba22fd66bd6",
    badge: "⚛️",
    color: "#6366f1",
  },
  {
    id: "javascript-basic",
    title: "JavaScript (Basic)",
    issuer: "HackerRank",
    href: "https://www.hackerrank.com/certificates/e7619d101893",
    badge: "🟡",
    color: "#f59e0b",
  },
  {
    id: "react-basic",
    title: "React (Basic)",
    issuer: "HackerRank",
    href: "https://www.hackerrank.com/certificates/1bae06777e7e",
    badge: "🔵",
    color: "#3b82f6",
  },
];

export default function CertificationView() {
  const t = useTranslations("certification");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".cert-card"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out", delay: 0.1 }
    );
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {CERTIFICATES.map((cert) => (
        <div
          key={cert.id}
          className="cert-card group bg-bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1"
          style={{ opacity: 0 }}
        >
          {/* Badge / icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${cert.color}22`, border: `1px solid ${cert.color}44` }}
          >
            {cert.badge}
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

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Verified tag + view button */}
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
  );
}
