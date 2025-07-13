import { useEffect, useRef } from 'react';
import { useAnalysisStore } from '@/stores/analysis-store';
import { useViewStore } from '@/stores/view-store';

const CINE_MODE_INTERVAL = 100; // ms

export function useCineMode() {
  const { isCineMode } = useAnalysisStore();
  const { slice, maxSlices, axis, setSlice } = useViewStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCineMode) {
      intervalRef.current = setInterval(() => {
        const nextSlice = (slice + 1) % maxSlices[axis];
        setSlice(nextSlice);
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
}
