"use client";

import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";

type DevStack = {
  is_open_new_tab: boolean;
  title: string;
  url?: string;
};

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

export default function Project({ params }: { params: { locale: string } }) {
  const t = useTranslations("project");
  const [activeTab, setActiveTab] = useState<"self" | "company">("self");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProjects = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectData: Project[] = [];
      querySnapshot.forEach((doc) => {
        projectData.push(doc.data() as Project);
      });
      setProjects(projectData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const filteredProjects = projects
    .filter((p) => p.project_by === activeTab)
    .sort((a, b) => b.order - a.order);

  return (
    <div className="container">
      <Navigation locale={params.locale} />

      <div className="page-header">
        <h1 className="page-title">{t("title")}</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "self" ? "active" : ""}`}
          onClick={() => setActiveTab("self")}
        >
          {t("personal")}
        </button>
        <button
          className={`tab-button ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          {t("company")}
        </button>
      </div>

      <div className="tab-content">
        {isLoading ? (
          <div className="empty-state">
            <p style={{ color: "#000000" }}>{t("loading")}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p style={{ color: "#000000" }}>{t("no_data")}</p>
          </div>
        ) : (
          <>
            <h3 style={{ color: "#0000FF", marginTop: "0" }}>
              {activeTab === "self" ? t("my_personal") : t("my_company")}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filteredProjects.map((project) => {
                const projectLink = project.is_detail
                  ? `/${params.locale}${project.link}`
                  : project.link;
                const isExternalLink = !project.is_detail;
                return (
                  <Link
                    key={project.id}
                    href={projectLink}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="project-card">
                      <h4 className="project-card-title">{project.title}</h4>
                      <p className="project-card-desc">{project.description}</p>
                      {project.dev_stack && project.dev_stack.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {project.dev_stack.slice(0, 8).map((tech, idx) => (
                            <span key={idx} className="tech-badge">
                              {tech.title}
                            </span>
                          ))}
                          {project.dev_stack.length > 8 && (
                            <span className="project-card-meta">
                              +{project.dev_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {activeTab === "company" && (
              <div className="under-construction" style={{ marginTop: "20px" }}>
                🚧 {t("new_project")} 🚧
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
