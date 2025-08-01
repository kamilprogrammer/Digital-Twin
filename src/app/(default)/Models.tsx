"use client";
import { useGLTF } from "@react-three/drei";
import Scene from "./Scene";
import { Building, Floor, City } from "@/types";

export function GLTFModels({
  selectedBuilding,
  selectedFloor,
  setSelectedFloor,
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
  selectedBuilding: Building | null;
  selectedFloor: Floor | null;
  setSelectedFloor: React.Dispatch<React.SetStateAction<Floor | null>>;
  lockEnabled: boolean;
  city: City | null;
  heatMap: boolean;
  setHeatMap: React.Dispatch<React.SetStateAction<boolean>>;
  showInterior: boolean;
  setShowInterior: React.Dispatch<React.SetStateAction<boolean>>;
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
      city={city || null}
      selectedBuilding={selectedBuilding}
      selectedFloor={selectedFloor}
      setSelectedFloor={setSelectedFloor}
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
