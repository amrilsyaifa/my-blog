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
  project_by?: "self" | "company";
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
    <div className="group bg-bg-card border border-border rounded-xl p-5 flex flex-col justify-between hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col flex-1">
        <Link
          href={newLink}
          rel="noopener noreferrer"
          target={is_detail ? undefined : "_blank"}
        >
          <h3 className="mb-2 text-base font-bold capitalize text-text-primary group-hover:text-accent transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      </div>

      {dev_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
          {dev_stack.map((stack, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs rounded-md bg-accent/10 border border-accent/20 text-accent"
            >
              {stack.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
