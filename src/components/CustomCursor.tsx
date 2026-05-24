"use client";

import { useEffect, useRef } from "react";

/*
 * CustomCursor — dot + ring animated cursor.
 * Same pattern as david-hckh.com:
 *   - Dot snaps instantly to cursor position
 *   - Ring lerps toward dot with factor 0.12 per RAF frame (smooth lag)
 *
 * Only active on devices that support hover (pointer: fine).
 * Touch / mobile: cursor elements stay hidden, no layout shift.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop (pointer: fine means a precise pointing device)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf: number;
    let tx = -100, ty = -100; // start off-screen
    let cx = -100, cy = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // Ring lerps toward dot — 0.12 factor matches david-hckh.com
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    // Show elements (hidden by default for SSR / touch devices)
    if (dotRef.current)  dotRef.current.style.opacity  = "1";
    if (ringRef.current) ringRef.current.style.opacity = "1";

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
