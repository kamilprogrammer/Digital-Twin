import { create } from "zustand";

interface StoreState {
  selectedAsset: string | null;
  setSelectedAsset: (asset: string | null) => void;

  cameraPosition: [number, number, number];
  setCameraPosition: (pos: [number, number, number]) => void;

  uiPanelOpen: boolean;
  setUiPanelOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedAsset: null,
  setSelectedAsset: (asset: string | null) => set({ selectedAsset: asset }),
  cameraPosition: [0, 0, 0],
  setCameraPosition: (pos: [number, number, number]) =>
    set({ cameraPosition: pos }),
  uiPanelOpen: false,
  setUiPanelOpen: (open: boolean) => set({ uiPanelOpen: open }),
}));
