"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";

const SECTIONS = [
  { name: "Blogs",          col: "blogs",          href: "/admin/blogs",          icon: "✍" },
  { name: "Projects",       col: "projects",       href: "/admin/projects",       icon: "◈" },
  { name: "Videos",         col: "videos",         href: "/admin/videos",         icon: "▷" },
  { name: "Careers",        col: "careers",        href: "/admin/careers",        icon: "◉" },
  { name: "Skills",         col: "skills",         href: "/admin/skills",         icon: "◆" },
  { name: "Certifications", col: "certifications", href: "/admin/certifications", icon: "✦" },
  { name: "Community",      col: "community",      href: "/admin/community",      icon: "◎" },
];

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const results: Record<string, number> = {};
      await Promise.all(
        SECTIONS.map(async ({ col }) => {
          try {
            const snap = await getCountFromServer(collection(db, col));
            results[col] = snap.data().count;
          } catch {
            results[col] = 0;
          }
        })
      );
      setCounts(results);
      setLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Manage all portfolio content from here.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SECTIONS.map(({ name, col, href, icon }) => (
          <Link
            key={col}
            href={href}
            className="bg-[#1a1d27] border border-[#2d3748] rounded-xl p-5 hover:border-indigo-500/50 hover:bg-[#1e2130] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{icon}</span>
              <span className="text-2xl font-bold text-slate-100">
                {loading ? "—" : (counts[col] ?? 0)}
              </span>
            </div>
            <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
              {name}
            </p>
          </Link>
        ))}
      </div>

      {/* Firestore Rules reminder */}
      <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-5">
        <p className="text-sm font-semibold text-amber-400 mb-2">
          ⚠ Firestore Security Rules
        </p>
        <p className="text-xs text-amber-200/70 leading-relaxed">
          Make sure you have applied the Firestore Security Rules that restrict
          writes to your admin email only. Without them, any authenticated user
          can modify data. Apply the rules in Firebase Console → Firestore → Rules.
        </p>
      </div>
    </div>
  );
}
