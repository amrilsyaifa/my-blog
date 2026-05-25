"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial } from "three";
import gsap from "gsap";

export default function FloatingBot() {
  const groupRef = useRef<Group>(null);
  const antennaLightRef = useRef<Mesh>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Floating up-down animation
    gsap.to(groupRef.current.position, {
      y: "+=0.18",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Antenna light pulse
    if (antennaLightRef.current && antennaLightRef.current.material instanceof MeshStandardMaterial) {
      gsap.to(antennaLightRef.current.material, {
        emissiveIntensity: 1.5,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Eye blink
    const blinkEyes = () => {
      [leftEyeRef, rightEyeRef].forEach((ref) => {
        if (!ref.current) return;
        gsap.to(ref.current.scale, {
          y: 0.1,
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          ease: "power2.in",
        });
      });
    };
    const interval = setInterval(blinkEyes, 2400 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Slow Y rotation
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[1.1, 0.18, 0.15]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.3, 0.32, 0.22]} />
        <meshStandardMaterial color="#1e2130" roughness={0.3} metalness={0.6} emissive="#6366f1" emissiveIntensity={0.08} />
      </mesh>

      {/* Body accent lines */}
      <mesh position={[0, 0, 0.115]}>
        <boxGeometry args={[0.22, 0.04, 0.005]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, -0.07, 0.115]}>
        <boxGeometry args={[0.16, 0.025, 0.005]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color="#1e2130" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.07, 0.32, 0.16]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.07, 0.32, 0.16]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.2} />
      </mesh>

      {/* Mouth — small smile */}
      <mesh position={[0, 0.22, 0.17]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.035, 0.007, 6, 10, Math.PI]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.6} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Antenna tip (pulsing light) */}
      <mesh ref={antennaLightRef} position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.0} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.025, 0.22, 6]} />
        <meshStandardMaterial color="#1e2130" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.03, 0.025, 0.22, 6]} />
        <meshStandardMaterial color="#1e2130" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* AI speech bubble */}
      <group position={[0.26, 0.48, 0.1]} rotation={[0, -0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.28, 0.14, 0.02]} />
          <meshStandardMaterial color="#1e2130" opacity={0.85} transparent emissive="#6366f1" emissiveIntensity={0.05} />
        </mesh>
        {/* "AI" text represented as colored lines */}
        <mesh position={[-0.05, 0.02, 0.015]}>
          <boxGeometry args={[0.05, 0.05, 0.005]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.05, 0.02, 0.015]}>
          <boxGeometry args={[0.035, 0.05, 0.005]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
        </mesh>
        {/* Bubble tail */}
        <mesh position={[-0.1, -0.09, 0]}>
          <boxGeometry args={[0.06, 0.05, 0.018]} />
          <meshStandardMaterial color="#1e2130" opacity={0.85} transparent />
        </mesh>
      </group>

      {/* Glow light from bot */}
      <pointLight color="#6366f1" intensity={0.4} distance={1.5} />
    </group>
  );
}
