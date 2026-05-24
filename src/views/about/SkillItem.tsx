import { FC } from "react";

export interface SkillItemProps {
  id: string;
  name: string;
  data: string[];
  skill_order: number;
}

const SkillItem: FC<SkillItemProps> = ({ name, data }) => {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors duration-300">
      <h4 className="text-text-primary font-semibold text-sm mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        {name}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {data.map((item) => (
          <span
            key={item}
            className="px-2 py-0.5 text-xs rounded-md bg-bg border border-border text-text-secondary hover:border-accent/40 hover:text-accent transition-colors duration-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillItem;
