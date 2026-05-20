"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ArenaConfig } from "../types";

interface ArenaSceneProps {
  arena: ArenaConfig;
  crowdHype: number;
}

function Rain({ accent }: { accent: string }) {
  const count = 800;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= dt * 12;
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 8;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={accent} transparent opacity={0.6} />
    </points>
  );
}

function Crowd({ density, accent }: { density: number; accent: string }) {
  const count = Math.floor(120 * density);
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 7 + Math.random() * 2;
      arr.push([Math.sin(angle) * r, 1.2 + Math.random() * 2, Math.cos(angle) * r]);
    }
    return arr;
  }, [count]);

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? accent : "#222"}
            emissive={accent}
            emissiveIntensity={0.1 + Math.random() * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ArenaScene({ arena, crowdHype }: ArenaSceneProps) {
  return (
    <>
      <color attach="background" args={[arena.fogColor]} />
      <fog attach="fog" args={[arena.fogColor, 8, 28]} />
      <ambientLight intensity={arena.ambientIntensity} />
      <directionalLight
        position={[5, 12, 4]}
        intensity={arena.sunIntensity}
        color={arena.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight
        position={[-4, 6, -3]}
        intensity={0.8}
        color={arena.accentColor}
      />
      <pointLight position={[4, 5, 3]} intensity={0.6} color={arena.accentColor} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color={arena.floorColor}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Octagon ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4.2, 8]} />
        <meshStandardMaterial
          color={arena.accentColor}
          emissive={arena.accentColor}
          emissiveIntensity={0.4 + crowdHype * 0.3}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.7, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>

      {/* Cage / ropes for underground */}
      {arena.id === "underground" && (
        <group>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[
                Math.sin((i / 4) * Math.PI * 2) * 4,
                1.5,
                Math.cos((i / 4) * Math.PI * 2) * 4,
              ]}
            >
              <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Neon signs */}
      {(arena.weather === "neon-night" || arena.id === "neon-city") && (
        <>
          <mesh position={[-5, 3, -6]}>
            <boxGeometry args={[3, 0.4, 0.1]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[5, 2.5, -5]}>
            <boxGeometry args={[2.5, 0.4, 0.1]} />
            <meshStandardMaterial
              color="#00f2ff"
              emissive="#00f2ff"
              emissiveIntensity={2}
            />
          </mesh>
        </>
      )}

      <Crowd density={arena.crowdDensity} accent={arena.accentColor} />
      {(arena.weather === "rain" || arena.weather === "neon-night") && (
        <Rain accent={arena.accentColor} />
      )}
    </>
  );
}
