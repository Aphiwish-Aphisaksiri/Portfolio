"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/model.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Fix center point — model origin is at the back, not center of mass
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;
    // Smoothly lerp rotation toward mouse position
    groupRef.current.rotation.y +=
      (mouse.x * 0.5 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (-mouse.y * 0.2 - groupRef.current.rotation.x) * 0.05;
  });

  // Calculate scale based on viewport
  const scale = Math.min(viewport.width, viewport.height) * 0.35;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        <primitive object={scene} scale={scale} />
      </group>
    </Float>
  );
}

export default function ClayModelCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
