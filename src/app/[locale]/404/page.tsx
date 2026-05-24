"use client";

import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFoundPage() {
  const { locale } = useParams();
  const t = useTranslations("404");

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="max-w-md mx-auto px-4 text-center py-16">
          <div
            className="text-8xl font-black mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            404
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-3">{t("title")}</h2>
          <p className="text-text-secondary mb-8 text-sm">
            The page you&apos;re looking for has vanished into the digital void.
          </p>

          {/* Terminal block */}
          <div className="bg-bg-card border border-border rounded-xl p-4 mb-8 text-left font-mono text-xs text-green-400">
            <span className="text-text-muted">$ </span>find . -name &quot;page&quot;<br />
            <span className="text-text-muted">$ </span>
            <span className="text-red-400">Error: File not found</span><br />
            <span className="text-text-muted">$ </span>
            <span className="animate-pulse">_</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/${locale}`}
              className="px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-300 hover:shadow-glow-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {t("back_home")}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-secondary border border-border hover:border-accent/50 hover:text-text-primary transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
