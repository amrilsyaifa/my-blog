import Navigation from "@components/components/Navigation";
import Footer from "@components/components/Footer";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Contact",
    description: "Amril Syaifa Yasin",
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  return (
    <div className="container">
      <Navigation locale={locale} />

      <div className="page-header">
        <h1 className="page-title">{t("title")}</h1>
      </div>

      <div className="content-wrapper">
        <h2 style={{ color: "#000080", marginTop: "0" }}>
          {t("get_in_touch")}
        </h2>
        <p>{t("feel_free")}</p>

        <h3 style={{ color: "#0000FF" }}>📧 Email:</h3>
        <table className="contact-table">
          <tbody>
            <tr>
              <td className="label">Email:</td>
              <td className="value">amrilsyaifa@gmail.com</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ color: "#0000FF" }}>🔗 {t("social_links")}:</h3>
        <ul
          style={{
            color: "#000000",
            backgroundColor: "#FFFFFF",
            padding: "16px",
            border: "2px solid #DFDFDF",
            lineHeight: "1.8",
          }}
        >
          <li>
            <Link
              href="https://www.instagram.com/iamrils/"
              target="_blank"
              rel="noopener noreferrer"
            >
              📷 Instagram: @iamrils
            </Link>
          </li>
          <li>
            <Link
              href="https://x.com/amrilsyaifay"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 Twitter/X: @amrilsyaifay
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/amrilsyaifa"
              target="_blank"
              rel="noopener noreferrer"
            >
              💻 GitHub: amrilsyaifa
            </Link>
          </li>
          <li>
            <Link
              href="https://linkedin.com/in/amrilsyaifa"
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 LinkedIn: amrilsyaifa
            </Link>
          </li>
        </ul>

        <hr />
      </div>

      <Footer />
    </div>
  );
}
