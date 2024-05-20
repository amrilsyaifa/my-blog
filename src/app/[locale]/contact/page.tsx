import TitleContact from "@components/views/contact/Title";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Instagram, Twitter, Mail } from "react-feather";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Contact",
    description: "Amril Syaifa Yasin",
  };
}

export default function Contact() {
  const t = useTranslations("contact");
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start justify-center p-24 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center w-full">
        <TitleContact title={t("title")} />
        <div className="mt-16">
          <ul className="mt-2">
            <li className="mb-3">
              <Link
                href="https://www.instagram.com/iamrils/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex flex-row items-center gap-4">
                  <Instagram className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">iamrils</span>
                </div>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                href="https://x.com/amrilsyaifay"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex flex-row items-center gap-4">
                  <Twitter className="dark:text-[#ec7a56] text-gray-800" />
                  <span className="text-gray-800 dark:text-white">
                    amrilsyaifay
                  </span>
                </div>
              </Link>
            </li>
            <li className="mb-3">
              <div className="flex flex-row items-center gap-4">
                <Mail className="dark:text-[#ec7a56] text-gray-800" />
                <span className="text-gray-800 dark:text-white">
                  amrilsyaifa@gmail.com
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
