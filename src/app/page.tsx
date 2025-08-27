"use client";
import "./globals.css";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
//import { HeatLayer } from "./Devices/HeatMap";
import { GLTFModels } from "./(default)/Models";
import Sidebar from "./sidebar/sidebar";
import OutSidebar from "./sidebar/out-siderbar";
import { supabase } from "@/supabase-digital-twin";
import { useEffect } from "react";
import { Floor, Building } from "@/types";
import CityDialog from "./sidebar/dialog";
import { InfinitySpin } from "react-loader-spinner";
import { useStore } from "@/store/useStore";

export default function Page() {
  const showInterior = useStore((state) => state.InteriorMode);
  const setShowInterior = useStore((state) => state.setInteriorMode);

  const isTransitioning = useStore((state) => state.isTransitioning);
  const setIsTransitioning = useStore((state) => state.setIsTransitioning);

  const [showStream, setShowStream] = useState(false);
  const [streamValue, setStreamValue] = useState("in");
  const [heatMap, setHeatMap] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  // Using selectedCity from store instead of local city state

  const [lockEnabled, setLockEnabled] = useState(false);
  const [overlay, setOverlay] = useState(true);

  const selectedBuilding = useStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useStore((state) => state.setSelectedBuilding);

  const selectedCity = useStore((state) => state.selectedCity);
  const setSelectedCity = useStore((state) => state.setSelectedCity);

  // Fetching Buildings from Supabase (Baas)
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!selectedCity) return;
      const { data, error } = await supabase
        .from("Buildings")
        .select("*")
        .eq("cityId", selectedCity.id);
      if (error) {
        console.error("Error fetching buildings:", error);
      } else {
        setBuildings(data);
      }
    };
    fetchBuildings();
  }, [selectedCity]);

  // Fetching Floors from Supabase (Baas)
  useEffect(() => {
    if (!selectedBuilding) return;
    const fetchFloors = async () => {
      if (!selectedCity) return;
      const { data, error } = await supabase
        .from("Floors")
        .select("*")
        .eq("buildingId", selectedBuilding?.id)
        .order("floorIndex", { ascending: false });
      if (error) {
        console.error("Error fetching floors:", error);
      } else {
        setFloors(data);
      }
    };
    fetchFloors();
  }, [selectedCity, selectedBuilding]);

  useEffect(() => {
    function onPointerLockChange() {
      const isLocked = document.pointerLockElement !== null;
      setLockEnabled(isLocked);
    }

    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, []);
  useEffect(() => {
    if (selectedCity) {
      const timer = setTimeout(() => setOverlay(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [selectedCity]);

  return (
    <>
      {!selectedCity ? (
        <CityDialog city={selectedCity} setCity={setSelectedCity} />
      ) : (
        <>
          {overlay && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-400 bg-opacity-10">
              <div className="text-white text-xl flex flex-col items-center">
                <InfinitySpin width="200" color="#FFFFFF" />
                <div>Loading 3D Models 🏢...</div>
              </div>
            </div>
          )}

          {showStream && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-1/2 ${
                streamValue === "out" || streamValue === "door"
                  ? "left-1/2 -translate-x-1/2"
                  : "left-[1400px]"
              } z-50 w-[60vw] max-w-[60vw]  -translate-y-1/2 rounded-xl bg-black p-4 shadow-xl`}
            >
              <video
                src={
                  streamValue === "out"
                    ? "/stream/out.mp4"
                    : streamValue === "door"
                    ? "/stream/door.mp4"
                    : "/stream/in.mp4"
                }
                controls
                autoPlay
                muted
                loop
                className="w-full h-auto rounded-xl"
              />
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setShowStream(false)}
                  variant={"destructive"}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
          {/*{isTransiti  oning && (
        <>
          <div className="fixed top-0 left-0 h-full w-1/2 z-50 bg-blue-200 animate-slideInLeft" />
          <div className="fixed top-0 right-0 h-full w-1/2 z-50 bg-blue-200 animate-slideInRight" />
        </>
      )}*/}

          <div className="flex fixed h-screen w-screen p-2 bg-gray-400 overflow-x-hidden overflow-y-hidden top-0 left-0">
            <div className="w-[12vw] p-2 pointer-events-auto">
              {showInterior ? (
                <Sidebar floors={floors} />
              ) : (
                <OutSidebar
                  setShowInterior={setShowInterior}
                  setSelectedBuilding={setSelectedBuilding}
                  city={selectedCity}
                  buildings={buildings}
                />
              )}
            </div>
            <div
              className="flex-1 pointer-events-auto z-20"
              onClick={() => {
                if (!lockEnabled) {
                  setLockEnabled(true); // triggers pointer lock on next render
                }
              }}
            >
              <div className="pointer-events-none flex items-center justify-center absolute right-[44vw] top-[48vh] text-white text-2xl z-50">
                +
              </div>

              <Canvas
                camera={{ position: [0, 75, 75] }}
                className="rounded-xl pointer-events-auto"
              >
                {/*{isTransitioning && (
                  <CameraAnimator
                    showInterior={showInterior}
                    targetPosition={cameraTarget || new THREE.Vector3()}
                    isTransitioning={isTransitioning}
                    onTransitionEnd={() => setIsTransitioning(false)}
                  />
                )}*/}
                <GLTFModels
                  lockEnabled={lockEnabled}
                  city={selectedCity || null}
                  heatMap={heatMap}
                  setHeatMap={setHeatMap}
                  showInterior={showInterior}
                  setShowInterior={setShowInterior}
                  isTransitioning={isTransitioning}
                  setIsTransitioning={setIsTransitioning}
                  showStream={showStream}
                  setShowStream={setShowStream}
                  setStreamValue={setStreamValue}
                />
              </Canvas>
            </div>
          </div>
          {/*<div className="absolute top-0 left-0 w-screen h-screen pointer-events-none z-10">
            {heatMap && <HeatLayer />}
          </div>*/}
        </>
      )}
    </>
  );
}
