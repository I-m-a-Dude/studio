import { create } from 'zustand';

export type ViewAxis = 'axial' | 'sagittal' | 'coronal';

interface ViewState {
  slice: number;
  maxSlices: Record<ViewAxis, number>;
  axis: ViewAxis;
  zoom: number;
  setSlice: (slice: number | ((prevSlice: number) => number)) => void;
  setAxis: (axis: ViewAxis) => void;
  setMaxSlices: (maxSlices: Record<ViewAxis, number>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

export const useViewStore = create<ViewState>((set, get) => ({
  slice: 0,
  maxSlices: { axial: 0, sagittal: 0, coronal: 0 },
  axis: 'axial',
  zoom: 1,
  setSlice: (slice) => {
    if (typeof slice === 'function') {
      set((state) => ({ slice: slice(state.slice) }));
    } else {
      set({ slice });
    }
  },
  setAxis: (axis) => {
    const { maxSlices } = get();
    // Reset slice to the middle when changing axis
    set({ axis, slice: Math.floor(maxSlices[axis] / 2) });
  },
  setMaxSlices: (maxSlices) => {
     const { axis } = get();
     set({ maxSlices, slice: Math.floor(maxSlices[axis] / 2) });
  },
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom * 1.1, 5) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom / 1.1, 0.2) })),
  resetView: () => {
    const { maxSlices, axis } = get();
    set({ zoom: 1, slice: Math.floor(maxSlices[axis] / 2) });
  },
}));
