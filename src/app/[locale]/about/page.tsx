import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import { diffYears } from "@components/helpers/common";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutCV from "@components/views/about/AboutCV";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | About",
    description: "Amril Syaifa Yasin",
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");
  const year = diffYears(new Date(), new Date("2020-01-01"));

  return (
    <div className="container">
      <Navigation locale={locale} />

      <div className="page-header">
        <h1 className="page-title">{t("about_me")}</h1>
      </div>

      <div className="content-wrapper">
        <table className="about-table">
          <tbody>
            <tr>
              <td className="label">{t("name")}:</td>
              <td className="value">Amril Syaifa Yasin</td>
            </tr>
            <tr>
              <td className="label">{t("role")}:</td>
              <td className="value">{t("works")}</td>
            </tr>
            <tr>
              <td className="label">{t("locate")}:</td>
              <td className="value">{t("location")}</td>
            </tr>
            <tr>
              <td className="label">{t("experience")}:</td>
              <td className="value">
                {year} {t("years")}
              </td>
            </tr>
            <tr>
              <td className="label">{t("interests")}:</td>
              <td className="value">
                {t("game")}, {t("coffee")}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ color: "#0000FF" }}>{t("bio")}:</h3>
        <p>{t("greeting", { year })}</p>
      </div>
      <AboutCV />

      <Footer />
    </div>
  );
}
