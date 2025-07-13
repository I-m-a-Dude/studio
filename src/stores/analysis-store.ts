import { create } from 'zustand';

interface AnalysisState {
  multiPlanarView: boolean;
  threeDReconstruction: boolean;
  showHistogram: boolean;
  showProfileCurves: boolean;
  brightness: number;
  contrast: number;
  setMultiPlanarView: (value: boolean) => void;
  setThreeDReconstruction: (value: boolean) => void;
  setShowHistogram: (value: boolean) => void;
  setShowProfileCurves: (value: boolean) => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  multiPlanarView: false,
  threeDReconstruction: false,
  showHistogram: false,
  showProfileCurves: false,
  brightness: 50,
  contrast: 50,
  setMultiPlanarView: (value) => set({ multiPlanarView: value }),
  setThreeDReconstruction: (value) => set({ threeDReconstruction: value }),
  setShowHistogram: (value) => set({ showHistogram: value }),
  setShowProfileCurves: (value) => set({ showProfileCurves: value }),
  setBrightness: (value) => set({ brightness: value }),
  setContrast: (value) => set({ contrast: value }),
}));
