"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFightStore } from "../store/fightStore";

function ImpactBurst({
  x,
  y,
  z,
  intensity,
}: {
  x: number;
  y: number;
  z: number;
  intensity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const life = useRef(1);

  useFrame((_, dt) => {
    if (!ref.current) return;
    life.current -= dt * 3;
    const s = 1 + (1 - life.current) * 2 * intensity;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
      0,
      life.current
    );
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshBasicMaterial color="#ff2200" transparent opacity={0.8} />
    </mesh>
  );
}

export function ImpactEffects() {
  const events = useFightStore((s) => s.impactEvents);
  return (
    <>
      {events.map((e) => (
        <ImpactBurst
          key={e.id}
          x={e.x}
          y={e.y}
          z={e.z}
          intensity={e.intensity}
        />
      ))}
    </>
  );
}
