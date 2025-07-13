'use client';

import { useEffect, useRef } from 'react';
import { useAnalysisStore } from '@/stores/analysis-store';
import { useViewStore } from '@/stores/view-store';

const CINE_MODE_INTERVAL = 100; // ms

export function useCineMode() {
  const { isCineMode } = useAnalysisStore();
  const { slice, maxSlices, axis, setSlice } = useViewStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCineMode && maxSlices[axis] > 0) {
      intervalRef.current = setInterval(() => {
        setSlice((slice + 1) % maxSlices[axis]);
      }, CINE_MODE_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCineMode, slice, maxSlices, axis, setSlice]);

  // Effect to update slice based on store changes
  useEffect(() => {
      const unsub = useViewStore.subscribe((state, prevState) => {
          if (isCineMode && state.slice !== prevState.slice) {
              // The slice is already updated by the interval, so we don't need to do anything here.
              // This is mainly to ensure the component re-renders if slice is changed from elsewhere.
          }
      });
      return unsub;
  }, [isCineMode]);
}
