import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("404");
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start p-4 md:p-24 pt-20 bg-gray-100 dark:bg-slate-900 scrollbar">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full items-center justify-center flex flex-col mt-32">
        <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
        <div>
          <Link href="/">{t("back_home")}</Link>
        </div>
      </div>
    </main>
  );
}
