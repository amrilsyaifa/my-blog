import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import CommunityView from "@components/views/community/CommunityView";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Community",
    description: "Community events and activities by Amril Syaifa Yasin",
  };
}

export default async function Community({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("community");

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Events</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">{t("title")}</h1>
            <p className="text-text-secondary">{t("description")}</p>
          </div>

          <CommunityView />
        </div>
      </main>
      <Footer />
    </div>
  );
}
