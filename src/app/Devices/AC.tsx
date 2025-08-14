import { Html, PivotControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { AcType } from "../../types/AcType";
import { motion } from "framer-motion";
import Badge from "../Add-ons/Badge";
import { Switch } from "../../components/ui/switch";
import { useFrame } from "@react-three/fiber";
import { supabase } from "../../supabase-digital-twin";

type Props = {
  ac: AcType;
  ShowAC: boolean;
  isDeveloping: boolean;
  onUpdatePosition: (
    uniqueId: string,
    pos: { x: number; y: number; z: number },
    rot: { x: number; y: number; z: number } // Euler
  ) => void;
};

export default function AC({
  ac,
  ShowAC,
  isDeveloping,
  onUpdatePosition,
}: Props) {
  const objRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/AC.glb");
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(ac.mode === "ACTIVE" ? true : false);
  const [Loading, setLoading] = useState(false);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const opacity = 0.07 + Math.abs(Math.sin(t * 1.2)) * 0.16; // range ~0.15 to 0.4
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity;
    }
  });

  const Inactivate = async () => {
    setLoading(true);
    console.log(ac.id);

    if (ac.id) {
      const { data, error } = await supabase
        .from("Cameras")
        .update({ mode: "INACTIVE" })
        .eq("id", ac.id);
      if (error) {
        console.error(error);
      }
    }
    setActive(false);
    setLoading(false);
  };

  const Activate = async () => {
    setLoading(true);
    console.log(ac.id);
    if (ac.id) {
      const { data, error } = await supabase
        .from("Cameras")
        .update({ mode: "ACTIVE" })
        .eq("id", ac.id);
      if (error) {
        console.error(error);
      }
    }
    setActive(true);
    setLoading(false);
  };

  const previousPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const StaticPosition = useMemo(
    () => new THREE.Vector3(ac.position.x, ac.position.y, ac.position.z),
    []
  );

  const previousRotation = useRef<THREE.Euler>(new THREE.Euler());
  const StaticRotation = useMemo(
    () => new THREE.Euler(ac.rotation.x, ac.rotation.y, ac.rotation.z),
    []
  );

  return (
    ShowAC && (
      <PivotControls
        enabled={isDeveloping}
        anchor={[0, 0, 0]}
        scale={3}
        disableScaling
        onDragEnd={() => {
          if (!objRef.current) return;

          // read world transform
          const pos = new THREE.Vector3();
          const quat = new THREE.Quaternion();
          objRef.current.updateMatrixWorld();
          objRef.current.matrixWorld.decompose(pos, quat, new THREE.Vector3());

          const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ");

          // send FRESH plain objects to parent
          if (
            pos.x !== previousPosition.current.x ||
            pos.y !== previousPosition.current.y ||
            pos.z !== previousPosition.current.z ||
            euler.x !== previousRotation.current.x ||
            euler.y !== previousRotation.current.y ||
            euler.z !== previousRotation.current.z
          ) {
            onUpdatePosition(
              ac.uniqueId,
              { x: pos.x, y: pos.y, z: pos.z },
              { x: euler.x, y: euler.y, z: euler.z }
            );
            previousPosition.current.copy(pos);
            previousRotation.current.copy(euler);
          }
        }}
      >
        {/* this is the object PivotControls actually moves, so put the ref HERE */}
        <group
          ref={objRef}
          onPointerOver={() => {
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
          position={[StaticPosition.x, StaticPosition.y, StaticPosition.z]}
          rotation={[StaticRotation.x, StaticRotation.y, StaticRotation.z]}
        >
          {!isDeveloping && (
            <Badge
              active={active}
              position={[1.1, 0.5, 0]}
              scale={[0.75, 0.75]}
            />
          )}
          <primitive object={scene.clone()} scale={[0.8, 0.8, 0.8]} />
          {hovered && !isDeveloping && (
            <Html distanceFactor={60} position={[2, 0, 0]} center>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center backdrop-blur-sm shadow-xl rounded-xl p-4 text-xs text-gray-800 w-64 border border-gray-200"
              >
                <div className="bg-white/50 backdrop-blur-sm shadow-xl rounded-xl p-4 text-xs text-gray-800 w-64 border border-gray-200">
                  <h3 className="flex items-center justify-center font-cairo text-sm font-bold font-weight-bold mb-2 text-black">
                    {ac.title || "Camera #1"}
                  </h3>
                  <ul className="space-y-1">
                    {ac.mac && (
                      <li className="flex items-center justify-center space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 text-xs text-gray-800 border border-gray-200">
                        <span className="font-cairo font-normal">{ac.mac}</span>
                      </li>
                    )}
                    {ac.vendor && (
                      <li className="flex items-center justify-center space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 text-xs text-gray-800 border border-gray-200">
                        <span className="font-cairo font-normal">
                          {ac.vendor}
                        </span>
                      </li>
                    )}
                    {ac.model && (
                      <li className="flex items-center justify-center space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 text-xs text-gray-800 border border-gray-200">
                        <span className="font-cairo font-normal">
                          {ac.model}
                        </span>
                      </li>
                    )}

                    {ac.notes && (
                      <li className="flex items-center justify-center space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 text-xs text-gray-800 border border-gray-200">
                        <span className="font-cairo font-normal">
                          {ac.notes}
                        </span>
                      </li>
                    )}
                    {
                      <li className="flex items-center justify-center space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 text-xs text-gray-800 border border-gray-200">
                        <span className="font-cairo font-normal">
                          {active ? (
                            <div
                              className="h-2 w-2 rounded-full justify-center items-center mt-2 mr-1"
                              style={{
                                backgroundColor: "green",
                              }}
                            ></div>
                          ) : (
                            <div
                              className="h-2 w-2 rounded-full justify-center items-center mt-2 mr-1"
                              style={{
                                backgroundColor: "red",
                              }}
                            ></div>
                          )}
                        </span>

                        <span className="font-cairo font-normal">
                          {active ? "Active" : "Inactive"}
                        </span>
                      </li>
                    }

                    <li className="space-y-2 backdrop-blur-sm shadow-xl rounded-md p-2 border border-gray-200 bg-neutral-700">
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          className="w-9 pl-1 py-2 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-700"
                          checked={active}
                          disabled={Loading}
                          onCheckedChange={async (checked) => {
                            if (checked) {
                              await Activate();
                            } else {
                              await Inactivate();
                            }
                          }}
                        />
                        <span className="font-cairo font-normal text-white">
                          On/Off
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </Html>
          )}
        </group>
      </PivotControls>
    )
  );
}
