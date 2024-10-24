import React, { FC } from "react";
import { motion } from "framer-motion";
import { slide, opacity, perspective } from "./anim";

// https://github.com/olivierlarose/nextjs-framer-page-transition/blob/main/src/components/Layout/Inner/style.scss

const anim = (variants: any) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  };
};

interface InnerProps {
  children: React.ReactNode;
}

const Inner: FC<InnerProps> = ({ children }) => {
  return (
    <div className="inner">
      <motion.div className="slide" {...anim(slide)} />
      <motion.div className="page" {...anim(perspective)}>
        <motion.div {...anim(opacity)}>{children}</motion.div>
      </motion.div>
    </div>
  );
};

export default Inner;
