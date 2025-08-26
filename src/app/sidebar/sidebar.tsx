import { Plus, Layers2, UserPen, LogOut } from "lucide-react";
import * as THREE from "three";
import { Floor } from "@/types";
import { useStore } from "@/store/useStore";
interface SidebarProps {
  floors: Floor[];
}

export default function Sidebar({ floors }: SidebarProps) {
  const { addAC } = useStore();
  const cameraPosition = useStore((state) => state.cameraPosition);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const selectedBuilding = useStore((state) => state.selectedBuilding);
  const setSelectedFloor = useStore((state) => state.setSelectedFloor);
  const isDeveloping = useStore((state) => state.isDeveloping);
  const setIsDeveloping = useStore((state) => state.setIsDeveloping);

  const { setCameraTarget, setCameraTargetRotation, setSelectedBuilding } =
    useStore();
  const setShowInterior = useStore((state) => state.setInteriorMode);
  return (
    <div className="fixed top-0 left-0 z-60 w-[12vw]">
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-[12vw] h-[98.2vh] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl m-2 mr-1">
          <h2 className="text-lg p-1 pb-0 pl-2 font-semibold text-gray-900 dark:text-white">
            {selectedBuilding?.title}
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
                    setSelectedFloor(floor.floorIndex || 1);
                  }}
                  className={`${
                    selectedFloor === floor.floorIndex ? "bg-neutral-200" : " "
                  } flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
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
                  console.log(selectedBuilding);
                  console.log(cameraPosition);
                  if (selectedBuilding) {
                    addAC({
                      uniqueId: crypto.randomUUID(),
                      title: "Placed AC",
                      mac: "",
                      model: "",
                      vendor: "",
                      notes: "",
                      floorId: selectedFloor,
                      buildingId: selectedBuilding?.id,
                      position: {
                        x: cameraPosition.x,
                        y: cameraPosition.y,
                        z: cameraPosition.z,
                      },
                      rotation: {
                        x: 0,
                        y: 0,
                        z: 0,
                      },
                      show: true,
                    });
                  }
                }}
                className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <Plus className="w-5 h-5 text-gray-500" />
                <span className="ms-3">FCU/AC</span>
              </button>
            </li>
            <li className="justify-center items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeveloping(!isDeveloping);
                }}
                className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <UserPen className="w-5 h-5 text-gray-500" />
                <span className="ms-3">
                  {isDeveloping
                    ? "Exit Developing Mode"
                    : "Enter Developing Mode"}
                </span>
              </button>
            </li>
            <li className="justify-center items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCameraTarget(new THREE.Vector3(0, 80, 0));
                  setCameraTargetRotation(
                    new THREE.Euler(0, -(Math.PI / 2), 0)
                  );
                  setTimeout(() => setShowInterior(false), 500);
                  setTimeout(() => setSelectedBuilding(null), 1250);
                }}
                className="flex items-start w-[10vw] p-2 pl-2 justify-start text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LogOut className="w-5 h-5 text-gray-500" />
                <span className="ms-3">Exit & Go Outside</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
