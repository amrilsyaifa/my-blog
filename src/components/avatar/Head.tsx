"use client";

import { forwardRef } from "react";
import { Group } from "three";
import Eyes from "./Eyes";
import { SKIN, DEEP, HAIR, GLASS, BEARD } from "./palette";

// Accepts a ref so AvatarRig can drive head-tracking in useFrame
const Head = forwardRef<Group>((_, ref) => {
  return (
    <group ref={ref} position={[0, 0.52, 0]}>
      <FaceStructure />
      <Hair />
      <Ears />
      <Brows />
      <Eyes />
      <Nose />
      <Mouth />
      <Goatee />
      <Glasses />
    </group>
  );
});
Head.displayName = "Head";
export default Head;

/* ── Face base ─────────────────────────────────────────── */
function FaceStructure() {
  return (
    <>
      {/* Main cranium — slightly oval (taller than wide) */}
      <mesh castShadow scale={[1, 1.04, 0.95]}>
        <sphereGeometry args={[0.228, 28, 22]} />
        <meshStandardMaterial color={SKIN} roughness={0.52} metalness={0.0} />
      </mesh>

      {/* Chin — narrows downward */}
      <mesh castShadow position={[0, -0.18, 0.024]} scale={[0.74, 0.44, 0.72]}>
        <sphereGeometry args={[0.19, 14, 14]} />
        <meshStandardMaterial color={SKIN} roughness={0.52} />
      </mesh>

      {/* Cheekbone fill — L */}
      <mesh castShadow position={[-0.17, -0.01, 0.12]} scale={[0.52, 0.46, 0.4]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>
      {/* Cheekbone fill — R */}
      <mesh castShadow position={[0.17, -0.01, 0.12]} scale={[0.52, 0.46, 0.4]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>
    </>
  );
}

/* ── Hair — side-swept left-part ──────────────────────── */
function Hair() {
  return (
    <>
      {/* Top cap hemisphere */}
      <mesh position={[0.02, 0.138, -0.01]}>
        <sphereGeometry args={[0.222, 20, 18, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={HAIR} roughness={0.88} />
      </mesh>
      {/* Right side — main swept bulk */}
      <mesh position={[0.152, 0.1, 0.022]} scale={[1.0, 0.7, 0.86]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={HAIR} roughness={0.88} />
      </mesh>
      {/* Left side — thinner undercut */}
      <mesh position={[-0.172, 0.055, -0.01]} scale={[0.62, 0.52, 0.7]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={HAIR} roughness={0.88} />
      </mesh>
      {/* Back */}
      <mesh position={[0.01, 0.05, -0.2]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial color={HAIR} roughness={0.88} />
      </mesh>
      {/* Front fringe — swept right */}
      <mesh position={[0.075, 0.244, 0.168]} scale={[1.1, 0.36, 0.54]}>
        <sphereGeometry args={[0.095, 8, 8]} />
        <meshStandardMaterial color={HAIR} roughness={0.88} />
      </mesh>
    </>
  );
}

/* ── Ears ──────────────────────────────────────────────── */
function Ears() {
  return (
    <>
      <mesh castShadow position={[-0.248, 0.01, 0]} scale={[0.38, 0.66, 0.38]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0.248, 0.01, 0]} scale={[0.38, 0.66, 0.38]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} />
      </mesh>
    </>
  );
}

/* ── Eyebrows ──────────────────────────────────────────── */
function Brows() {
  return (
    <>
      <mesh position={[-0.091, 0.09, 0.22]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.072, 0.013, 0.008]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      <mesh position={[0.091, 0.09, 0.22]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.072, 0.013, 0.008]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
    </>
  );
}

/* ── Nose ──────────────────────────────────────────────── */
function Nose() {
  return (
    <>
      {/* Bridge */}
      <mesh castShadow position={[0, -0.008, 0.242]}>
        <sphereGeometry args={[0.024, 10, 10]} />
        <meshStandardMaterial color={DEEP} roughness={0.65} />
      </mesh>
      {/* Tip */}
      <mesh castShadow position={[0, -0.026, 0.25]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshStandardMaterial color={DEEP} roughness={0.65} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[-0.019, -0.038, 0.242]}>
        <sphereGeometry args={[0.013, 6, 6]} />
        <meshStandardMaterial color={DEEP} roughness={0.72} />
      </mesh>
      <mesh position={[0.019, -0.038, 0.242]}>
        <sphereGeometry args={[0.013, 6, 6]} />
        <meshStandardMaterial color={DEEP} roughness={0.72} />
      </mesh>
    </>
  );
}

/* ── Mouth ─────────────────────────────────────────────── */
function Mouth() {
  return (
    <>
      {/* Smile arc */}
      <mesh position={[0, -0.094, 0.238]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.034, 0.0072, 6, 14, Math.PI]} />
        <meshStandardMaterial color="#8a4330" roughness={0.85} />
      </mesh>
      {/* Upper lip */}
      <mesh position={[0, -0.08, 0.241]}>
        <boxGeometry args={[0.062, 0.012, 0.006]} />
        <meshStandardMaterial color={DEEP} roughness={0.78} />
      </mesh>
      {/* Lower lip — slightly fuller */}
      <mesh position={[0, -0.101, 0.242]}>
        <boxGeometry args={[0.056, 0.014, 0.007]} />
        <meshStandardMaterial color={DEEP} roughness={0.75} />
      </mesh>
    </>
  );
}

/* ── Goatee — chin only ────────────────────────────────── */
function Goatee() {
  return (
    <>
      {/* Soul patch */}
      <mesh position={[0, -0.13, 0.238]}>
        <boxGeometry args={[0.033, 0.023, 0.006]} />
        <meshStandardMaterial color={BEARD} roughness={0.9} />
      </mesh>
      {/* Main chin patch */}
      <mesh position={[0, -0.186, 0.212]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color={BEARD} roughness={0.9} />
      </mesh>
      {/* Lower extension */}
      <mesh position={[0, -0.215, 0.19]}>
        <sphereGeometry args={[0.036, 8, 8]} />
        <meshStandardMaterial color={BEARD} roughness={0.9} />
      </mesh>
    </>
  );
}

/* ── Glasses ───────────────────────────────────────────── */
function Glasses() {
  const frameMat = (
    <meshStandardMaterial color={GLASS} metalness={0.75} roughness={0.18} />
  );
  return (
    <>
      {/* Left frame ring */}
      <mesh position={[-0.091, 0.025, 0.248]}>
        <torusGeometry args={[0.048, 0.0078, 8, 22]} />
        {frameMat}
      </mesh>
      {/* Right frame ring */}
      <mesh position={[0.091, 0.025, 0.248]}>
        <torusGeometry args={[0.048, 0.0078, 8, 22]} />
        {frameMat}
      </mesh>
      {/* Nose bridge */}
      <mesh position={[0, 0.025, 0.25]}>
        <boxGeometry args={[0.07, 0.006, 0.005]} />
        {frameMat}
      </mesh>
      {/* Left temple */}
      <mesh position={[-0.222, 0.025, 0.192]} rotation={[0, 0.42, 0]}>
        <boxGeometry args={[0.105, 0.005, 0.005]} />
        {frameMat}
      </mesh>
      {/* Right temple */}
      <mesh position={[0.222, 0.025, 0.192]} rotation={[0, -0.42, 0]}>
        <boxGeometry args={[0.105, 0.005, 0.005]} />
        {frameMat}
      </mesh>
      {/* Lenses — subtle blue tint, mostly transparent */}
      <mesh position={[-0.091, 0.025, 0.246]}>
        <circleGeometry args={[0.04, 22]} />
        <meshStandardMaterial
          color="#c0d8ff"
          transparent
          opacity={0.13}
          roughness={0}
        />
      </mesh>
      <mesh position={[0.091, 0.025, 0.246]}>
        <circleGeometry args={[0.04, 22]} />
        <meshStandardMaterial
          color="#c0d8ff"
          transparent
          opacity={0.13}
          roughness={0}
        />
      </mesh>
    </>
  );
}
