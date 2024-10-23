import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

export interface BlogItemProps {
  id: string;
  title: string;
  description: string;
  url: string;
  lang: "en" | "id";
  date: string;
  order: number;
  thumbnail?: string;
}

const BlogItem: FC<BlogItemProps> = ({ title, description, date, url, thumbnail, lang }) => {
  return (
    <Link href={url} rel="noopener noreferrer" target="_blank" className="group block">
      <div className="flex gap-4 p-4 rounded-2xl border border-border hover:border-accent/40 hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden border border-border">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 via-accent/5 to-bg-secondary relative overflow-hidden">
              {/* Article lines pattern */}
              <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-2.5 py-2.5">
                <div className="h-1 rounded-full bg-accent/35 w-full" />
                <div className="h-1 rounded-full bg-accent/20 w-4/5" />
                <div className="h-1 rounded-full bg-accent/25 w-full" />
                <div className="h-1 rounded-full bg-accent/15 w-3/5" />
                <div className="h-1 rounded-full bg-accent/20 w-full" />
                <div className="h-1 rounded-full bg-accent/10 w-2/3" />
              </div>
              {/* Pen icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 flex-1">
              {title}
            </h2>
            <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-accent/10 border border-accent/20 text-accent uppercase tracking-wider">
              {lang}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
          <p className="text-xs text-text-muted italic mt-auto">{date}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogItem;
