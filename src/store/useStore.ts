import { create } from "zustand";
import * as THREE from "three";
import { AcType, Floor, Building } from "@/types";

interface StoreState {
  developingMode: boolean;
  setDevelopingMode: (mode: boolean) => void;

  outsideMode: boolean;
  setOutsideMode: (mode: boolean) => void;

  ACs: AcType[];
  setACs: (acs: AcType[]) => void;
  addAC: (ac: AcType) => void;
  delAC: (id: number) => void;

  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;

  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;

  selectedAsset: string | null;
  setSelectedAsset: (asset: string | null) => void;

  cameraPosition: THREE.Vector3;
  setCameraPosition: (pos: THREE.Vector3) => void;

  uiPanelOpen: boolean;
  setUiPanelOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  developingMode: false,
  setDevelopingMode: (mode: boolean) => set({ developingMode: mode }),

  outsideMode: false,
  setOutsideMode: (mode: boolean) => set({ outsideMode: mode }),

  ACs: [],
  setACs: (acs) => set((state) => ({ ACs: acs })),
  addAC: (ac) => set((state) => ({ ACs: [...state.ACs, ac] })),
  delAC: (id: number) =>
    set((state) => ({ ACs: state.ACs.filter((ac) => ac.id !== id) })),
  selectedFloor: 1,
  setSelectedFloor: (floor: number) => set({ selectedFloor: floor }),
  selectedBuilding: { title: "", cityId: 1 },
  setSelectedBuilding: (building: Building | null) =>
    set({ selectedBuilding: building }),
  selectedAsset: null,
  setSelectedAsset: (asset: string | null) => set({ selectedAsset: asset }),
  cameraPosition: new THREE.Vector3(0, 0, 0),
  setCameraPosition: (pos: THREE.Vector3) => set({ cameraPosition: pos }),
  uiPanelOpen: false,
  setUiPanelOpen: (open: boolean) => set({ uiPanelOpen: open }),
}));
