import Navbar from "@components/components/Navbar";
import Footer from "@components/components/Footer";
import type { Metadata } from "next";
import AboutCV from "@components/views/about/AboutCV";
import AboutProfile from "@components/views/about/AboutProfile";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | About",
    description: "Amril Syaifa Yasin — Software Engineer",
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4">
          <AboutProfile />
          <AboutCV />
        </div>
      </main>
      <Footer />
    </div>
  );
}
