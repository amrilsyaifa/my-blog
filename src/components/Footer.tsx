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
    const newPath = pathName.replace(`/${locale}`, `/${findLocale}`);
    router.replace(newPath);
  };

  return (
    <footer className="border-t border-border/40 mt-16" style={{ backgroundColor: "var(--footer-bg)" }}>
      <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Social links */}
        <div className="flex items-center gap-3">
          {[
            { label: "GitHub", href: "https://github.com/amrilsyaifa" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/amril-syaifa-yasin-506530141/" },
            { label: "Medium", href: "https://medium.com/@amrilsyaifa" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-md hover:border-accent hover:text-accent transition-all duration-300 hover:shadow-glow-sm"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: language + copyright */}
        <div className="flex items-center gap-4">
          <select
            value={locale as string}
            onChange={(e) => onChangeLocale(e.target.value)}
            className="bg-bg-card text-text-secondary border border-border rounded-md px-2 py-1 text-xs cursor-pointer hover:border-accent focus:border-accent focus:outline-none transition-colors"
          >
            <option value="en">English</option>
            <option value="id">Indonesia</option>
          </select>
          <span className="text-text-muted text-xs">
            © {currentYear} {t("copyright")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
