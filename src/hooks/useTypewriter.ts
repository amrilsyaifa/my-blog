import { useState, useEffect } from "react";

let displayText = "";
const useTypewriter = (text: string, speed = 100) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setIsTyping(true);
    const timeoutId = setTimeout(() => {
      if (index === text.length) {
        setIsTyping(false);
        clearTimeout(timeoutId);
        return;
      }

      setDisplayText((prevText) => prevText + text.charAt(index));
      setIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speed, index]);
  if (isTyping) {
    return displayText + "_";
  }

  return displayText;
};

export default useTypewriter;
