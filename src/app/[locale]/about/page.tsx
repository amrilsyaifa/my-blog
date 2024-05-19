import { diffYears } from "@components/helpers/common";
import CarrerItem from "@components/views/about/CarrerItem";
import SkillItem from "@components/views/about/SkillItem";
import TitleAbout from "@components/views/about/Title";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Airplay, Home, Coffee, ToggleRight, Volume2 } from "react-feather";

import careersData from "@components/data/careers.json";
import skillsData from "@components/data/skills.json";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | About",
    description: "Amril Syaifa Yasin",
  };
}

export default function About() {
  const t = useTranslations("about");
  const year = diffYears(new Date(), new Date("2020-01-01"));

  return (
    <main className="flex min-h-[calc(100vh-7.5em)] flex-col items-start p-4 md:p-24 bg-white dark:bg-slate-900 scrollbar">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full">
        <div className="w-full">
          <TitleAbout title={t("about_me")} />
          <p className="mt-4 text-xl md:text-2xl ">{t("greeting", { year })}</p>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-600">
            {t("this_is_me")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Airplay className="dark:text-[#ec7a56] text-gray-600" />
                  <span>{t("works")}</span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Home className="dark:text-[#ec7a56] text-gray-600" />
                  <span>{t("location")}</span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Volume2 className="dark:text-[#ec7a56] text-gray-600" />
                  <span>{t("english")}</span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <ToggleRight className="dark:text-[#ec7a56] text-gray-600" />
                  <span>{t("game")}</span>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex flex-row items-center gap-4">
                  <Coffee className="dark:text-[#ec7a56] text-gray-600" />
                  <span>{t("coffee")}</span>
                </div>
              </li>
            </ul>
          </div>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-600">
            {t("careers")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              {careersData
                .sort((a, b) => b.company_order - a.company_order)
                .map((career) => (
                  <li className="mb-3" key={career.id}>
                    <CarrerItem {...career} />
                  </li>
                ))}
            </ul>
          </div>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-600">
            {t("skills")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              {skillsData
                .sort((a, b) => a.skill_order - b.skill_order)
                .map((skill) => (
                  <li className="mb-3" key={skill.id}>
                    <SkillItem {...skill} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
