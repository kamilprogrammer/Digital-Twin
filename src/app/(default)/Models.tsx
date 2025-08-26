"use client";
import { useGLTF } from "@react-three/drei";
import Scene from "./Scene";
import { Building, Floor, City } from "@/types";

export function GLTFModels({
  lockEnabled,
  city,
  heatMap,
  setHeatMap,
  showInterior,
  setShowInterior,
  isTransitioning,
  setIsTransitioning,
  showStream,
  setShowStream,
  setStreamValue,
}: {
  lockEnabled: boolean;
  city: City | null;
  heatMap: boolean;
  setHeatMap: React.Dispatch<React.SetStateAction<boolean>>;
  showInterior: boolean;
  setShowInterior: (showInterior: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (b: boolean) => void;
  showStream: boolean;
  setShowStream: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dubai = useGLTF(`/${city?.title}.glb`);
  const drone = useGLTF("/drone.glb");

  return (
    <Scene
      dubai={dubai}
      drone={drone}
      heatMap={heatMap}
      setHeatMap={setHeatMap}
      showInterior={showInterior}
      setShowInterior={setShowInterior}
      isTransitioning={isTransitioning}
      setIsTransitioning={setIsTransitioning}
      showStream={showStream}
      setShowStream={setShowStream}
      setStreamValue={setStreamValue}
      lockEnabled={lockEnabled}
    />
  );
}
