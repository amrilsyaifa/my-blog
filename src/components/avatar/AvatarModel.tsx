"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import Head from "./Head";
import Body from "./Body";
import Arms from "./Arms";

/*
 * AvatarRig — master idle animation + mouse interaction controller.
 *
 * Animation layers:
 *   1. GSAP (in Head/Body/Arms)  — breathing, blink, arm sway
 *   2. useFrame (here)           — floating, micro-rotation, balance
 *   3. Mouse (here)              — head looks at cursor anywhere on page
 *                                  (same technique as david-hckh.com)
 *
 * Mouse formula: clientX/width − 0.5  →  −0.5 to +0.5 (matches david-hckh)
 * Sine waves use irrational-ratio frequencies — never perfectly repeats.
 */
export default function AvatarModel() {
  const rootRef  = useRef<Group>(null);
  const headRef  = useRef<Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // ── Track mouse across the entire page (not just the canvas) ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x =  e.clientX / window.innerWidth  - 0.5; // −0.5 → +0.5
      mouseRef.current.y =  e.clientY / window.innerHeight - 0.5; // −0.5 → +0.5
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    if (rootRef.current) {
      // Floating — compound sine, never loops (π-ratio)
      rootRef.current.position.y =
        Math.sin(t * 0.52) * 0.016 +
        Math.sin(t * 0.31 * Math.PI) * 0.008;

      // Subtle body lean follows mouse (parallax feel)
      rootRef.current.position.x = mx * 0.055;

      // Weight shift
      rootRef.current.rotation.z =
        Math.sin(t * 0.28) * 0.011 +
        Math.sin(t * 0.43) * 0.004;

      // Micro Y rotation
      rootRef.current.rotation.y =
        Math.sin(t * 0.19) * 0.028 +
        Math.sin(t * 0.37) * 0.01;
    }

    if (headRef.current) {
      // ── Head tracks cursor + idle sway layered on top ─────
      // Mouse drives 90 % of the look direction; idle adds life
      const targetY =
        mx * 0.42 +                         // cursor X → looks left/right
        Math.sin(t * 0.36) * 0.04 +         // + tiny idle drift
        Math.sin(t * 0.61 * Math.PI) * 0.015;

      const targetX =
        my * -0.2 +                          // cursor Y → tilts up/down (inverted)
        Math.sin(t * 0.27) * 0.015 - 0.02;  // + slight default downward tilt

      const targetZ =
        Math.sin(t * 0.44) * 0.016;          // subtle head roll, unaffected by mouse

      // Lerp damping — same 0.06 factor as david-hckh.com's 0.1 × deltaRatio
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.06;
      headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.06;
      headRef.current.rotation.z += (targetZ - headRef.current.rotation.z) * 0.04;
    }
  });

  return (
    <group ref={rootRef} position={[-0.2, -0.08, 0]}>
      <Body />
      <Arms />
      <Head ref={headRef} />
    </group>
  );
}
