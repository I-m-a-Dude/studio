import { create } from 'zustand';

interface AnalysisState {
  multiPlanarView: boolean;
  threeDReconstruction: boolean;
  showHistogram: boolean;
  showProfileCurves: boolean;
  setMultiPlanarView: (value: boolean) => void;
  setThreeDReconstruction: (value: boolean) => void;
  setShowHistogram: (value: boolean) => void;
  setShowProfileCurves: (value: boolean) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  multiPlanarView: false,
  threeDReconstruction: false,
  showHistogram: false,
  showProfileCurves: false,
  setMultiPlanarView: (value) => set({ multiPlanarView: value }),
  setThreeDReconstruction: (value) => set({ threeDReconstruction: value }),
  setShowHistogram: (value) => set({ showHistogram: value }),
  setShowProfileCurves: (value) => set({ showProfileCurves: value }),
}));
