import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
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
}: SidebarProps) {
  const [selected, setSelected] = useState<number>();

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
            {floors.map((floor) => (
              <li key={floor.id}>
                <button
                  onClick={(e) => {
                    /*e.stopPropagation();
                    setSelected(floor.id);
                    setCameraTarget(
                      new THREE.Vector3(
                        Number(floor.x),
                        Number(buidling.pos_y),
                        Number(buidling.pos_z)
                      )
                    );*/
                  }}
                  className="flex items-center p-2 pl-2 justify-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span className="ms-3">{floor.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
