import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Contact",
    description: "Amril Syaifa Yasin",
  };
}

export default function Contact() {
  return (
    <main className="flex min-h-[calc(100vh-7.5em)] flex-col items-start justify-center p-24 bg-white dark:bg-slate-900">
      <div>Contact</div>
    </main>
  );
}
