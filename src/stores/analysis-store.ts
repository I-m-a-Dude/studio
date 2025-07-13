import { create } from 'zustand';

export interface HistogramData {
  value: number;
  count: number;
}

export interface ProfileCurveData {
    position: number;
    intensity: number;
}

interface AnalysisState {
  multiPlanarView: boolean;
  threeDReconstruction: boolean;
  showHistogram: boolean;
  showProfileCurves: boolean;
  brightness: number;
  contrast: number;
  histogramData: HistogramData[];
  profileCurveData: ProfileCurveData[];
  setMultiPlanarView: (value: boolean) => void;
  setThreeDReconstruction: (value: boolean) => void;
  setShowHistogram: (value: boolean) => void;
  setShowProfileCurves: (value: boolean) => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  setHistogramData: (data: HistogramData[]) => void;
  setProfileCurveData: (data: ProfileCurveData[]) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  multiPlanarView: false,
  threeDReconstruction: false,
  showHistogram: false,
  showProfileCurves: false,
  brightness: 50,
  contrast: 50,
  histogramData: [],
  profileCurveData: [],
  setMultiPlanarView: (value) => set({ multiPlanarView: value }),
  setThreeDReconstruction: (value) => set({ threeDReconstruction: value }),
  setShowHistogram: (value) => set({ showHistogram: value }),
  setShowProfileCurves: (value) => set({ showProfileCurves: value }),
  setBrightness: (value) => set({ brightness: value }),
  setContrast: (value) => set({ contrast: value }),
  setHistogramData: (data) => set({ histogramData: data }),
  setProfileCurveData: (data) => set({ profileCurveData: data }),
}));
