"use client";

import Navigation from "@components/components/Navigation";
import YouTubeEmbed from "@components/components/YouTubeEmbed";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Footer from "@components/components/Footer";

interface Video {
  title: string;
  videoId: string;
  order: number;
}

export default function Videos({ params }: { params: { locale: string } }) {
  const t = useTranslations("video");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getVideos = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "videos"));
      const videoData: Video[] = [];
      querySnapshot.forEach((doc) => {
        videoData.push(doc.data() as Video);
      });
      setVideos(videoData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const sortedVideos = videos.sort((a, b) => b.order - a.order);

  return (
    <div className="container">
      <Navigation locale={params.locale} />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 style={{ color: "#FFFF00", marginBottom: "10px" }}>{t("title")}</h1>
      </div>

      <div className="content-wrapper">
        <h2 style={{ color: "#000080", marginTop: "0" }}>{t("description")}</h2>
        <p>{t("sub_description")}</p>

        <h3 style={{ color: "#0000FF" }}>🎬 {t("feature")}:</h3>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#000000" }}>{t("loading")}</p>
          </div>
        ) : sortedVideos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#000000" }}>{t("no_data")}</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {sortedVideos.map((video) => (
              <div
                key={video.videoId}
                style={{
                  backgroundColor: "#C0C0C0",
                  padding: "15px",
                  border: "3px outset #DFDFDF",
                }}
              >
                <h4
                  style={{
                    color: "#000080",
                    marginTop: "0",
                    marginBottom: "12px",
                  }}
                >
                  🎥 {video.title}
                </h4>
                <div
                  style={{
                    backgroundColor: "#000000",
                    padding: "10px",
                    border: "2px solid #808080",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="under-construction" style={{ marginTop: "20px" }}>
          📸 {t("comming_soon")} 📸
        </div>
      </div>

      <Footer />
    </div>
  );
}
