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
        <h5 className="mb-2 text-lg font-bold tracking-tight line-clamp-2 dark:text-[#ec7a56] text-gray-800">
          {title}
        </h5>
      </Link>
      <p className="mb-3 font-normal line-clamp-3 dark:text-gray-400 text-gray-800 italic">
        {description}
      </p>
    </div>
  );
};

export default ProjectItem;
