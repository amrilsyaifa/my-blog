import { animate, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

interface CurveProps {
  children: React.ReactNode;
}

interface SVGProps {
  width: number;
  height: number;
}

const Curve: FC<CurveProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resize();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const anim = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
    };
  };
  return (
    <div className="page curve">
      {/* {dimensions.width > 0 && <SVG {...dimensions} />} */}
      {children}
    </div>
  );
};

export default Curve;

const SVG: FC<SVGProps> = ({ width, height }) => {
  const initialPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height + 300}
    Q${width / 2} ${height + 300} 0 ${height + 300}
    L0 300
  `;
  return (
    <svg>
      <path d={initialPath}></path>
    </svg>
  );
};
