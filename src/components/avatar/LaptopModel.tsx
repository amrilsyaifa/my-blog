"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial } from "three";
import gsap from "gsap";
import { useTheme } from "next-themes";

/* ── Palette ────────────────────────────────────────────── */
const ALU = "#9a9a9c"; // aluminum (same in both themes)

const DARK = {
  BEZEL: "#1a1a1c",
  SCR:   "#1e2127",
  MENU:  "#2c313a",
  DECK:  "#2c2c2e",
  KEYS:  "#3c3c3e",
  PAD:   "#3a3a3c",
  KW:    "#c678dd",
  FN:    "#61afef",
  STR:   "#98c379",
  TXT:   "#abb2bf",
  CMT:   "#5c6370",
};

const LIGHT = {
  BEZEL: "#d1d1d3",
  SCR:   "#fafafa",
  MENU:  "#e8e8ea",
  DECK:  "#e0e0e2",
  KEYS:  "#c8c8ca",
  PAD:   "#d4d4d6",
  KW:    "#a626a4",
  FN:    "#4078f2",
  STR:   "#50a14f",
  TXT:   "#383a42",
  CMT:   "#a0a1a7",
};

/* ── Code rows ──────────────────────────────────────────── */
type Seg = { c: string; w: number; ml: number };

function makeRows(p: typeof DARK): Seg[][] {
  return [
    [{ c: p.CMT, w: 0.60, ml: 0 }],
    [],
    [{ c: p.KW, w: 0.12, ml: 0 }, { c: p.TXT, w: 0.10, ml: 0.13 },
     { c: p.TXT, w: 0.06, ml: 0.25 }, { c: p.STR, w: 0.18, ml: 0.32 }],
    [{ c: p.KW, w: 0.12, ml: 0 }, { c: p.TXT, w: 0.06, ml: 0.13 },
     { c: p.FN, w: 0.16, ml: 0.20 }, { c: p.TXT, w: 0.06, ml: 0.37 },
     { c: p.STR, w: 0.16, ml: 0.44 }],
    [],
    [{ c: p.KW, w: 0.10, ml: 0 }, { c: p.FN, w: 0.16, ml: 0.11 },
     { c: p.TXT, w: 0.04, ml: 0.28 }, { c: p.KW, w: 0.12, ml: 0.33 },
     { c: p.TXT, w: 0.04, ml: 0.46 }],
    [{ c: p.KW, w: 0.08, ml: 0.04 }, { c: p.TXT, w: 0.12, ml: 0.13 },
     { c: p.FN, w: 0.18, ml: 0.26 }],
    [{ c: p.KW, w: 0.10, ml: 0.04 }, { c: p.STR, w: 0.26, ml: 0.15 }],
    [{ c: p.TXT, w: 0.04, ml: 0 }],
  ];
}

/* ── Blinking cursor ────────────────────────────────────── */
function BlinkingCursor({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<Mesh>(null);
  useEffect(() => {
    let vis = true;
    const id = setInterval(() => {
      vis = !vis;
      if (ref.current) ref.current.visible = vis;
    }, 530);
    return () => clearInterval(id);
  }, []);
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.018, 0.026, 0.001]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
    </mesh>
  );
}

/* ── Code display ───────────────────────────────────────── */
function CodeDisplay({ p }: { p: typeof DARK }) {
  const W      = 1.66;
  const H      = 1.05;
  const ROW_H  = 0.075;
  const PAD_T  = 0.10;
  const PAD_L  = 0.06;
  const usable = W - PAD_L * 2;

  return (
    <group>
      {/* macOS menu bar */}
      <mesh position={[0, H / 2 - 0.023, 0]}>
        <boxGeometry args={[W, 0.034, 0.001]} />
        <meshStandardMaterial color={p.MENU} emissive={p.MENU} emissiveIntensity={0.35} />
      </mesh>

      {/* Traffic-light dots */}
      {(["#ff5f57", "#febc2e", "#28c840"] as string[]).map((col, i) => (
        <mesh key={i} position={[-W / 2 + PAD_L + i * 0.032, H / 2 - 0.085, 0]}>
          <circleGeometry args={[0.009, 12]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Code rows */}
      {makeRows(p).map((row, ri) => {
        const rowY = H / 2 - PAD_T - ri * ROW_H;
        return (
          <group key={ri} position={[0, rowY, 0]}>
            {row.map((seg, si) => {
              const barW = seg.w * usable;
              const bx = -W / 2 + PAD_L + seg.ml * usable + barW / 2;
              return (
                <mesh key={si} position={[bx, 0, 0]}>
                  <boxGeometry args={[barW, 0.020, 0.001]} />
                  <meshStandardMaterial
                    color={seg.c}
                    emissive={seg.c}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Blinking cursor — row 9 */}
      <BlinkingCursor
        position={[-W / 2 + PAD_L + 0.009, H / 2 - PAD_T - 9 * ROW_H, 0]}
        color={p.TXT}
      />
    </group>
  );
}

/* ── Apple logo (thin disc on lid back) ─────────────────── */
function AppleLogo() {
  return (
    <mesh>
      <circleGeometry args={[0.085, 24]} />
      <meshStandardMaterial
        color="#c0c0c2"
        emissive="#909092"
        emissiveIntensity={0.18}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

/* ── Main laptop model ──────────────────────────────────── */
export default function LaptopModel() {
  const { resolvedTheme } = useTheme();
  const p = resolvedTheme === "light" ? LIGHT : DARK;

  const groupRef  = useRef<Group>(null);
  const scrMatRef = useRef<MeshStandardMaterial>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth  - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const mat = scrMatRef.current;
    if (mat) {
      gsap.to(mat, {
        emissiveIntensity: 0.38,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (mat) gsap.killTweensOf(mat);
    };
  }, []);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const mx = mouseRef.current.x;

    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(t * 0.52) * 0.018 +
        Math.sin(t * 0.31 * Math.PI) * 0.009;

      const targetY = mx * 0.22;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.05;

      groupRef.current.rotation.z = Math.sin(t * 0.28) * 0.008;
    }
  });

  // Lid open ~105° — +0.26 rad = 15° past vertical toward viewer
  const lidTilt = 0.26;

  return (
    <group ref={groupRef} position={[0, -0.15, 0.2]}>

      {/* ── BASE ─────────────────────────────────────── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.066, 1.2]} />
        <meshStandardMaterial color={ALU} roughness={0.12} metalness={0.92} />
      </mesh>

      {/* Keyboard deck */}
      <mesh position={[0, 0.034, -0.05]}>
        <boxGeometry args={[1.55, 0.003, 0.88]} />
        <meshStandardMaterial color={p.DECK} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Key rows — 3 rows of 12 */}
      {([-0.23, -0.09, 0.06] as number[]).map((rz, ri) => (
        <group key={ri} position={[0, 0.037, rz]}>
          {Array.from({ length: 12 }).map((_, ki) => (
            <mesh key={ki} position={[-0.66 + ki * 0.12, 0, 0]}>
              <boxGeometry args={[0.090, 0.003, 0.072]} />
              <meshStandardMaterial color={p.KEYS} roughness={0.75} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Trackpad */}
      <mesh position={[0, 0.034, 0.3]}>
        <boxGeometry args={[0.44, 0.003, 0.32]} />
        <meshStandardMaterial color={p.PAD} roughness={0.18} metalness={0.65} />
      </mesh>

      {/* Hinge bar */}
      <mesh position={[0, 0.033, -0.61]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.5, 10]} />
        <meshStandardMaterial color="#6a6a6c" roughness={0.18} metalness={0.95} />
      </mesh>

      {/* ── SCREEN LID — pivots at back top edge ─────── */}
      <group position={[0, 0.033, -0.6]} rotation={[lidTilt, 0, 0]}>
        {/* Lid outer shell */}
        <mesh castShadow position={[0, 0.575, 0]}>
          <boxGeometry args={[1.8, 1.15, 0.054]} />
          <meshStandardMaterial color={ALU} roughness={0.12} metalness={0.92} />
        </mesh>

        {/* Bezel */}
        <mesh position={[0, 0.575, 0.029]}>
          <boxGeometry args={[1.76, 1.12, 0.004]} />
          <meshStandardMaterial color={p.BEZEL} roughness={0.85} />
        </mesh>

        {/* Screen panel */}
        <mesh position={[0, 0.575, 0.032]}>
          <boxGeometry args={[1.66, 1.05, 0.002]} />
          <meshStandardMaterial
            ref={scrMatRef}
            color={p.SCR}
            emissive={p.SCR}
            emissiveIntensity={resolvedTheme === "light" ? 0.05 : 0.22}
            roughness={0.0}
          />
        </mesh>

        {/* Code on screen */}
        <group position={[0, 0.575, 0.034]}>
          <CodeDisplay p={p} />
        </group>

        {/* Apple logo — back */}
        <group position={[0, 0.575, -0.028]}>
          <AppleLogo />
        </group>
      </group>

      {/* Screen glow light */}
      <pointLight
        position={[0, 0.85, 0.85]}
        color="#61afef"
        intensity={0.5}
        distance={2.8}
      />
    </group>
  );
}
