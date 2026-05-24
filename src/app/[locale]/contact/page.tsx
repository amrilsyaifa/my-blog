import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Contact",
    description: "Get in touch with Amril Syaifa Yasin",
  };
}

const CONTACTS = [
  { icon: "✉️", label: "Email", value: "amrilsyaifa@gmail.com", href: "mailto:amrilsyaifa@gmail.com" },
  { icon: "📷", label: "Instagram", value: "@iamrils", href: "https://www.instagram.com/iamrils/" },
  { icon: "𝕏", label: "Twitter/X", value: "@amrilsyaifay", href: "https://x.com/amrilsyaifay" },
  { icon: "⌨️", label: "GitHub", value: "amrilsyaifa", href: "https://github.com/amrilsyaifa" },
  { icon: "💼", label: "LinkedIn", value: "amril-syaifa-yasin", href: "https://www.linkedin.com/in/amril-syaifa-yasin-506530141/" },
];

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("contact");

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-sm mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">Let&apos;s Talk</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">{t("get_in_touch")}</h1>
            <p className="text-text-secondary">{t("feel_free")}</p>
          </div>

          {/* Contact list */}
          <div className="space-y-3">
            {CONTACTS.map(({ icon, label, value, href }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-4 p-4 bg-bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-text-primary font-medium group-hover:text-accent transition-colors truncate">{value}</p>
                </div>
                <svg className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
