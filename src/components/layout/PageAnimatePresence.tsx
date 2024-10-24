"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Inner from "@components/components/layout/Inner";
import RouteChangeAnimation from "@components/hoc/RouteChangeAnimation";

interface PageAnimatePresenceProps {
  children: React.ReactNode;
}

const PageAnimatePresence: FC<PageAnimatePresenceProps> = ({ children }) => {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <RouteChangeAnimation>
        <Inner>{children}</Inner>
      </RouteChangeAnimation>
    </AnimatePresence>
  );
};

export default PageAnimatePresence;
