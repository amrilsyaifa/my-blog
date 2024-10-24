import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Providers } from "./providers";
import "../globals.scss";
import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import { routing } from "@components/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import PageAnimatePresence from "@components/components/layout/PageAnimatePresence";

const chakrapetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASY | Home",
  description: "Amril Syaifa Yasin",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { id: string; locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${chakrapetch.className} overflow-y-auto overflow-x-hidden`}
      >
        <Providers messages={messages}>
          <PageAnimatePresence>
            <Navbar />
            {children}
            <Footer />
          </PageAnimatePresence>
        </Providers>
      </body>
    </html>
  );
}
