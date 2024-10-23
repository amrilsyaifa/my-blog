"use client";

import classNames from "classnames";
import Tabs from "@components/constants/tabs";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import { useDisclosure } from "@components/hooks/useDisclosure";
import { useClickOutside } from "@components/hooks/useClickOutside";
import gsap from "gsap";

const Navbar = () => {
  const t = useTranslations("navbar");
  const [isOpen, handler] = useDisclosure();
  const [activeTab, setActiveTab] = useState("home");
  const navRef = useClickOutside<HTMLElement>(() => handler.close());
  const logoRef = useRef<HTMLAnchorElement>(null);

  const { locale } = useParams();
  const path = usePathname();

  useEffect(() => {
    const active = Tabs.find((tab) => path.includes(tab.key));
    setActiveTab(active ? active.key : "home");
  }, [path]);

  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.querySelectorAll(".nav-link"),
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.2 }
      );
    }
    // navRef is a stable ref object — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed w-full z-50 border-b border-border/40"
      style={{ backgroundColor: "var(--navbar-bg)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3"
      >
        {/* Logo */}
        <Link ref={logoRef} href={`/${locale}/`} className="hover:opacity-80 transition-opacity duration-300">
          <Image src="/asy.png" alt="ASY" width={44} height={44} className="object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {Tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "home" ? `/${locale}/` : `/${locale}${tab.path}`}
              className={classNames(
                "nav-link relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                {
                  "text-accent bg-accent/10": activeTab === tab.key,
                  "text-text-secondary hover:text-text-primary hover:bg-white/5": activeTab !== tab.key,
                }
              )}
            >
              {t(tab.key)}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeSwitch />
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitch />
          <button
            onClick={handler.toggle}
            type="button"
            className="p-2 text-text-secondary hover:text-text-primary rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 px-4 py-2" style={{ backgroundColor: "var(--navbar-bg)" }}>
          {Tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "home" ? `/${locale}/` : `/${locale}${tab.path}`}
              onClick={handler.close}
              className={classNames(
                "block px-3 py-2.5 text-sm font-medium rounded-md mb-1 transition-all duration-200",
                {
                  "text-accent bg-accent/10": activeTab === tab.key,
                  "text-text-secondary hover:text-text-primary hover:bg-white/5": activeTab !== tab.key,
                }
              )}
            >
              {t(tab.key)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
