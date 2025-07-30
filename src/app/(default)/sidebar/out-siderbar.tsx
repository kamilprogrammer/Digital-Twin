import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Building } from "@/types/Building";
import { City } from "@/types/City";
interface SidebarProps {
  city: City;
  buildings: Building[];
  onNavigate?: (path: string) => void;
  setShowInterior?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OutSidebar({
  buildings,
  city,
  onNavigate,
  setShowInterior,
}: SidebarProps) {
  const [selected, setSelected] = useState<number>();

  return (
    <div className="fixed top-0 left-0 z-40 w-[12vw]">
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-[12vw] h-[98.2vh] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl m-2 mr-1">
          <h2 className="text-lg p-4 pl-2 font-semibold text-gray-900 dark:text-white">
            Dubai {/*{city.title}*/}
          </h2>

          <ul className="space-y-2 font-normal text-xs">
            {buildings.map((building) => (
              <li key={building.id}>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(`/building/${building.id}`);
                  }}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span className="ms-3">{building.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
