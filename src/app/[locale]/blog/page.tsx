"use client";

import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BlogItemProps } from "@components/views/blog/BlogItem";

export default function Blog({ params }: { params: { locale: string } }) {
  const t = useTranslations("blog");
  const [activeTab, setActiveTab] = useState<"en" | "id">("en");
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBlogs = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogData: BlogItemProps[] = [];
      querySnapshot.forEach((doc) => {
        blogData.push(doc.data() as BlogItemProps);
      });
      setBlogs(blogData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const posts = blogs
    .filter((blog) => blog.lang === activeTab)
    .sort((a, b) => b.order - a.order);

  return (
    <div className="container">
      <Navigation locale={params.locale} />

      <div className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("description")}</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "en" ? "active" : ""}`}
          onClick={() => setActiveTab("en")}
        >
          English
        </button>
        <button
          className={`tab-button ${activeTab === "id" ? "active" : ""}`}
          onClick={() => setActiveTab("id")}
        >
          Indonesia
        </button>
      </div>

      <div className="tab-content">
        {isLoading ? (
          <div className="empty-state">
            <p style={{ color: "#000000" }}>{t("loading")}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p style={{ color: "#000000" }}>{t("no_data")}</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <Link
              key={post.id || index}
              href={post.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="blog-card">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-date">
                  {t("posted")} {post.date}
                </p>
                <p className="blog-card-excerpt">{post.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
