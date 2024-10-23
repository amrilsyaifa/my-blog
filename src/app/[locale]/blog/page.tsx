"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

const PAGE_SIZE = 20;

interface BlogPost {
  id: string;
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  /* legacy fallback */
  title?:       string;
  description?: string;
  lang?:        "en" | "id";
  url:          string;
  date:         string;
  order:        number;
  thumbnail?:   string;
}

function loc(en: string, id: string | undefined, tab: string): string {
  return tab === "id" && id ? id : en;
}

function BlogSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border animate-pulse">
          <div className="w-28 h-20 shrink-0 rounded-xl bg-bg-card" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 bg-bg-card rounded-md w-3/4" />
            <div className="h-3 bg-bg-card rounded-md w-4/5" />
            <div className="h-3 bg-bg-card rounded-md w-3/5" />
            <div className="h-3 bg-bg-card rounded-md w-1/4 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogCard({ post, tab }: { post: BlogPost; tab: string }) {
  const title       = loc(post.title_en || post.title || "", post.title_id, tab);
  const description = loc(post.description_en || post.description || "", post.description_id, tab);
  const langLabel   = post.title_en ? tab.toUpperCase() : (post.lang ?? tab).toUpperCase();

  return (
    <Link href={post.url} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="flex gap-4 p-4 rounded-2xl border border-border hover:border-accent/40 hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden border border-border">
          {post.thumbnail ? (
            <Image src={post.thumbnail} alt={title} fill sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 via-accent/5 to-bg-secondary relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-2.5 py-2.5">
                {[100, 80, 100, 60, 100, 67].map((w, i) => (
                  <div key={i} className="h-1 rounded-full bg-accent/25" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 flex-1">
              {title}
            </h2>
            <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-accent/10 border border-accent/20 text-accent uppercase tracking-wider">
              {langLabel}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{description}</p>
          <p className="text-xs text-text-muted italic mt-auto">{post.date}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const t = useTranslations("blog");
  const [activeTab, setActiveTab] = useState<"en" | "id">("en");
  const [blogs,     setBlogs]     = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Fetch all once */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "blogs"));
        const data: BlogPost[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as BlogPost));
        setBlogs(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* Reset page when tab changes */
  useEffect(() => { setDisplayCount(PAGE_SIZE); }, [activeTab]);

  /* Filter + sort */
  const filtered = blogs
    .filter((b) => b.title_en ? true : b.lang === activeTab)
    .sort((a, b) => b.order - a.order);

  const visible = filtered.slice(0, displayCount);
  const hasMore = visible.length < filtered.length;

  /* Infinite scroll observer */
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
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Writing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">{t("title")}</h1>
            <p className="text-text-secondary">{t("description")}</p>
          </div>

          {/* Language tabs */}
          <div className="flex gap-2 mb-8">
            {(["en", "id"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={classNames(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  {
                    "bg-accent text-white shadow-glow-sm": activeTab === lang,
                    "bg-bg-card border border-border text-text-secondary hover:border-accent/50 hover:text-text-primary": activeTab !== lang,
                  }
                )}
              >
                {lang === "en" ? "English" : "Indonesia"}
              </button>
            ))}
          </div>

          {/* Posts */}
          {isLoading ? (
            <BlogSkeleton />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z" />
                </svg>
              </div>
              <p className="text-text-muted text-sm">{t("no_data")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visible.map((post) => (
                  <BlogCard key={post.id} post={post} tab={activeTab} />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-10">
                  <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}

              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center text-xs text-text-muted py-8">
                  {filtered.length} posts loaded
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
