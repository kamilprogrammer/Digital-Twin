"use client";
import "./globals.css";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leva } from "leva";
import { HeatLayer } from "./(default)/Devices/HeatMap";
import { GLTFModels } from "./(default)/Models";
import Sidebar from "./(default)/sidebar/sidebar";
import router from "next/router";
import OutSidebar from "./(default)/sidebar/out-siderbar";

export default function Page() {
  const [showInterior, setShowInterior] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [streamValue, setStreamValue] = useState("in");
  const [heatMap, setHeatMap] = useState(false);

  return (
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
        <div className="w-[12vw] p-2">
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
          )}
        </div>
        <div className="flex-1">
          <div className="pointer-events-none top-1/2 right-[44vw] fixed text-white text-2xl z-50">
            +
          </div>
          <Canvas camera={{ position: [0, 75, 75] }} className="rounded-xl">
            <GLTFModels
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
  );
}
