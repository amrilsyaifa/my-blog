"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Inner from "@components/components/layout/Inner";

interface PageAnimatePresenceProps {
  children: React.ReactNode;
}

const PageAnimatePresence: FC<PageAnimatePresenceProps> = ({ children }) => {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <Inner>{children}</Inner>
    </AnimatePresence>
  );
};

export default PageAnimatePresence;
