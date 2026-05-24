"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { PointLight } from "three";
import LaptopModel from "./avatar/LaptopModel";
import FloatingBot from "./avatar/FloatingBot";

/* ── Static lights (directional key + rim) ─────────────── */
function StaticLights() {
  return (
    <>
      <ambientLight intensity={0.28} color="#ffe0c8" />
      {/* Key light — warm, from upper-left */}
      <directionalLight
        position={[-3, 5, 3]}
        intensity={1.6}
        color="#ffd8b0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Rim light — cold blue from behind */}
      <pointLight position={[0, 3, -4]} color="#60a5fa" intensity={0.7} distance={8} />
      {/* Under-light — subtle bounce */}
      <pointLight position={[0, -2, 1.5]} color="#8b5cf6" intensity={0.25} distance={5} />
    </>
  );
}

/*
 * DynamicFillLight — indigo accent light that shifts position with mouse.
 * Technique from david-hckh.com: mouse position drives parallax of scene elements.
 * Uses same normalization: clientX/width − 0.5 → −0.5..+0.5
 */
function DynamicFillLight() {
  const lightRef = useRef<PointLight>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x =  e.clientX / window.innerWidth  - 0.5;
      mouseRef.current.y =  e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;
    // Light drifts left/right and up/down with cursor — cinematic face lighting
    lightRef.current.position.x += (3.5 + mouseRef.current.x * 2.2 - lightRef.current.position.x) * 0.06;
    lightRef.current.position.y += (2.0 - mouseRef.current.y * 1.2 - lightRef.current.position.y) * 0.06;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[3.5, 2, 2.5]}
      color="#6366f1"
      intensity={1.8}
      distance={10}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.18, 10, 10]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export default function AvatarScene() {
  return (
    <div className="w-full h-full" style={{ minHeight: "500px" }}>
      <Canvas
        camera={{ position: [0, 0.55, 3.2], fov: 42 }}
        style={{ background: "transparent" }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <StaticLights />
        <DynamicFillLight />
        <Stars radius={35} depth={30} count={700} factor={2} fade speed={0.35} />

        <Suspense fallback={<LoadingFallback />}>
          <LaptopModel />
          <FloatingBot />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
