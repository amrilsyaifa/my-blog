"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import YouTubeEmbed from "@components/components/YouTubeEmbed";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";

interface Video {
  title: string;
  videoId: string;
  order: number;
}

export default function Videos() {
  const t = useTranslations("video");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "videos"));
        const data: Video[] = [];
        snapshot.forEach((doc) => data.push(doc.data() as Video));
        setVideos(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const sorted = [...videos].sort((a, b) => b.order - a.order);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Media</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">{t("title")}</h1>
            <p className="text-text-secondary">{t("description")}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-text-muted">{t("no_data")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sorted.map((video) => (
                <div
                  key={video.videoId}
                  className="bg-bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300"
                >
                  <YouTubeEmbed title={video.title} videoId={video.videoId} />
                  <div className="p-3">
                    <p className="text-sm font-medium text-text-primary">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && sorted.length > 0 && (
            <p className="mt-8 text-center text-sm text-text-muted">{t("comming_soon")}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
