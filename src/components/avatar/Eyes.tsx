"use client";

import { useRef, useEffect } from "react";
import { Mesh } from "three";
import gsap from "gsap";
import { SKIN, SCLERA, IRIS } from "./palette";

// Both eyes blink in sync via shared refs
export default function Eyes() {
  const lidL = useRef<Mesh>(null);
  const lidR = useRef<Mesh>(null);

  useEffect(() => {
    // Recursive blink scheduler — random interval, never perfectly loops
    const scheduleBlink = () => {
      if (!lidL.current || !lidR.current) return;
      const interval = 2400 + Math.random() * 3200;
      gsap.timeline({ delay: interval / 1000, onComplete: scheduleBlink })
        .to([lidL.current.scale, lidR.current.scale], {
          y: 15, duration: 0.068, ease: "power3.in",
        })
        .to([lidL.current.scale, lidR.current.scale], {
          y: 1, duration: 0.11, ease: "power2.out",
        });
    };

    const seed = setTimeout(scheduleBlink, 800 + Math.random() * 1600);
    const scaleL = lidL.current?.scale;
    const scaleR = lidR.current?.scale;
    return () => {
      clearTimeout(seed);
      gsap.killTweensOf([scaleL, scaleR]);
    };
  }, []);

  return (
    // positioned relative to head group center
    <group position={[0, 0.025, 0.218]}>
      <SingleEye x={-0.091} lidRef={lidL} />
      <SingleEye x={0.091}  lidRef={lidR} />
    </group>
  );
}

interface SingleEyeProps {
  x: number;
  lidRef: React.RefObject<Mesh | null>;
}

function SingleEye({ x, lidRef }: SingleEyeProps) {
  return (
    <group position={[x, 0, 0]}>
      {/* Sclera */}
      <mesh castShadow>
        <sphereGeometry args={[0.037, 14, 14]} />
        <meshStandardMaterial color={SCLERA} roughness={0.04} metalness={0.02} />
      </mesh>

      {/* Iris / dark pupil */}
      <mesh position={[0, 0, 0.027]}>
        <sphereGeometry args={[0.021, 10, 10]} />
        <meshStandardMaterial color={IRIS} roughness={0.05} />
      </mesh>

      {/* Specular catchlight — gives the eye life */}
      <mesh position={[x > 0 ? 0.009 : -0.009, 0.013, 0.035]}>
        <sphereGeometry args={[0.007, 6, 6]} />
        <meshStandardMaterial
          color="white"
          roughness={0}
          emissive="white"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Upper eyelid — thin strip that scales Y to cover eye on blink */}
      <mesh ref={lidRef} position={[0, 0.001, 0.04]}>
        <boxGeometry args={[0.066, 0.005, 0.009]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>

      {/* Subtle lower lid shadow */}
      <mesh position={[0, -0.028, 0.033]}>
        <boxGeometry args={[0.056, 0.007, 0.007]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>
    </group>
  );
}
