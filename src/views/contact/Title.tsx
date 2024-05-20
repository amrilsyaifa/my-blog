"use client";

import Typewriter from "@components/components/Typewriter";
import { FC } from "react";

interface TitleContactProps {
  title: string;
}

const TitleContact: FC<TitleContactProps> = ({ title }) => {
  return (
    <Typewriter
      text={title}
      speed={50}
      className="text-4xl md:text-6xl dark:text-[#ec7a56] text-gray-800"
    />
  );
};

export default TitleContact;
