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
    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
      {data.map((item) => (
        <li
          className="me-2"
          key={item.value}
          onClick={() => onSelect?.(item.value)}
        >
          <div
            className={classNames("inline-block p-4 rounded-t-lg ", {
              "text-blue-600": item.value === value,
              "cursor-not-allowed text-gray-400 dark:text-gray-500":
                item.isDisabled,
              "cursor-pointer hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300":
                !item.isDisabled,
            })}
          >
            {item.label}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Tab;
