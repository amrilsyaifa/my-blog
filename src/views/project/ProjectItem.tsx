import Link from "next/link";
import { FC } from "react";

export interface ProjectItemProps {
  id: string;
  title: string;
  description: string;
  link: string;
  order: number;
}

const ProjectItem: FC<ProjectItemProps> = ({ link, title, description }) => {
  return (
    <div className="w-full md:max-w-sm p-6 border border-gray-200 rounded-lg shadow  dark:border-gray-700">
      <Link href={link} rel="noopener noreferrer" target="_blank">
        <h5 className="mb-2 text-2xl font-bold tracking-tight line-clamp-2 text-gray-900 dark:text-white">
          {title}
        </h5>
      </Link>
      <p className="mb-3 font-normal line-clamp-3 text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default ProjectItem;
