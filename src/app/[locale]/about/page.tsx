import { diffYears } from "@components/helpers/common";
import TitleAbout from "@components/views/about/Title";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Airplay, Home, Coffee, ToggleRight, Volume2 } from "react-feather";

// import careersData from "@components/data/careers.json";
// import skillsData from "@components/data/skills.json";
import AboutCV from "@components/views/about/AboutCV";
import { getYearDifference } from "@components/helpers/date";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | About",
    description: "Amril Syaifa Yasin",
  };
}

export default function About() {
  const t = useTranslations("about");
  const from = "2018-06-01";
  const to = new Date().toISOString().split("T")[0];
  const year = getYearDifference(from, to);

  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start p-4 md:p-24 pt-20 bg-white dark:bg-slate-900 scrollbar">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full">
        <div className="w-full">
          <TitleAbout title={t("about_me")} />
          <p className="mt-4 text-xl md:text-2xl ">{t("greeting", { year })}</p>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-800">
            {t("this_is_me")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Airplay className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    {t("works")}
                  </span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Home className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    {t("location")}
                  </span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Volume2 className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    {t("english")}
                  </span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <ToggleRight className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    {t("game")}
                  </span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Coffee className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    {t("coffee")}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <AboutCV />
        </div>
      </div>
    </main>
  );
}
