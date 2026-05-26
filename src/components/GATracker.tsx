"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function GATracker() {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [role='button'], [data-ga-event]"
      ) as HTMLElement | null;
      if (!el) return;

      sendGAEvent("event", "click", {
        element_type: el.tagName.toLowerCase(),
        element_text: el.textContent?.trim().slice(0, 100) ?? "",
        element_href: (el as HTMLAnchorElement).href ?? "",
        page_path:    window.location.pathname,
      });
    };

    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  return null;
}
