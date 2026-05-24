"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";
import classNames from "classnames";

type DevStack = { is_open_new_tab: boolean; title: string; url?: string };
interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  dev_stack: DevStack[];
  project_by: "self" | "company";
  order: number;
  is_detail?: boolean;
}

export default function Project() {
  const t = useTranslations("project");
  const { locale } = useParams();
  const [activeTab, setActiveTab] = useState<"self" | "company">("self");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data: Project[] = [];
        snapshot.forEach((doc) => data.push(doc.data() as Project));
        setProjects(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = projects.filter((p) => p.project_by === activeTab).sort((a, b) => b.order - a.order);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">{t("title")}</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(["self", "company"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  {
                    "bg-accent text-white shadow-glow-sm": activeTab === tab,
                    "bg-bg-card border border-border text-text-secondary hover:border-accent/50 hover:text-text-primary": activeTab !== tab,
                  }
                )}
              >
                {tab === "self" ? t("personal") : t("company")}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-text-muted">{t("no_data")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((project) => {
                const href = project.is_detail ? `/${locale}${project.link}` : project.link;
                return (
                  <Link
                    key={project.id}
                    href={href}
                    target={project.is_detail ? undefined : "_blank"}
                    rel={project.is_detail ? undefined : "noopener noreferrer"}
                    className="group block"
                  >
                    <div className="bg-bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5">
                      <div>
                        <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-2 capitalize">
                          {project.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
                          {project.description}
                        </p>
                      </div>
                      {project.dev_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                          {project.dev_stack.slice(0, 8).map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-accent/10 border border-accent/20 text-accent">
                              {tech.title}
                            </span>
                          ))}
                          {project.dev_stack.length > 8 && (
                            <span className="text-xs text-text-muted">+{project.dev_stack.length - 8} {t("more")}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
