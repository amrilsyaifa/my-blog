import ProjectView from "@components/views/project/ProjectView";
import TitleProject from "@components/views/project/Title";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Project",
    description: "Amril Syaifa Yasin",
  };
}

export default function Project() {
  const t = useTranslations("navbar");
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start p-4 md:p-24 pt-20 bg-gray-100 dark:bg-slate-900">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full">
        <TitleProject title={t("project")} />
        <ProjectView />
      </div>
    </main>
  );
}
