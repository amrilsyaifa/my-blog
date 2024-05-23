"use client";

import Typewriter from "@components/components/Typewriter";
import { FC } from "react";

interface TitleContactProps {
  title: string;
}

const TitleProject: FC<TitleContactProps> = ({ title }) => {
  return (
    <Typewriter
      text={title}
      speed={50}
      className="text-2xl md:text-4xl dark:text-[#ec7a56] text-gray-800 mb-6"
    />
  );
};

export default TitleProject;
