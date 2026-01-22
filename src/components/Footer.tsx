"use client";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Locale } from "@components/constants/locale";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const onChangeLocale = (val: string) => {
    const findLocale = Locale.find((loc) => loc === val);
    let newPath = pathName.replace(`/${locale}`, `/${findLocale}`);
    router.replace(newPath);
  };

  return (
    <footer className="retro-footer">
      <div className="retro-footer-container">
        {/* Left side - Social Links */}
        <div className="retro-footer-social">
          <Link
            href="https://github.com/amrilsyaifa"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-footer-btn"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/amril-syaifa-yasin-506530141/"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-footer-btn"
          >
            LinkedIn
          </Link>
          <Link
            href="https://medium.com/@amrilsyaifa"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-footer-btn"
          >
            Medium
          </Link>
        </div>

        {/* Right side - Language Dropdown & Copyright */}
        <div className="retro-footer-right">
          <select
            value={locale as string}
            onChange={(e) => onChangeLocale(e.target.value)}
            className="retro-footer-select"
          >
            <option value="en">English</option>
            <option value="id">Indonesia</option>
          </select>
          <div className="retro-footer-copyright">
            © {currentYear} {t("copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
