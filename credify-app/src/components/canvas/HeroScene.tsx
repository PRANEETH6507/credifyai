"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense } from "react";
import ShieldTotem from "./ShieldTotem";

export default function HeroScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: false }}>
        <ambientLight intensity={0.5} />
        {/* Plasma colored directional lights to rim-light the shield */}
        <directionalLight position={[5, 5, 5]} intensity={2} color="#7B61FF" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#F0EFF4" />

        <Suspense fallback={null}>
          {/* ScrollControls allows internal components to react to the page scroll */}
          {/* pages=5 means the scroll area is 5x the screen height */}
          <ScrollControls pages={5} damping={0.1}>
            <ShieldTotem />
          </ScrollControls>
          
          {/* High-end post processing */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.3} 
              luminanceSmoothing={0.9} 
              intensity={1.2} 
            />
            <Noise opacity={0.03} blendFunction={BlendFunction.SCREEN} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
