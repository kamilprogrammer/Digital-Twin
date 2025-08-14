import { Plus, Layers2 } from "lucide-react";
import * as THREE from "three";
import { Floor, Building, City } from "@/types";
interface SidebarProps {
  setCameraTarget: React.Dispatch<React.SetStateAction<THREE.Vector3 | null>>;
  lockEnabled: boolean;
  setLockEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  city: City;
  building: Building;
  floors: Floor[];
  camera: THREE.Vector3;
  onNavigate?: (path: string) => void;
  setShowInterior?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFloor: React.Dispatch<React.SetStateAction<Floor | null>>;
}

export default function Sidebar({
  setCameraTarget,
  lockEnabled,
  setLockEnabled,
  floors,
  building,
  city,
  camera,
  setShowInterior,
  setSelectedFloor,
}: SidebarProps) {
  return (
    <div className="fixed top-0 left-0 z-60 w-[12vw]">
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-[12vw] h-[98.2vh] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl m-2 mr-1">
          <h2 className="text-lg p-1 pb-0 pl-2 font-semibold text-gray-900 dark:text-white">
            {building.title}
          </h2>
          <h4 className="text-sm p-1 pb-4 pl-2 font-normal text-gray-400 dark:text-white">
            floors :
          </h4>

          <ul className="space-y-2 font-normal text-xs">
            {floors.map((floor: Floor) => (
              <li key={floor.id} className="justify-center items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFloor(floor);
                  }}
                  className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Layers2 className="w-5 h-5 text-gray-500" />
                  <span className="ms-3">{floor.title}</span>
                </button>
              </li>
            ))}
            <li className="justify-start items-start">
              <div className="ml-2 h-[0.2] w-[7vw] bg-black opacity-15"></div>
            </li>
            <li className="justify-center items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <Plus className="w-5 h-5 text-gray-500" />
                <span className="ms-3">FCU/AC</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
