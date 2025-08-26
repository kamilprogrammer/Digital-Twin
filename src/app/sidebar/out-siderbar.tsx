import { Building2, ArrowBigRightDash, Drone } from "lucide-react";
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
  const { setCameraTargetRotation, setCameraTarget, showDrone, setShowDrone } =
    useStore();
  return (
    <div className="fixed top-0 left-0 z-60 w-[12vw]">
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-[12vw] h-[98.2vh] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl m-2 mr-1">
          <h2 className="text-lg p-1 pb-0 pl-[0.45vw] font-semibold text-gray-900 dark:text-white">
            {city.title} City
          </h2>
          <h4 className="text-sm p-1 pb-4 pl-[0.5vw]  font-normal text-gray-400 dark:text-white">
            buildings :
          </h4>

          <ul className="space-y-2 font-normal text-xs">
            {buildings.map((building) => (
              <li
                key={building.id}
                className="justify-center items-center flex"
              >
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setCameraTarget(
                      new THREE.Vector3(
                        Number(building.pos_x),
                        Number(building.pos_y),
                        Number(building.pos_z)
                      )
                    );
                    setCameraTargetRotation(
                      new THREE.Euler(0, Math.PI * 3.4, 0)
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
                    setCameraTarget(new THREE.Vector3(1010, 10, 20));
                    setCameraTargetRotation(new THREE.Euler(0, Math.PI / 2, 0));
                    setTimeout(() => setShowInterior(true), 250);
                  }}
                >
                  <ArrowBigRightDash className="w-5 h-5 text-gray-500" />
                </button>
              </li>
            ))}
            <li className="justify-start items-start">
              <div className="ml-2 h-[0.2] w-[7vw] bg-black opacity-15"></div>
            </li>
            <li className="justify-center items-center">
              <button
                onClick={(e) => {
                  setShowDrone(!showDrone);
                }}
                className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <Drone className="w-5 h-5 text-gray-500" />
                <span className="ms-3">
                  {showDrone ? "Hide Drone" : "Show Drone"}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
