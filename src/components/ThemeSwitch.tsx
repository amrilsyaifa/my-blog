"use client";

import classNames from "classnames";
import { Sun, Moon } from "react-feather";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setIsMounted(true), []);

  const checked = resolvedTheme === "dark";

  const onClickToogleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!isMounted) return null;

  return (
    <div
      onClick={onClickToogleTheme}
      className={classNames("toggle-slot", {
        "bg-[#374151] shadow-[0_2px_10px_#e4e7ec]": checked,
        "bg-gray-100 shadow-[0_2px_10px_#374151]": !checked,
      })}
    >
      <div
        className={classNames("sun-icon-wrapper", {
          "sun-checked": checked,
          "sun-unchecked": !checked,
        })}
      >
        <Sun className="sun-icon" />
      </div>
      <div
        className={classNames("toggle-button", {
          "toggle-button-checked": checked,
          "toggle-button-unchecked": !checked,
        })}
      ></div>
      <div
        className={classNames("moon-icon-wrapper", {
          "moon-checked": checked,
          "moon-unchecked": !checked,
        })}
      >
        <Moon className="moon-icon" />
      </div>
    </div>
  );
};

export default ThemeSwitch;
