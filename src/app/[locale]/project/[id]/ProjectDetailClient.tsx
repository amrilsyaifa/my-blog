"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { db } from "@components/configs/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface LinkItem {
  title: string;
  url: string;
}

interface ImageItem {
  description: string;
  url: string;
}

interface ProjectDetail {
  title: string;
  meta_desc: string;
  description?: string[];
  links?: LinkItem[];
  images?: ImageItem[];
  dev_stack?: string[];
}

export default function ProjectDetailClient() {
  const router = useRouter();
  const { id, locale } = useParams<{ id: string; locale: string }>();
  const t = useTranslations("project_detail");
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getProjectDetail = useCallback(async () => {
    try {
      const docRef = doc(db, "project_detail", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProject(docSnap.data() as ProjectDetail);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { getProjectDetail(); }, [getProjectDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-text-muted mb-4">Project not found.</p>
            <Link href={`/${locale}/project`} className="text-accent hover:underline text-sm">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Back + title */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/${locale}/project`)}
              className="flex items-center gap-2 text-text-muted hover:text-accent text-sm transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("back_to_projects")}
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary capitalize">{project.title}</h1>
            {project.meta_desc && <p className="text-text-secondary mt-2">{project.meta_desc}</p>}
          </div>

          {/* Image carousel */}
          {project.images && project.images.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-accent" />
                {t("overview")}
              </h2>
              <div className="relative bg-bg-card border border-border rounded-xl overflow-hidden">
                <Image
                  src={project.images[currentImageIndex].url}
                  alt={project.images[currentImageIndex].description}
                  width={1200}
                  height={700}
                  className="w-full h-auto object-contain max-h-[500px]"
                />
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((p) => (p === 0 ? project.images!.length - 1 : p - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-bg/80 border border-border rounded-lg text-text-primary hover:border-accent/50 hover:text-accent transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((p) => (p === project.images!.length - 1 ? 0 : p + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-bg/80 border border-border rounded-lg text-text-primary hover:border-accent/50 hover:text-accent transition-all"
                    >
                      →
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {project.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? "bg-accent w-4" : "bg-text-muted"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {project.images[currentImageIndex].description && (
                <p className="text-xs text-text-muted text-center mt-2">
                  {project.images[currentImageIndex].description}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {project.description && project.description.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-accent" />
                {t("description")}
              </h2>
              <div className="space-y-3">
                {project.description.map((desc, idx) => (
                  <p
                    key={idx}
                    className="text-text-secondary leading-relaxed text-sm [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent/80"
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {project.dev_stack && project.dev_stack.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-accent" />
                {t("technologies")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.dev_stack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm rounded-lg bg-accent/10 border border-accent/20 text-accent">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-accent" />
                {project.links.length > 1 ? t("links") : t("link")}
              </h2>
              <div className="space-y-2">
                {project.links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-bg-card border border-border rounded-lg">
                    <span className="text-text-muted text-sm capitalize min-w-[80px]">{link.title}</span>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm hover:underline truncate"
                    >
                      {link.url}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
