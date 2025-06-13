import Link from "next/link";
import { FC } from "react";

export type DevStack = {
  is_open_new_tab: boolean;
  title: string;
  url?: string;
};
export interface ProjectItemProps {
  id: string;
  title: string;
  description: string;
  link: string;
  order: number;
  dev_stack: DevStack[];
  is_detail?: boolean;
}

const ProjectItem: FC<ProjectItemProps> = ({
  link,
  title,
  description,
  dev_stack,
  is_detail,
}) => {
  const newLink = link[0] === "/" ? link.replace("/", "") : link;
  return (
    <div className="w-full md:max-w-sm p-6 border border-gray-200 rounded-lg shadow  dark:border-gray-700 flex flex-col justify-between">
      <div className="flex flex-col">
        <Link
          href={newLink}
          rel="noopener noreferrer"
          target={is_detail ? undefined : "_blank"}
        >
          <h5 className="mb-2 text-lg font-bold tracking-tight line-clamp-2 dark:text-[#ec7a56] text-gray-800 capitalize">
            {title}
          </h5>
        </Link>
        <p className="mb-3 font-normal line-clamp-3 dark:text-gray-400 text-gray-800 italic">
          {description}
        </p>
      </div>
      <div className="flex flex-row items-center text-gray-400 text-md gap-2 flex-wrap">
        <span className="font-bold dark:text-gray-400 text-gray-800">[ </span>
        {dev_stack?.map((stack, idx) => {
          console.log("stack", stack);
          return (
            <div key={idx} className="flex flex-row items-center">
              <span className="text-gray-800 dark:text-[#ec7a56]">
                {stack.title}
              </span>
              {idx !== dev_stack.length - 1 && (
                <div className="ml-2 w-1.5 h-1.5 rounded-full dark:bg-[#ec7a56] bg-gray-600" />
              )}
            </div>
          );
        })}
        <span className="font-bold dark:text-gray-400 text-gray-800"> ]</span>
      </div>
    </div>
  );
};

export default ProjectItem;
