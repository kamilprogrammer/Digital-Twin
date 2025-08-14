import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraAnimator({
  showInterior,
  targetPosition,
  isTransitioning,
  onTransitionEnd,
}: {
  showInterior: boolean;
  targetPosition: THREE.Vector3;
  isTransitioning: boolean;
  onTransitionEnd: () => void;
}) {
  const { camera } = useThree();
  const lerpTarget = useRef(targetPosition);

  // Update lerpTarget ref when targetPosition changes
  useEffect(() => {
    lerpTarget.current = targetPosition;
  }, [targetPosition]);

  useFrame(() => {
    if (isTransitioning && lerpTarget.current && !showInterior) {
      camera.position.lerp(lerpTarget.current, 0.1);
      camera.lookAt(lerpTarget.current);

      if (camera.position.distanceTo(lerpTarget.current) < 0.1) {
        onTransitionEnd();
      }
    }
  });

  return null;
}
