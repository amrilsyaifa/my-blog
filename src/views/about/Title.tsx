"use client";

import Typewriter from "@components/components/Typewriter";
import React, { FC } from "react";

interface TitleAboutProps {
  title: string;
}

const TitleAbout: FC<TitleAboutProps> = ({ title }) => {
  return (
    <Typewriter
      text={title}
      speed={50}
      className="text-2xl md:text-4xl dark:text-[#ec7a56] text-gray-800"
    />
  );
};

export default TitleAbout;
