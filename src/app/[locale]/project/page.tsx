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
import classNames from "classnames";

const PAGE_SIZE = 20;

type DevStack = { is_open_new_tab: boolean; title: string; url?: string };
interface Project {
  id: string;
  /* bilingual */
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  /* legacy fallback */
  title?:          string;
  description?:    string;
  link:            string;
  dev_stack:       DevStack[];
  project_by:      "self" | "company";
  order:           number;
  is_detail?:      boolean;
  thumbnail?:      string;
}

function loc(en: string, id: string | undefined, locale: string): string {
  return locale === "id" && id ? id : en;
}

function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden animate-pulse">
          <div className="h-44 bg-bg-secondary" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-4 bg-border rounded-md w-3/4" />
            <div className="h-3 bg-border/60 rounded-md w-full" />
            <div className="h-3 bg-border/60 rounded-md w-5/6" />
            <div className="flex gap-1.5 pt-2 border-t border-border mt-1">
              <div className="h-5 w-12 bg-border/50 rounded-md" />
              <div className="h-5 w-16 bg-border/50 rounded-md" />
              <div className="h-5 w-10 bg-border/50 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TerminalPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[10px] text-[#6e7681] font-mono truncate">
          {name.toLowerCase().replace(/\s+/g, "-")}.tsx
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-1.5 p-3 font-mono text-[10px] overflow-hidden">
        <div className="flex gap-1.5"><span className="text-[#58a6ff]">import</span><span className="text-[#e6edf3]">{"{ FC }"}</span><span className="text-[#58a6ff]">from</span><span className="text-[#a5d6ff]">&ldquo;react&rdquo;</span></div>
        <div className="h-px bg-[#30363d] w-full my-0.5" />
        <div className="flex gap-1.5"><span className="text-[#d2a8ff]">const</span><span className="text-[#79c0ff]">App</span><span className="text-[#e6edf3]">{"= () => {"}</span></div>
        <div className="pl-4 flex gap-1.5"><span className="text-[#ff7b72]">return</span><span className="text-[#e6edf3]">(</span></div>
        <div className="pl-8 h-1.5 rounded-sm bg-[#3fb950]/30 w-4/5" />
        <div className="pl-8 h-1.5 rounded-sm bg-[#58a6ff]/25 w-3/5" />
        <div className="pl-8 h-1.5 rounded-sm bg-[#d2a8ff]/20 w-5/6" />
        <div className="pl-8 h-1.5 rounded-sm bg-[#ffa657]/20 w-2/3" />
        <div className="pl-4 text-[#e6edf3]">)</div>
        <div className="text-[#e6edf3]">{"}"}</div>
      </div>
    </div>
  );
}

function ProjectCard({ project, locale }: { project: Project; locale: string }) {
  const title       = loc(project.title_en || project.title || "", project.title_id,       locale);
  const description = loc(project.description_en || project.description || "", project.description_id, locale);
  const href = project.is_detail ? `/${locale}${project.link}` : project.link;

  return (
    <Link href={href} target={project.is_detail ? undefined : "_blank"} rel={project.is_detail ? undefined : "noopener noreferrer"} className="group block">
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5">
        <div className="relative h-44 shrink-0">
          {project.thumbnail ? (
            <Image src={project.thumbnail} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <TerminalPlaceholder name={title} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg-card to-transparent" />
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="mb-2 text-base font-bold capitalize text-text-primary group-hover:text-accent transition-colors line-clamp-2">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">{description}</p>
          {project.dev_stack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
              {project.dev_stack.slice(0, 8).map((tech, idx) => (
                <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-accent/10 border border-accent/20 text-accent">{tech.title}</span>
              ))}
              {project.dev_stack.length > 8 && (
                <span className="text-xs text-text-muted self-center">+{project.dev_stack.length - 8} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Project() {
  const t = useTranslations("project");
  const { locale } = useParams<{ locale: string }>();
  const [activeTab, setActiveTab] = useState<"self" | "company">("self");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data: Project[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Project));
        setProjects(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => { setDisplayCount(PAGE_SIZE); }, [activeTab]);

  const filtered = projects.filter((p) => p.project_by === activeTab).sort((a, b) => b.order - a.order);
  const visible = filtered.slice(0, displayCount);
  const hasMore = visible.length < filtered.length;

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
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">{t("title")}</h1>
          </div>

          <div className="flex gap-2 mb-8">
            {(["self", "company"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={classNames(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                { "bg-accent text-white shadow-glow-sm": activeTab === tab,
                  "bg-bg-card border border-border text-text-secondary hover:border-accent/50 hover:text-text-primary": activeTab !== tab }
              )}>
                {tab === "self" ? t("personal") : t("company")}
              </button>
            ))}
          </div>

          {isLoading ? (
            <ProjectSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <p className="text-text-muted text-sm">{t("no_data")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visible.map((project) => (
                  <ProjectCard key={project.id} project={project} locale={locale} />
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-10">
                  <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}

              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center text-xs text-text-muted py-8">
                  {filtered.length} projects loaded
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
