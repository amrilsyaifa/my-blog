import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Blog",
    description: "Amril Syaifa Yasin",
  };
}

export default function Blog() {
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start justify-center p-24 bg-white dark:bg-slate-900">
      <div>Blog</div>
    </main>
  );
}
