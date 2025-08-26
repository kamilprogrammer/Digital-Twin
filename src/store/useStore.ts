import { create } from "zustand";
import * as THREE from "three";
import { AcType, Floor, Building, City } from "@/types";

interface StoreState {
  isDeveloping: boolean;
  setIsDeveloping: (mode: boolean) => void;

  InteriorMode: boolean;
  setInteriorMode: (mode: boolean) => void;

  isTransitioning: boolean;
  setIsTransitioning: (mode: boolean) => void;

  ACs: AcType[];
  setACs: (acs: AcType[]) => void;
  addAC: (ac: AcType) => void;
  delAC: (id: number) => void;

  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;

  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;

  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;

  selectedAsset: string | null;
  setSelectedAsset: (asset: string | null) => void;

  cameraPosition: THREE.Vector3;
  setCameraPosition: (pos: THREE.Vector3) => void;

  cameraQuaternion: THREE.Quaternion;
  setCameraQuaternion: (quaternion: THREE.Quaternion) => void;

  cameraTarget: THREE.Vector3;
  setCameraTarget: (pos: THREE.Vector3) => void;

  cameraTargetRotation: THREE.Euler;
  setCameraTargetRotation: (rot: THREE.Euler) => void;

  uiPanelOpen: boolean;
  setUiPanelOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  isDeveloping: false,
  setIsDeveloping: (mode: boolean) => set({ isDeveloping: mode }),

  InteriorMode: false,
  setInteriorMode: (mode: boolean) => set({ InteriorMode: mode }),

  isTransitioning: false,
  setIsTransitioning: (mode: boolean) => set({ isTransitioning: mode }),

  ACs: [],
  setACs: (acs) => set((state) => ({ ACs: acs })),

  addAC: (ac) => set((state) => ({ ACs: [...state.ACs, ac] })),
  delAC: (id: number) =>
    set((state) => ({ ACs: state.ACs.filter((ac) => ac.id !== id) })),

  selectedFloor: 1,
  setSelectedFloor: (floor: number) => set({ selectedFloor: floor }),

  selectedBuilding: null,
  setSelectedBuilding: (building: Building | null) =>
    set({ selectedBuilding: building }),

  selectedCity: null,
  setSelectedCity: (city: City | null) => set({ selectedCity: city }),

  selectedAsset: null,
  setSelectedAsset: (asset: string | null) => set({ selectedAsset: asset }),

  cameraPosition: new THREE.Vector3(0, 0, 0),
  setCameraPosition: (pos: THREE.Vector3) => set({ cameraPosition: pos }),

  cameraQuaternion: new THREE.Quaternion(),
  setCameraQuaternion: (quaternion: THREE.Quaternion) =>
    set({ cameraQuaternion: quaternion }),

  cameraTarget: new THREE.Vector3(0, 0, 10),
  setCameraTarget: (pos: THREE.Vector3) => set({ cameraTarget: pos }),

  cameraTargetRotation: new THREE.Euler(0, 0, 0),
  setCameraTargetRotation: (rot: THREE.Euler) =>
    set({ cameraTargetRotation: rot }),

  uiPanelOpen: false,
  setUiPanelOpen: (open: boolean) => set({ uiPanelOpen: open }),
}));
