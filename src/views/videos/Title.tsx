"use client";

import Typewriter from "@components/components/Typewriter";
import React, { FC } from "react";

interface TitleVideosProps {
  title: string;
}

const TitleVideos: FC<TitleVideosProps> = ({ title }) => {
  return (
    <Typewriter
      text={title}
      speed={50}
      className=" text-4xl md:text-6xl dark:text-[#ec7a56] text-gray-800"
    />
  );
};

export default TitleVideos;
