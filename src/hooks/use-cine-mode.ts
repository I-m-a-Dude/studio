'use client';

import { useEffect, useRef } from 'react';
import { useAnalysisStore } from '@/stores/analysis-store';
import { useViewStore } from '@/stores/view-store';

const CINE_MODE_INTERVAL = 100; // ms

export function useCineMode() {
  const { isCineMode, setIsCineMode } = useAnalysisStore();
  const { slice, maxSlices, axis, setSlice } = useViewStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This effect starts/stops the animation.
    if (isCineMode && maxSlices[axis] > 0) {
      intervalRef.current = setInterval(() => {
        setSlice((currentSlice) => (currentSlice + 1) % maxSlices[axis]);
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
  }, [isCineMode, maxSlices, axis, setSlice]);


  useEffect(() => {
    // This effect resets the slice to 0 when CineMode is turned on.
    const unsub = useAnalysisStore.subscribe((state, prevState) => {
      // When isCineMode changes from false to true
      if (state.isCineMode && !prevState.isCineMode) {
        setSlice(0);
      }
    });

    return unsub;
  }, [setSlice]);
}
