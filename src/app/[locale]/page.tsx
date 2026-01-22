import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const currentYear = new Date().getFullYear();

  return (
    <div className="container">
      <Navigation locale={locale} />

      <div className="page-header">
        <h1 className="page-title">{t("greeting")} 🌟</h1>
        <p className="page-subtitle">{`~ Est. ${currentYear} ~`}</p>
      </div>

      <div className="marquee">
        <div className="marquee-content">{t("welcome")}</div>
      </div>

      <div className="content-wrapper">
        <p className="big-text">{t("description")}</p>
        <p className="big-text">{t("next_description")}</p>
        <hr />
        <p style={{ color: "#FF0000" }}>
          <strong>{t("best_viewed")}</strong>
        </p>
      </div>

      <div className="more-about-me">
        <Link
          href="/en/about"
          rel="noopener noreferrer"
          className="retro-footer-btn"
        >
          {t("more")}
        </Link>
      </div>

      <div className="visitor-counter">
        <div className="visitor-counter-icon">👁️</div>
        <p className="visitor-counter-text">
          {t("visitor")}
          <span className="blink">42,337</span>
        </p>
      </div>

      <Footer />
    </div>
  );
}
