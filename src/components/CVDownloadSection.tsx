"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./CVDownloadLinksInner"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-3 mt-6">
      {[0, 1].map(i => (
        <div key={i} className="h-12 w-44 rounded-xl bg-bg-card border border-border animate-pulse" />
      ))}
    </div>
  ),
});

export default function CVDownloadSection() {
  return <Inner />;
}
