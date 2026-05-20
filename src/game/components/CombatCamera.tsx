"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFightStore } from "../store/fightStore";

export function CombatCamera() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3(0, 2.8, 7));

  useFrame((_, dt) => {
    const { p1, p2, cinematic } = useFightStore.getState();
    const midX = (p1.position[0] + p2.position[0]) / 2;
    const midZ = (p1.position[2] + p2.position[2]) / 2;
    target.current.set(midX, 1.35, midZ);

    const dist = Math.hypot(
      p1.position[0] - p2.position[0],
      p1.position[2] - p2.position[2]
    );
    const baseZ = 5.5 + dist * 0.35;
    const height = 2.2 + dist * 0.08;

    if (cinematic.cameraMode === "finisher") {
      desired.current.set(midX + 1.2, 1.6, midZ + 2.2);
    } else if (cinematic.cameraMode === "broadcast") {
      desired.current.set(midX, height + 2, midZ + baseZ + 2);
    } else {
      const shake = cinematic.shakeIntensity;
      desired.current.set(
        midX + (Math.random() - 0.5) * shake * 0.3,
        height + (Math.random() - 0.5) * shake * 0.15,
        midZ + baseZ + (Math.random() - 0.5) * shake * 0.2
      );
    }

    const lerp = 1 - Math.pow(0.001, dt);
    camera.position.lerp(desired.current, lerp);
    camera.lookAt(target.current);
  });

  return null;
}
