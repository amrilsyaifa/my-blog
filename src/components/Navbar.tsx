"use client";

import classNames from "classnames";
import Tabs from "@components/constants/tabs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import Typewriter from "./Typewriter";
import { useDisclosure } from "@components/hooks/useDisclosure";
import { useClickOutside } from "@components/hooks/useClickOutside";

const Navbar = () => {
  const t = useTranslations("navbar");
  const [isOpen, handler] = useDisclosure();
  const ref = useClickOutside(() => handler.close());
  const [activeTab, setActiveTab] = useState("home");

  const { locale } = useParams();
  const path = usePathname();

  useEffect(() => {
    const active = Tabs.find((tab) => path.includes(tab.key));
    if (active) {
      setActiveTab(active.key);
    } else {
      setActiveTab("home");
    }
  }, [path]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full">
      <div
        ref={ref}
        className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <Typewriter text="AmrilSyaifa" speed={50} />
          </span>
        </Link>
        <button
          onClick={handler.toggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          id="navbar-default"
          className={classNames("w-full md:block md:w-auto", {
            "hidden relative": !isOpen,
            "absolute top-12 left-0": isOpen,
          })}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {Tabs.map((tab) => (
              <li key={tab.key} onClick={handler.close}>
                <Link
                  href={`/${locale}/${tab.path}`}
                  className={classNames(
                    "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent",
                    {
                      "!text-blue-700": activeTab === tab.key,
                      "text-gray-900": activeTab !== tab.key,
                    }
                  )}
                >
                  {t(tab.key)}
                </Link>
              </li>
            ))}
            <li>
              <ThemeSwitch />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
