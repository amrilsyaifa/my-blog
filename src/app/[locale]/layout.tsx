import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import "../globals.css";
import PageTransitionEffect from "@components/hoc/PageTransitionEffect";
import CustomCursor from "@components/components/CustomCursor";
import ChatWidgetLoader from "@components/components/chat/ChatWidgetLoader";
import GATracker from "@components/components/GATracker";

const chakrapetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASY | Home",
  description: "Amril Syaifa Yasin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${chakrapetch.className} overflow-y-auto overflow-x-hidden`}>
        <Providers>
          <CustomCursor />
          <PageTransitionEffect>
            {children}
          </PageTransitionEffect>
          <ChatWidgetLoader />
        </Providers>
        <GATracker />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
