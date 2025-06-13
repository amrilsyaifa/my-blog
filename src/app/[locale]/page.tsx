import MoreButton from "@components/views/home/MoreButton";
import TitleHome from "@components/views/home/Title";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start justify-center p-4 md:p-24 bg-gray-100 dark:bg-slate-900">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto">
        <TitleHome title={t("greeting")} />
        <p className="text-lg md:text-2xl mt-10 text-gray-900 dark:text-gray-100">
          {t("description")}
        </p>
        <p className="text-lg md:text-2xl text-gray-900 dark:text-gray-100">
          {t("next_description")}
        </p>
        <MoreButton title={t("more")} />
      </div>
    </main>
  );
}
