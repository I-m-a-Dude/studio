'use client';

import { useState, useEffect, useRef } from 'react';
import * as nifti from 'nifti-reader-js';
import pako from 'pako';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, Scan, Loader2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MriViewer() {
  const [slice, setSlice] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [niftiHeader, setNiftiHeader] = useState<nifti.NIFTI1 | nifti.NIFTI2 | null>(null);
  const [niftiImage, setNiftiImage] = useState<ArrayBuffer | null>(null);
  const [totalSlices, setTotalSlices] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadNiftiFile = () => {
      setLoading(true);
      setError(null);
      try {
        const fileInfoString = sessionStorage.getItem('mriFile');
        if (!fileInfoString) {
          setError('No MRI file found in session. Please upload a file first.');
          setLoading(false);
          return;
        }

        const fileInfo = JSON.parse(fileInfoString);
        const base64Data = fileInfo.dataUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const len = binaryData.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }

        let niftiBuffer = bytes.buffer;

        if (nifti.isCompressed(niftiBuffer)) {
          niftiBuffer = pako.inflate(new Uint8Array(niftiBuffer)).buffer;
        }

        if (nifti.isNIFTI(niftiBuffer)) {
          const header = nifti.readHeader(niftiBuffer);
          const image = nifti.readImage(header, niftiBuffer);
          setNiftiHeader(header);
          setNiftiImage(image);
          
          const slices = header.dims[3];
          setTotalSlices(slices);
          setSlice(Math.floor(slices / 2));
        } else {
           setError('The provided file is not a valid NIfTI file.');
        }
      } catch (err) {
        console.error('Error loading or parsing NIfTI file:', err);
        setError('Failed to load or parse the NIfTI file.');
      } finally {
        setLoading(false);
      }
    };

    loadNiftiFile();
  }, []);

  const drawSlice = (sliceIndex: number) => {
    if (!niftiHeader || !niftiImage || !canvasRef.current) return;

    const cols = niftiHeader.dims[1];
    const rows = niftiHeader.dims[2];
    const canvas = canvasRef.current;
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const sliceSize = cols * rows;
    const sliceOffset = sliceSize * sliceIndex;
    const imageData = ctx.createImageData(cols, rows);
    const typedData = new Uint8ClampedArray(niftiImage, sliceOffset * niftiHeader.numBitsPerVoxel / 8, sliceSize * 4);

    let maxVal = 0;
    if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
        maxVal = 255;
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
        maxVal = 32767;
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
        maxVal = 2147483647;
    } else {
        // Find max value for scaling for other data types
        const sliceData = new Float32Array(niftiImage, sliceOffset * 4, sliceSize);
        maxVal = sliceData.reduce((max, current) => Math.max(max, current), -Infinity);
    }
    
    if(maxVal === 0) maxVal = 1; // avoid division by zero

    let pixelData;
    switch (niftiHeader.datatypeCode) {
        case nifti.NIFTI1.TYPE_UINT8:
            pixelData = new Uint8Array(niftiImage, sliceOffset, sliceSize);
            break;
        case nifti.NIFTI1.TYPE_INT16:
            pixelData = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
            break;
        case nifti.NIFTI1.TYPE_FLOAT32:
            pixelData = new Float32Array(niftiImage, sliceOffset * 4, sliceSize);
            break;
        default:
            console.warn(`Unsupported data type: ${niftiHeader.datatypeCode}. Trying to render as Uint8.`);
            pixelData = new Uint8Array(niftiImage, sliceOffset, sliceSize);
            maxVal = 255;
            break;
    }

    for (let i = 0; i < sliceSize; i++) {
        const value = Math.round(Math.abs(pixelData[i] / maxVal) * 255);
        imageData.data[i * 4] = value;
        imageData.data[i * 4 + 1] = value;
        imageData.data[i * 4 + 2] = value;
        imageData.data[i * 4 + 3] = 255; // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
  };
  
  useEffect(() => {
    if(!loading && !error){
      drawSlice(slice);
    }
  }, [slice, loading, error, niftiHeader, niftiImage]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-destructive">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">Error</p>
          <p className="text-center">{error}</p>
        </div>
      );
    }
    
    if (niftiHeader) {
       return (
        <>
            <canvas 
                ref={canvasRef}
                className="transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, imageRendering: 'pixelated' }}
            />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Slice: {slice + 1} / {totalSlices}
            </div>
        </>
       );
    }
    
    return null;
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
      <div className="relative w-full max-w-[512px] aspect-square overflow-hidden rounded-md border border-border bg-black flex items-center justify-center">
        {renderContent()}
      </div>
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center gap-4">
           <Scan className="w-5 h-5 text-muted-foreground"/>
           <Slider
            value={[slice]}
            onValueChange={(value) => setSlice(value[0])}
            max={totalSlices > 0 ? totalSlices - 1 : 0}
            step={1}
            disabled={loading || !!error || totalSlices === 0}
          />
        </div>
        <div className="flex justify-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={loading || !!error}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={loading || !!error}>
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
            </Button>
            <Button variant="outline" size="icon" disabled={loading || !!error}>
                <Move className="h-4 w-4" />
                <span className="sr-only">Pan</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
