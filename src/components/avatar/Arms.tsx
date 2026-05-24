"use client";

import { useRef, useEffect } from "react";
import { Group } from "three";
import gsap from "gsap";
import { SKIN, SHIRT } from "./palette";

export default function Arms() {
  const lUpperRef = useRef<Group>(null);
  const rUpperRef = useRef<Group>(null);

  useEffect(() => {
    // ── Arm sway — subtle idle swing, different timing each side ──
    if (lUpperRef.current) {
      gsap.to(lUpperRef.current.rotation, {
        z: 0.28,   // swings slightly inward
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2,
      });
    }
    if (rUpperRef.current) {
      gsap.to(rUpperRef.current.rotation, {
        z: -0.28,
        duration: 3.6,  // slightly different → natural asymmetry
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    }
    const lRot = lUpperRef.current?.rotation;
    const rRot = rUpperRef.current?.rotation;
    return () => {
      gsap.killTweensOf([lRot, rRot]);
    };
  }, []);

  return (
    <>
      <SingleArm groupRef={lUpperRef} side="left"  />
      <SingleArm groupRef={rUpperRef} side="right" />
    </>
  );
}

/* ── One arm — mirrored left/right via sign multiplier ── */
interface SingleArmProps {
  groupRef: React.RefObject<Group | null>;
  side: "left" | "right";
}

function SingleArm({ groupRef, side }: SingleArmProps) {
  const s = side === "left" ? -1 : 1; // sign for x mirroring

  // Base rotations for natural hang
  const upperRot: [number, number, number] = [0.08, 0, s * 0.22];
  const foreRot:  [number, number, number] = [0.2,  0, s * 0.1];

  return (
    <>
      {/* Upper arm group (GSAP will animate its rotation.z) */}
      <group
        ref={groupRef}
        position={[s * 0.47, -0.2, 0.04]}
        rotation={upperRot}
      >
        {/* Upper arm capsule */}
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.28, 4, 10]} />
          <meshStandardMaterial color={SHIRT} roughness={0.72} metalness={0.03} />
        </mesh>
      </group>

      {/* Elbow joint sphere — smooth connection */}
      <mesh castShadow position={[s * 0.5, -0.44, 0.1]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.58} />
      </mesh>

      {/* Forearm capsule — slightly tapered */}
      <mesh castShadow position={[s * 0.48, -0.64, 0.13]} rotation={foreRot}>
        <capsuleGeometry args={[0.056, 0.26, 4, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.58} />
      </mesh>

      {/* Wrist sphere */}
      <mesh castShadow position={[s * 0.44, -0.86, 0.2]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* Hand */}
      <mesh castShadow position={[s * 0.42, -0.94, 0.22]}>
        <boxGeometry args={[0.1, 0.046, 0.082]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* Fingers — 4 cylinders per hand */}
      {([-0.035, -0.01, 0.015, 0.04] as number[]).map((dx, i) => (
        <mesh key={i} castShadow position={[s * (0.42 + dx * s), -0.93, 0.272]}>
          <cylinderGeometry args={[0.009, 0.008, 0.048, 6]} />
          <meshStandardMaterial color={SKIN} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
}
