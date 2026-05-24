import Link from "next/link";
import { FC } from "react";

export interface BlogItemProps {
  id: string;
  title: string;
  description: string;
  url: string;
  lang: "en" | "id";
  date: string;
  order: number;
}

const BlogItem: FC<BlogItemProps> = ({ title, description, date, url }) => {
  return (
    <Link href={url} rel="noopener noreferrer" target="_blank" className="group block">
      <div className="flex flex-col gap-2 hover:-translate-y-0.5 transition-transform duration-200">
        <h2 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-text-muted italic">{date}</p>
      </div>
    </Link>
  );
};

export default BlogItem;
