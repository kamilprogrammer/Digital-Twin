import { useEffect, useState } from "react";
import { Building2, ArrowBigRightDash } from "lucide-react";
import { Building } from "@/types/Building";
import { City } from "@/types/City";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
interface SidebarProps {
  setShowInterior: (showInterior: boolean) => void;
  setSelectedBuilding: (building: Building | null) => void;
  city: City;
  buildings: Building[];
}

export default function OutSidebar({
  setShowInterior,
  setSelectedBuilding,
  buildings,
  city,
}: SidebarProps) {
  const { setCameraTargetRotation, setCameraTarget, setIsTransitioning } =
    useStore();
  return (
    <div className="fixed top-0 left-0 z-60 w-[12vw]">
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-[12vw] h-[98.2vh] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl m-2 mr-1">
          <h2 className="text-lg p-1 pb-0 pl-2 font-semibold text-gray-900 dark:text-white">
            {city.title} City
          </h2>
          <h4 className="text-sm p-1 pb-4 pl-2 font-normal text-gray-400 dark:text-white">
            buildings :
          </h4>

          <ul className="space-y-2 font-normal text-xs">
            {buildings.map((building) => (
              <li
                key={building.id}
                className="justify-center items-center flex"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBuilding(building);
                    setCameraTarget(
                      new THREE.Vector3(
                        Number(building.pos_x),
                        Number(building.pos_y),
                        Number(building.pos_z)
                      )
                    );
                  }}
                  className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 mr-1 bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span className="ms-3">{building.title}</span>
                </button>
                <button
                  className="ml-auto items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setSelectedBuilding(building);
                    setIsTransitioning(true);
                    setCameraTarget(new THREE.Vector3(1010, 10, 20));
                    setCameraTargetRotation(new THREE.Euler(0, Math.PI / 2, 0));
                    setTimeout(() => setIsTransitioning(false), 2000);
                  }}
                >
                  <ArrowBigRightDash className="w-5 h-5 text-gray-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
