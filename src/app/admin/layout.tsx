import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import AdminShell from "@components/components/admin/AdminShell";
import CustomCursor from "@components/components/CustomCursor";
import "../globals.css";

const chakrapetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASY Admin",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={chakrapetch.className}>
        <AdminShell>{children}</AdminShell>
        <CustomCursor />
      </body>
    </html>
  );
}
