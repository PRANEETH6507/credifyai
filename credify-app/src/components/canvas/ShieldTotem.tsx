"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";

export default function ShieldTotem() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollData = useScroll();

  useFrame((state) => {
    if (groupRef.current && meshRef.current) {
      const scrollY = scrollData.offset;
      const isMobile = state.viewport.width < 6;
      const baseScale = isMobile ? 0.65 : 1.0;
      const scale = (1 - scrollY * 0.3) * baseScale;
      groupRef.current.scale.set(scale, scale, scale);

      // Idle breathing/floating + responsive offset
      groupRef.current.position.y = (Math.sin(state.clock.elapsedTime * 0.5) * 0.2) + (isMobile ? -0.8 : 0);
      
      // Scroll-driven rotation (scrollData.offset goes from 0 to 1)
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + scrollY * Math.PI * 4;
      meshRef.current.rotation.x = scrollY * Math.PI;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Crystalline Shield Geometry (Octahedron looks like a faceted gem/shield) */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial 
          color="#0A0A14"
          emissive="#7B61FF"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          wireframe={false}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner Glowing Core */}
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#7B61FF" wireframe={true} transparent={true} opacity={0.3} />
      </mesh>
    </group>
  );
}
