"use client";

import { useRef } from "react";
import { Mesh } from "three";

export default function Desk() {
  const screenRef = useRef<Mesh>(null);

  return (
    <group position={[0, -1.2, 0]}>
      {/* Desk surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.4]} />
        <meshStandardMaterial color="#1c1c2e" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Desk legs */}
      {[[-1.4, -0.5, 0.5], [1.4, -0.5, 0.5], [-1.4, -0.5, -0.5], [1.4, -0.5, -0.5]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.08, 1.0, 0.08]} />
            <meshStandardMaterial color="#111120" roughness={0.6} />
          </mesh>
        )
      )}

      {/* Laptop base */}
      <mesh position={[0, 0.07, 0.1]}>
        <boxGeometry args={[1.2, 0.06, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Laptop screen (open, tilted back ~110deg) */}
      <group position={[0, 0.1, -0.3]} rotation={[-Math.PI * 0.3, 0, 0]}>
        {/* Screen frame */}
        <mesh>
          <boxGeometry args={[1.2, 0.75, 0.04]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Screen display */}
        <mesh ref={screenRef} position={[0, 0, 0.021]}>
          <boxGeometry args={[1.1, 0.65, 0.01]} />
          <meshStandardMaterial
            color="#0f1117"
            emissive="#6366f1"
            emissiveIntensity={0.3}
            roughness={0.1}
          />
        </mesh>
        {/* Code lines on screen */}
        {[-0.22, -0.1, 0.02, 0.14, 0.26].map((y, i) => (
          <mesh key={i} position={[-0.15 + (i % 2) * 0.1, y, 0.027]}>
            <boxGeometry args={[0.5 + (i % 3) * 0.15, 0.025, 0.001]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#6366f1" : "#4ade80"}
              emissive={i % 3 === 0 ? "#8b5cf6" : "#6366f1"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        {/* Screen glow light */}
        <pointLight color="#6366f1" intensity={0.8} distance={2} position={[0, 0, 0.5]} />
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.07, 0.35]}>
        <boxGeometry args={[1.0, 0.03, 0.35]} />
        <meshStandardMaterial color="#16162a" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Coffee mug */}
      <group position={[1.1, 0.12, 0]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.08, 0.22, 12]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.06, 12]} />
          <meshStandardMaterial color="#6b4c2a" roughness={0.8} emissive="#3b1f0a" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}
