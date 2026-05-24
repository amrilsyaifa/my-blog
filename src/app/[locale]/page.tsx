import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import HomeHero from "@components/views/home/HomeHero";
import { getTranslations } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <HomeHero
          description={t("description")}
          more={t("more")}
          projectsLabel={t("projects")}
        />
      </main>
      <Footer />
    </div>
  );
}
