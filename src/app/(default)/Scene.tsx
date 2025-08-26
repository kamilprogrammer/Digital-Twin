import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Html, Text } from "@react-three/drei";
import { Sky } from "@react-three/drei";
import { Float } from "@react-three/drei";
import Camera from "../Camera/Camera";
import DroneFollower from "../Camera/Drone";
import InteriorModel from "../Interior/Interior";
import { folder, useControls } from "leva";
import {
  GLTF,
  PointerLockControls as PointerLockControlsImpl,
} from "three-stdlib";
import { InfinitySpin } from "react-loader-spinner";
import { City } from "@/types";
import { useStore } from "@/store/useStore";

export default function Scene({
  lockEnabled,
  dubai,
  drone,
  showStream,
  setShowStream,
  setStreamValue,
  showInterior,
  heatMap,
  setHeatMap,
  setShowInterior,
  isTransitioning,
  setIsTransitioning,
}: {
  lockEnabled: boolean;
  dubai: GLTF;
  drone: GLTF;
  showStream: boolean;
  heatMap: boolean;
  setHeatMap: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStream: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamValue: React.Dispatch<React.SetStateAction<string>>;
  showInterior: boolean;
  setShowInterior: (showInterior: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (b: boolean) => void;
}) {
  const selectedCity = useStore((state) => state.selectedCity);

  const DubaiRef = useRef<THREE.Object3D | null>(null);
  //const DroneRef = useRef<THREE.Object3D | null>(null);
  const buttonRef = useRef<THREE.Mesh | null>(null);
  const lookingRef = useRef(false);
  const cameraRef = useRef<PointerLockControlsImpl>(null);
  const DroneRef = useRef<THREE.Object3D | null>(null);
  const [isLookingAtButton, setIsLookingAtButton] = useState(false);
  const InteriorRef = useRef<THREE.Object3D | null>(null);
  const { camera } = useThree();
  const setCameraPosition = useStore((state) => state.setCameraPosition);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const cameraPosition = useStore((state) => state.cameraPosition);

  function triggerEnterBuilding() {
    const targetPosition = new THREE.Vector3(1010, 10, 20);
    let t = 0;
    const from = camera.position.clone();
    const to = targetPosition.clone();

    const animate = () => {
      t += 0.01;
      camera.position.lerpVectors(from, to, t);
      const targetEuler = new THREE.Euler(0, Math.PI / 2, 0); // yaw: 90 degrees
      const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

      camera.quaternion.slerp(targetQuaternion, 0.1); // 0.1 is interpolation speed
      if (t < 1) requestAnimationFrame(animate);
      else {
        setIsTransitioning(true);
        setTimeout(() => setShowInterior(true), 1000); // Midway: switch content
        setTimeout(() => setIsTransitioning(false), 2000); // Finish transition
      }
    };

    animate();
  }

  useFrame(() => {
    if (!buttonRef.current) return;

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);

    const intersects = raycaster.intersectObjects([buttonRef.current], true);
    const isLooking = intersects.length > 0;

    setIsLookingAtButton(isLooking);
    lookingRef.current = isLooking;
  });

  /*useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && lookingRef.current && !showInterior) {
        triggerEnterBuilding();
        setShowInterior(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);*/

  const controls = useControls(
    "HeatMap - TopView",
    () => ({
      HeatMap: {
        value: heatMap,
        onChange: (value) => setHeatMap(value),
        render: () => showInterior,
      },
    }),
    [showInterior]
  );

  const { ShowDrone } = useControls(
    {
      Drone: folder({
        ShowDrone: {
          value: false,
          render: () => !showInterior,
        },
      }),
    },
    [showInterior]
  );

  function CameraController() {
    const camera = useThree((state) => state.camera);
    const { cameraTarget, cameraTargetRotation } = useStore();
    let t = 0;
    const from = camera.position.clone();
    console.log(cameraTarget);
    const to = cameraTarget.clone();

    const animate = () => {
      t += 0.01;
      camera.position.lerpVectors(from, to, t);
      const targetEuler = new THREE.Euler(0, Math.PI / 2, 0); // yaw: 90 degrees
      const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

      camera.quaternion.slerp(targetQuaternion, 0.1); // 0.1 is interpolation speed
      if (t < 1) requestAnimationFrame(animate);
      else {
        setTimeout(() => setShowInterior(true), 1000); // Midway: switch content
        setTimeout(() => setIsTransitioning(false), 2000); // Finish transition
      }
    };

    animate();

    return null;
  }

  return (
    <>
      {/* ---------- OUTSIDE (city + drone) ---------- */}
      {!showInterior && (
        <>
          {/* Dubai city */}
          <primitive object={dubai.scene} ref={DubaiRef} />

          {/* Building entry button */}
          <mesh position={[510, 100, 56]} ref={buttonRef}>
            <boxGeometry args={[1, 8, 24]} />
            <meshStandardMaterial visible={false} />
            <Html distanceFactor={100}>
              <Button
                variant="default"
                size="lg"
                className="justify-center items-center -ml-28 -mt-16"
              >
                {"🏢 Machine Sense IOT's Building"}
              </Button>
            </Html>
          </mesh>

          {/* “Press E” prompt (only when aiming and not during transition) */}
          {/*{isLookingAtButton && !isTransitioning && (
            <Html position={[510, 110, 56]} distanceFactor={100}>
              <Button variant="default" size="lg">
                Press <b>E</b> to enter
              </Button>
            </Html>
          )}*/}
          {isTransitioning && <CameraController />}

          {/* Labels */}
          <Text
            position={[0, 150, -550]}
            fontSize={90}
            color="black"
            font="/cairo.ttf"
            lineHeight={1.2}
          >
            {"Digital Twin \nVisualization"}
          </Text>
          <Text
            position={[-196, 46, -550]}
            fontSize={20}
            color="gray"
            font="/cairo.ttf"
            lineHeight={1.2}
          >
            {"Prod #1"}
          </Text>

          {/* Sky only for exterior */}
          <Sky
            distance={450000}
            sunPosition={[100, 40, 100]}
            turbidity={2}
            rayleigh={0.5}
            mieCoefficient={0.005}
            mieDirectionalG={0.7}
            inclination={0.47}
            azimuth={0.25}
          />
        </>
      )}
      {/* Drone */}

      {
        <Camera
          lockEnabled={lockEnabled}
          interior={showInterior}
          cameraRef={cameraRef}
          heatMap={heatMap}
        />
      }
      {ShowDrone && !showInterior && (
        <Float
          speed={1}
          floatIntensity={0.1}
          rotationIntensity={0}
          floatingRange={[0, 0.6]}
        >
          <DroneFollower gltf={drone} ref={DroneRef} />
        </Float>
      )}

      {/* Lights & controls shared by both scenes */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <directionalLight position={[-10, -10, -10]} intensity={2} />
      {/* Interior Model */}
      {showInterior && (
        <>
          <mesh
            position={InteriorRef.current?.position.clone().setY(130).setX(140)}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[250, 200]} />
            <meshBasicMaterial
              opacity={0.1}
              transparent
              color="#fff"
              depthTest={false}
              depthWrite={false}
            />
            <Text
              fontSize={100}
              lineHeight={1.2}
              anchorX="center"
              color={"black"}
              font="/cairo.ttf"
            >
              {selectedFloor}
            </Text>
          </mesh>
          <Suspense
            fallback={
              <Html>
                <InfinitySpin width="200" color="#FFFFFF" />
              </Html>
            }
          >
            <InteriorModel
              city={selectedCity}
              InteriorRef={InteriorRef}
              showInterior={showInterior}
              showStream={showStream}
              heatMap={heatMap}
              setHeatMap={setHeatMap}
              setShowStream={setShowStream}
              setStreamValue={setStreamValue}
              setShowInterior={setShowInterior}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
