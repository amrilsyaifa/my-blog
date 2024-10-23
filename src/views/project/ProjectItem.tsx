import Link from "next/link";
import Image from "next/image";
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
  thumbnail?: string;
}

const TerminalPlaceholder = ({ name }: { name: string }) => (
  <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
    {/* Terminal header */}
    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-auto text-[10px] text-[#6e7681] font-mono truncate">
        {name.toLowerCase().replace(/\s+/g, "-")}.tsx
      </span>
    </div>
    {/* Code lines */}
    <div className="flex-1 flex flex-col gap-1.5 p-3 font-mono text-[10px] overflow-hidden">
      <div className="flex gap-1.5 items-center">
        <span className="text-[#58a6ff]">import</span>
        <span className="text-[#e6edf3]">{"{ FC }"}</span>
        <span className="text-[#58a6ff]">from</span>
        <span className="text-[#a5d6ff]">&ldquo;react&rdquo;</span>
      </div>
      <div className="h-px bg-[#30363d] w-full my-0.5" />
      <div className="flex gap-1.5 items-center">
        <span className="text-[#d2a8ff]">const</span>
        <span className="text-[#79c0ff]">App</span>
        <span className="text-[#e6edf3]">{"= () => {"}</span>
      </div>
      <div className="pl-4 flex gap-1.5 items-center">
        <span className="text-[#ff7b72]">return</span>
        <span className="text-[#e6edf3]">(</span>
      </div>
      <div className="pl-8 h-1.5 rounded-sm bg-[#3fb950]/30 w-4/5" />
      <div className="pl-8 h-1.5 rounded-sm bg-[#58a6ff]/25 w-3/5" />
      <div className="pl-8 h-1.5 rounded-sm bg-[#d2a8ff]/20 w-5/6" />
      <div className="pl-8 h-1.5 rounded-sm bg-[#ffa657]/20 w-2/3" />
      <div className="pl-4 text-[#e6edf3]">)</div>
      <div className="text-[#e6edf3]">{"}"}</div>
    </div>
  </div>
);

const ProjectItem: FC<ProjectItemProps> = ({
  link,
  title,
  description,
  dev_stack,
  is_detail,
  thumbnail,
}) => {
  const newLink = link[0] === "/" ? link.replace("/", "") : link;

  return (
    <div className="group bg-bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5">
      {/* Thumbnail */}
      <div className="relative h-44 shrink-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <TerminalPlaceholder name={title} />
        )}
        {/* Bottom fade into card */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg-card to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link
          href={newLink}
          rel="noopener noreferrer"
          target={is_detail ? undefined : "_blank"}
        >
          <h3 className="mb-2 text-base font-bold capitalize text-text-primary group-hover:text-accent transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

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
    </div>
  );
};

export default ProjectItem;
