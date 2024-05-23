import { FC } from "react";
import { Aperture } from "react-feather";

export interface SkillItemProps {
  id: string;
  name: string;
  data: string[];
  skill_order: number;
}

const SkillItem: FC<SkillItemProps> = ({ name, data }) => {
  return (
    <div className="flex flex-row gap-4 ">
      <div className="w-4 h-4">
        <Aperture className="dark:text-[#ec7a56] text-gray-800 w-4 h-4 mt-1.5" />
      </div>
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-lg">{name}</h3>
        <div className="flex flex-row items-center flex-wrap gap-4">
          {data.map((item) => (
            <div key={item} className="flex flex-row items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full dark:bg-[#ec7a56] bg-gray-800" />
              <p className="text-md italic">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillItem;
