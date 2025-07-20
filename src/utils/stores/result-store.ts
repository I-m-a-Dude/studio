import { create } from 'zustand';

interface ResultState {
  analysisResult: string | null;
  setAnalysisResult: (result: string | null) => void;
}

export const useResultStore = create<ResultState>((set) => ({
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
}));
