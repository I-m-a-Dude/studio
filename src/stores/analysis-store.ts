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
  showAnalysisPanel: boolean;
  multiPlanarView: boolean;
  threeDReconstruction: boolean;
  showHistogram: boolean;
  showProfileCurves: boolean;
  isCineMode: boolean;
  brightness: number;
  contrast: number;
  histogramData: HistogramData[];
  profileCurveData: ProfileCurveData[];
  showMetadataViewer: boolean;
  metadata: Record<string, any> | null;
  setShowAnalysisPanel: (value: boolean) => void;
  setMultiPlanarView: (value: boolean) => void;
  setThreeDReconstruction: (value: boolean) => void;
  setShowHistogram: (value: boolean) => void;
  setShowProfileCurves: (value: boolean) => void;
  setIsCineMode: (value: boolean) => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  setHistogramData: (data: HistogramData[]) => void;
  setProfileCurveData: (data: ProfileCurveData[]) => void;
  setShowMetadataViewer: (value: boolean) => void;
  setMetadata: (data: Record<string, any> | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  showAnalysisPanel: false,
  multiPlanarView: false,
  threeDReconstruction: false,
  showHistogram: false,
  showProfileCurves: false,
  isCineMode: false,
  brightness: 50,
  contrast: 50,
  histogramData: [],
  profileCurveData: [],
  showMetadataViewer: false,
  metadata: null,
  setShowAnalysisPanel: (value) => set({ showAnalysisPanel: value }),
  setMultiPlanarView: (value) => set({ multiPlanarView: value }),
  setThreeDReconstruction: (value) => set({ threeDReconstruction: value }),
  setShowHistogram: (value) => set({ showHistogram: value }),
  setShowProfileCurves: (value) => set({ showProfileCurves: value }),
  setIsCineMode: (value) => set({ isCineMode: value }),
  setBrightness: (value) => set({ brightness: value }),
  setContrast: (value) => set({ contrast: value }),
  setHistogramData: (data) => set({ histogramData: data }),
  setProfileCurveData: (data) => set({ profileCurveData: data }),
  setShowMetadataViewer: (value) => set({ showMetadataViewer: value }),
  setMetadata: (data) => set({ metadata: data }),
}));
