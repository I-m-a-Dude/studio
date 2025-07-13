'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, Scan } from 'lucide-react';

export function MriViewer() {
  const [slice, setSlice] = useState(50);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
      <div className="relative w-full max-w-[512px] aspect-square overflow-hidden rounded-md border border-border bg-black">
        <Image
          src="https://placehold.co/512x512.png"
          alt="MRI Slice"
          width={512}
          height={512}
          data-ai-hint="medical mri"
          className="transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Slice: {slice} / 100
        </div>
      </div>
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center gap-4">
           <Scan className="w-5 h-5 text-muted-foreground"/>
           <Slider
            value={[slice]}
            onValueChange={(value) => setSlice(value[0])}
            max={100}
            step={1}
          />
        </div>
        <div className="flex justify-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
            </Button>
            <Button variant="outline" size="icon">
                <Move className="h-4 w-4" />
                <span className="sr-only">Pan</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
