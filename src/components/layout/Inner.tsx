import React, { FC } from "react";
import { motion, Variants } from "framer-motion";
import { slide, opacity, perspective } from "./anim";

interface InnerProps {
  children: React.ReactNode;
}

const Inner: FC<InnerProps> = ({ children }) => {
  return (
    <div className="inner">
      <motion.div
        className="slide"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={slide as Variants}
      />
      <motion.div
        className="page"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={perspective as Variants}
      >
        <motion.div
          initial="initial"
          animate="enter"
          exit="exit"
          variants={opacity as Variants}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Inner;
