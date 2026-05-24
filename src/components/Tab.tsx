import { FC } from "react";
import classNames from "classnames";

interface DataProps {
  label: string;
  value: string;
  isDisabled?: boolean;
}

interface TabProps {
  value: string;
  data: DataProps[];
  onSelect?: (value: string) => void;
}

const Tab: FC<TabProps> = ({ data, value, onSelect }) => {
  return (
    <div className="flex gap-2">
      {data.map((item) => (
        <button
          key={item.value}
          disabled={item.isDisabled}
          onClick={() => onSelect?.(item.value)}
          className={classNames(
            "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            {
              "bg-accent text-white shadow-glow-sm": item.value === value,
              "bg-bg-card border border-border text-text-secondary hover:border-accent/50 hover:text-text-primary":
                item.value !== value && !item.isDisabled,
              "opacity-40 cursor-not-allowed bg-bg-card border border-border text-text-muted":
                item.isDisabled,
            }
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tab;
