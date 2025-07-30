"use client";
import "./globals.css";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leva } from "leva";
import { HeatLayer } from "./(default)/Devices/HeatMap";
import { GLTFModels } from "./(default)/Models";
import Sidebar from "./(default)/sidebar/sidebar";
import router from "next/router";
import OutSidebar from "./(default)/sidebar/out-siderbar";
import { supabase } from "@/supabase-digital-twin";
import { useEffect } from "react";
import { City, Floor, Building } from "@/types";
import CityDialog from "./(default)/sidebar/dialog";
import * as THREE from "three";
import { useRef } from "react";
import CameraAnimator from "./(default)/Camera/CameraAnimator";

export default function Page() {
  const [showInterior, setShowInterior] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [streamValue, setStreamValue] = useState("in");
  const [heatMap, setHeatMap] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City | null>(null);

  const [camera, setCamera] = useState<THREE.Vector3>(new THREE.Vector3());
  const [lockEnabled, setLockEnabled] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);

  // Fetching Data from Supabase (Baas)
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
      }
    };
    fetchBuildings();
  }, [city]);

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

  return (
    <>
      {city === null ? (
        <CityDialog city={city} setCity={setCity} />
      ) : (
        <>
          {/* Leva Debug Panel */}
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
                  showInterior={showInterior}
                  setShowInterior={setShowInterior}
                  building="Building 1"
                  floors={[
                    "Floor 1",
                    "Floor 2",
                    "Floor 3",
                    "Floor 4",
                    "Floor 5",
                    "Floor 6",
                  ]}
                  onNavigate={(path) => {
                    router.push(path);
                  }}
                />
              ) : (
                <OutSidebar
                  lockEnabled={lockEnabled}
                  setLockEnabled={setLockEnabled}
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
                    targetPosition={cameraTarget || new THREE.Vector3()}
                    isTransitioning={isTransitioning}
                    onTransitionEnd={() => setIsTransitioning(false)}
                  />
                )}
                <GLTFModels
                  lockEnabled={lockEnabled}
                  city={city?.title || null}
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
          <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none z-10">
            {heatMap && <HeatLayer />}
          </div>
        </>
      )}
    </>
  );
}
