"use client";

import { forwardRef, useRef, useEffect } from "react";
import { Group, Mesh } from "three";
import gsap from "gsap";
import { SKIN, SHIRT } from "./palette";

// Exports group ref so AvatarRig can attach it as the breath origin
const Body = forwardRef<Group>((_, ref) => {
  const torsoRef   = useRef<Mesh>(null);
  const lShldrRef  = useRef<Mesh>(null);
  const rShldrRef  = useRef<Mesh>(null);

  useEffect(() => {
    // ── Breathing — torso chest expansion ──────────────
    if (torsoRef.current) {
      gsap.to(torsoRef.current.scale, {
        x: 1.022, y: 1.018, z: 1.025,
        duration: 2.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // ── Shoulder rise — asymmetric timing for realism ──
    if (lShldrRef.current) {
      gsap.to(lShldrRef.current.position, {
        y: "+=0.009",
        duration: 2.85,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (rShldrRef.current) {
      gsap.to(rShldrRef.current.position, {
        y: "+=0.009",
        duration: 3.05, // slightly different = asymmetric breath
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.18,
      });
    }

    const torsoScale   = torsoRef.current?.scale;
    const lPos = lShldrRef.current?.position;
    const rPos = rShldrRef.current?.position;
    return () => {
      gsap.killTweensOf([torsoScale, lPos, rPos]);
    };
  }, []);

  return (
    <group ref={ref}>
      {/* ── Torso — capsule for organic rounded shape ── */}
      <mesh ref={torsoRef} castShadow position={[0, -0.38, 0]}>
        <capsuleGeometry args={[0.235, 0.42, 6, 18]} />
        <meshStandardMaterial color={SHIRT} roughness={0.72} metalness={0.04} />
      </mesh>

      {/* Shirt collar */}
      <mesh position={[0, 0.065, 0.165]}>
        <boxGeometry args={[0.22, 0.076, 0.01]} />
        <meshStandardMaterial color="#0d1e3a" roughness={0.85} />
      </mesh>

      {/* ── Neck ─────────────────────────────────────── */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.086, 0.098, 0.18, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.54} />
      </mesh>

      {/* ── Shoulder rounds — smooth the torso-arm joint */}
      <mesh ref={lShldrRef} castShadow position={[-0.36, 0.06, 0]}>
        <sphereGeometry args={[0.155, 12, 12]} />
        <meshStandardMaterial color={SHIRT} roughness={0.72} />
      </mesh>
      <mesh ref={rShldrRef} castShadow position={[0.36, 0.06, 0]}>
        <sphereGeometry args={[0.155, 12, 12]} />
        <meshStandardMaterial color={SHIRT} roughness={0.72} />
      </mesh>
    </group>
  );
});
Body.displayName = "Body";
export default Body;
