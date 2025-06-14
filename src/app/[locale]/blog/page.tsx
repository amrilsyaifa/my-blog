import BlogView from "@components/views/blog/BlogView";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ASY | Blog",
    description: "Amril Syaifa Yasin",
  };
}

export default function Blog() {
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start p-4 md:p-24 pt-20 bg-gray-100 dark:bg-slate-900">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full">
        <BlogView />
      </div>
    </main>
  );
}
