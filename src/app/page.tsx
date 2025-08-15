"use client";
import "./globals.css";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leva } from "leva";
//import { HeatLayer } from "./Devices/HeatMap";
import { GLTFModels } from "./(default)/Models";
import Sidebar from "./sidebar/sidebar";
import router from "next/router";
import OutSidebar from "./sidebar/out-siderbar";
import { supabase } from "@/supabase-digital-twin";
import { useEffect } from "react";
import { City, Floor, Building } from "@/types";
import CityDialog from "./sidebar/dialog";
import * as THREE from "three";
import CameraAnimator from "./Camera/CameraAnimator";
import { InfinitySpin } from "react-loader-spinner";
import { useStore } from "@/store/useStore";

export default function Page() {
  const [showInterior, setShowInterior] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [streamValue, setStreamValue] = useState("in");
  const [heatMap, setHeatMap] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [city, setCity] = useState<City | null>(null);

  const [camera, setCamera] = useState<THREE.Vector3>(new THREE.Vector3());
  const [lockEnabled, setLockEnabled] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const [overlay, setOverlay] = useState(true);

  const selectedBuilding = useStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useStore((state) => state.setSelectedBuilding);
  // Fetching Buildings from Supabase (Baas)
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!city) return;
      const { data, error } = await supabase
        .from("Buildings")
        .select("*")
        .eq("cityId", city.id);
      if (error) {
        console.error("Error fetching buildings:", error);
      } else {
        setBuildings(data);
        setSelectedBuilding(data[0]);
      }
    };
    fetchBuildings();
  }, [city]);

  // Fetching Floors from Supabase (Baas)
  useEffect(() => {
    if (!selectedBuilding) return;
    const fetchFloors = async () => {
      if (!city) return;
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
  }, [city, selectedBuilding]);

  useEffect(() => {
    if (cameraTarget) {
      setIsTransitioning(true);
    }
    setTimeout(() => {
      setIsTransitioning(false);
    }, 5000);
  }, [cameraTarget]);
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
    if (city) {
      const timer = setTimeout(() => setOverlay(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [city]);

  return (
    <>
      {city === null ? (
        <CityDialog city={city} setCity={setCity} />
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

          {/* Leva Debug Panel */}
          <div className="fixed top-0 right-0 z-50 pointer-events-auto">
            <Leva
              //hidden={showInterior}
              collapsed={true}
              theme={
                {
                  /*fontSizes: {
                  root: "16px", // default is 13px
                  toolTip: "12px",
                  },*/
                }
              }
            />
          </div>
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
                <Sidebar
                  city={city}
                  lockEnabled={lockEnabled}
                  setLockEnabled={setLockEnabled}
                  setShowInterior={setShowInterior}
                  floors={floors}
                  onNavigate={(path) => {
                    router.push(path);
                  }}
                  setCameraTarget={setCameraTarget}
                />
              ) : (
                <OutSidebar
                  camera={camera}
                  setShowInterior={setShowInterior}
                  city={city}
                  buildings={buildings}
                  onNavigate={(path) => {
                    router.push(path);
                  }}
                  setCameraTarget={setCameraTarget}
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
              <div className="pointer-events-none top-1/2 right-[44vw] fixed text-white text-2xl z-50">
                +
              </div>

              <Canvas
                camera={{ position: [0, 75, 75] }}
                className="rounded-xl pointer-events-auto"
              >
                {isTransitioning && (
                  <CameraAnimator
                    showInterior={showInterior}
                    targetPosition={cameraTarget || new THREE.Vector3()}
                    isTransitioning={isTransitioning}
                    onTransitionEnd={() => setIsTransitioning(false)}
                  />
                )}
                <GLTFModels
                  lockEnabled={lockEnabled}
                  city={city || null}
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
