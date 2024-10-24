"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface RouteChangeAnimationProps {
  children: ReactNode;
}

const RouteChangeAnimation = ({ children }: RouteChangeAnimationProps) => {
  const pathname = usePathname();
  return <motion.div key={pathname}>{children}</motion.div>;
};

export default RouteChangeAnimation;
