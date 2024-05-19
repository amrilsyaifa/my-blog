import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Providers } from "./providers";
import "../globals.css";
import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";

const chakrapetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASY | Home",
  description: "Amril Syaifa Yasin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={chakrapetch.className}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
