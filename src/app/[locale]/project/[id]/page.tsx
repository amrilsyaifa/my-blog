"use client";

import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import { db } from "@components/configs/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export interface LinkProps {
  title: string;
  url: string;
}

export interface ImageProps {
  description: string;
  url: string;
}

export interface ProjectDetailProps {
  title: string;
  meta_desc: string;
  description?: string[];
  links?: LinkProps[];
  images?: ImageProps[];
  dev_stack?: string[];
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id, locale } = useParams();
  const t = useTranslations("project_detail");
  const [project, setProject] = useState<ProjectDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOrientation, setImageOrientation] = useState<
    "landscape" | "portrait" | "square"
  >("landscape");

  const getProjectDetail = useCallback(async () => {
    try {
      const docRef = doc(db, "project_detail", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProject(docSnap.data() as ProjectDetailProps);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProjectDetail();
  }, [getProjectDetail]);

  const handlePrevImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images!.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) =>
        prev === project.images!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    if (aspectRatio > 1.2) {
      setImageOrientation("landscape");
    } else if (aspectRatio < 0.8) {
      setImageOrientation("portrait");
    } else {
      setImageOrientation("square");
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <Navigation locale={locale as string} />
        <div className="page-header">
          <h1 className="page-title">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container">
        <Navigation locale={locale as string} />
        <div className="empty-state" style={{ color: "#FF0000" }}>
          <h1>Project Not Found</h1>
          <p>Sorry, we couldn&apos;t find that project.</p>
          <Link href={`/${locale}/project`}>Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navigation locale={locale as string} />

      <div className="page-header">
        <div
          onClick={() => router.push(`/${locale}/project`)}
          style={{
            display: "inline-block",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <button className="retro-footer-btn">
            ← {t("back_to_projects")}
          </button>
        </div>
        <h1 className="page-title">{project.title}</h1>
        {project.meta_desc && (
          <p className="page-subtitle">{project.meta_desc}</p>
        )}
      </div>

      {project.images && project.images.length > 0 && (
        <>
          <h3 style={{ color: "#0000FF", marginTop: "20px" }}>
            {t("overview")}
          </h3>
          <div
            className="carousel-container"
            data-orientation={imageOrientation}
          >
            <Image
              src={project.images[currentImageIndex].url}
              alt={project.images[currentImageIndex].description}
              className="carousel-image"
              onLoad={handleImageLoad}
              width={800}
              height={600}
              style={{
                maxHeight:
                  imageOrientation === "portrait"
                    ? window.innerWidth < 768
                      ? "450px"
                      : "600px"
                    : imageOrientation === "landscape"
                      ? window.innerWidth < 768
                        ? "250px"
                        : "500px"
                      : window.innerWidth < 768
                        ? "350px"
                        : "550px",
                width: imageOrientation === "portrait" ? "auto" : "100%",
                height: "auto",
                margin: imageOrientation === "portrait" ? "0 auto" : "0",
                objectFit: "contain",
                maxWidth: "100%",
              }}
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="carousel-button carousel-button-prev"
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="carousel-button carousel-button-next"
                >
                  →
                </button>
              </>
            )}
          </div>
          <div className="carousel-caption">
            {project.images[currentImageIndex].description}
          </div>
        </>
      )}

      <div className="content-wrapper">
        {project.description && project.description.length > 0 && (
          <>
            <h3 style={{ color: "#0000FF", marginTop: "0" }}>
              {t("description")}
            </h3>
            {project.description.map((desc, index) => (
              <p
                key={index}
                style={{
                  color: "#000000",
                  lineHeight: "1.6",
                  marginBottom: "10px",
                }}
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            ))}
          </>
        )}

        {project.dev_stack && project.dev_stack.length > 0 && (
          <>
            <h3 style={{ color: "#0000FF", marginTop: "20px" }}>
              {t("technologies")}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              {project.dev_stack.map((tech, index) => (
                <span key={index} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </>
        )}

        {project.links && project.links.length > 0 && (
          <>
            <h3 style={{ color: "#0000FF" }}>
              {project.links.length > 1 ? t("links") : t("link")}
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <tbody>
                {project.links.map((link, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#FFFFFF",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #C0C0C0",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {link.title}:
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #C0C0C0",
                      }}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
