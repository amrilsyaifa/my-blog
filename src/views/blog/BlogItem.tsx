import Link from "next/link";
import { FC } from "react";

export interface BlogItemProps {
  id: string;
  title: string;
  description: string;
  url: string;
  lang: "en" | "id";
  date: string;
}

const BlogItem: FC<BlogItemProps> = ({ title, description, date, url }) => {
  return (
    <Link href={url} rel="noopener noreferrer" target="_blank">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold line-clamp-2 dark:text-[#ec7a56] text-gray-800">
          {title}
        </h1>
        <p className="text-md mt-4 line-clamp-2 dark:text-gray-400 text-gray-800">
          {description}
        </p>
        <p className="text-sm mt-4 dark:text-gray-400 text-gray-800 italic capitalize">
          {date}
        </p>
      </div>
    </Link>
  );
};

export default BlogItem;
