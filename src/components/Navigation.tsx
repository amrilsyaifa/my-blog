"use client";

import Link from "next/link";
import { useState } from "react";
import "../styles/navigation.css";
import { useTranslations } from "next-intl";

export default function Navigation({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navbar");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      <button className="hamburger-menu" onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

      {/* Navigation menu */}
      <nav className={`nav-menu ${isOpen ? "nav-open" : ""}`}>
        <Link href={`/${locale}`} onClick={closeMenu}>
          🏠 {t("home")}
        </Link>
        <Link href={`/${locale}/about`} onClick={closeMenu}>
          👤 {t("about")}
        </Link>
        <Link href={`/${locale}/project`} onClick={closeMenu}>
          💼 {t("project")}
        </Link>
        <Link href={`/${locale}/blog`} onClick={closeMenu}>
          📝 {t("blog")}
        </Link>
        <Link href={`/${locale}/videos`} onClick={closeMenu}>
          🎬 {t("videos")}
        </Link>
        <Link href={`/${locale}/contact`} onClick={closeMenu}>
          ✉️ {t("contact")}
        </Link>
      </nav>
    </>
  );
}
