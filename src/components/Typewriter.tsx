import useTypewriter from "@components/hooks/useTypewriter";
import { FC } from "react";

interface TypewriterProps {
  text: string;
  speed: number;
  className?: string;
}

const Typewriter: FC<TypewriterProps> = ({ text, speed, className }) => {
  const displayText = useTypewriter(text, speed);

  return <p className={className}>{displayText}</p>;
};

export default Typewriter;
