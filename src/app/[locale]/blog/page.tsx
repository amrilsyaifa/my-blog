"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";
import classNames from "classnames";
import { BlogItemProps } from "@components/views/blog/BlogItem";

export default function Blog() {
  const t = useTranslations("blog");
  const [activeTab, setActiveTab] = useState<"en" | "id">("en");
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "blogs"));
        const data: BlogItemProps[] = [];
        snapshot.forEach((doc) => data.push(doc.data() as BlogItemProps));
        setBlogs(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const posts = blogs.filter((b) => b.lang === activeTab).sort((a, b) => b.order - a.order);

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
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-text-muted">{t("no_data")}</div>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-6 hover:pl-2 transition-all duration-300"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{post.description}</p>
                    <p className="text-xs text-text-muted">{t("posted")} {post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
