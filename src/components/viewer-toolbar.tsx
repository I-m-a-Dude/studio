'use client';

import { useViewStore } from '@/stores/view-store';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, RotateCcw, Scan } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMriStore } from '@/stores/mri-store';

export function ViewerToolbar() {
  const { 
    slice, 
    maxSlices, 
    axis, 
    setSlice, 
    zoomIn, 
    zoomOut,
    resetView,
  } = useViewStore();

  const file = useMriStore(state => state.file);
  const isDisabled = !file;
  
  return (
    <div className="w-full max-w-xl space-y-4 p-4 bg-background/50 rounded-md">
      <div className="flex items-center gap-4">
        <Scan className="w-5 h-5 text-muted-foreground" />
        <Slider
          value={[slice]}
          onValueChange={(value) => setSlice(value[0])}
          max={maxSlices[axis] > 0 ? maxSlices[axis] - 1 : 0}
          step={1}
          disabled={isDisabled || maxSlices[axis] === 0}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="icon" onClick={zoomIn} disabled={isDisabled}>
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom In</span>
        </Button>
        <Button variant="outline" size="icon" onClick={zoomOut} disabled={isDisabled}>
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom Out</span>
        </Button>
        <Button variant="outline" size="icon" disabled={isDisabled}>
          <Move className="h-4 w-4" />
          <span className="sr-only">Pan</span>
        </Button>
        <Button variant="outline" size="icon" onClick={resetView} disabled={isDisabled}>
           <RotateCcw className="h-4 w-4" />
           <span className="sr-only">Reset View</span>
        </Button>
      </div>
    </div>
  );
}
