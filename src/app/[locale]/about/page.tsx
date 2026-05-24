import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { diffYears } from "@components/helpers/common";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutCV from "@components/views/about/AboutCV";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | About",
    description: "Amril Syaifa Yasin — Software Engineer",
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("about");
  const year = diffYears(new Date(), new Date("2020-01-01"));

  const infoItems = [
    { label: t("name"), value: "Amril Syaifa Yasin" },
    { label: t("role"), value: t("works") },
    { label: t("locate"), value: t("location") },
    { label: t("experience"), value: `${year} ${t("years")}` },
    { label: t("interests"), value: `${t("game")}, ${t("coffee")}` },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">
                Who I am
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {t("about_me")}
            </h1>
            <p className="text-text-secondary leading-relaxed max-w-2xl">
              {t("greeting", { year })}
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
            {infoItems.map(({ label, value }) => (
              <div
                key={label}
                className="bg-bg-card border border-border rounded-lg p-3 hover:border-accent/50 transition-colors duration-300"
              >
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-text-primary text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Careers & Skills */}
          <AboutCV />
        </div>
      </main>
      <Footer />
    </div>
  );
}
