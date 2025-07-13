'use client';

import { useState, useEffect, useRef } from 'react';
import * as nifti from 'nifti-reader-js';
import pako from 'pako';
import { useMriStore } from '@/stores/mri-store';
import { useViewStore, type ViewAxis } from '@/stores/view-store';
import { useAnalysisStore } from '@/stores/analysis-store';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { ViewerToolbar } from './viewer-toolbar';

export function MriViewer() {
  const file = useMriStore((state) => state.file);
  const { slice, zoom, axis, setMaxSlices } = useViewStore();
  const { setHistogramData, setProfileCurveData } = useAnalysisStore();

  const [niftiHeader, setNiftiHeader] = useState<nifti.NIFTI1 | nifti.NIFTI2 | null>(null);
  const [niftiImage, setNiftiImage] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateAndSetChartData = (
    header: nifti.NIFTI1 | nifti.NIFTI2,
    image: ArrayBuffer
  ) => {
    // This is a simplified calculation for demonstration
    // A real implementation would be more complex
    const typedData = new Float32Array(image);

    // Histogram Data
    const histogram: { value: number; count: number }[] = [];
    const intensityMap = new Map<number, number>();
    const maxVal = header.cal_max > 0 ? header.cal_max : 1;
    typedData.forEach((val) => {
      const normalized = Math.round((val / maxVal) * 100);
      intensityMap.set(normalized, (intensityMap.get(normalized) || 0) + 1);
    });
    intensityMap.forEach((count, value) => {
      if (value >= 0 && value <= 100) { // Only show relevant range
        histogram.push({ value, count });
      }
    });
    setHistogramData(histogram.sort((a,b) => a.value - b.value));

    // Profile Curve Data (horizontal line through middle of axial view)
    const profile: { position: number; intensity: number }[] = [];
    const dims = header.dims;
    const middleSlice = Math.floor(dims[3] / 2);
    const middleRow = Math.floor(dims[2] / 2);
    const sliceSize = dims[1] * dims[2];

    for (let i = 0; i < dims[1]; i++) {
        const voxelIndex = i + (middleRow * dims[1]) + (middleSlice * sliceSize);
        const pixelData = new Float32Array(image, voxelIndex * 4, 1);
        profile.push({ position: i, intensity: pixelData[0] });
    }
    setProfileCurveData(profile);
  };

  useEffect(() => {
    const loadNiftiFile = async () => {
      setLoading(true);
      setError(null);
      if (!file) {
        setError('No MRI file found. Please go back and upload a file first.');
        setLoading(false);
        return;
      }

      try {
        const fileBuffer = await file.arrayBuffer();
        let niftiBuffer = fileBuffer;

        if (nifti.isCompressed(niftiBuffer)) {
          niftiBuffer = pako.inflate(new Uint8Array(niftiBuffer)).buffer;
        }

        if (nifti.isNIFTI(niftiBuffer)) {
          const header = nifti.readHeader(niftiBuffer);
          const image = nifti.readImage(header, niftiBuffer);
          setNiftiHeader(header);
          setNiftiImage(image);

          setMaxSlices({
            axial: header.dims[3],
            sagittal: header.dims[1],
            coronal: header.dims[2],
          });
          
          calculateAndSetChartData(header, image);

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
  }, [file, setMaxSlices, setHistogramData, setProfileCurveData]);
  
  const drawSlice = (currentSlice: number, currentAxis: ViewAxis) => {
    if (!niftiHeader || !niftiImage || !canvasRef.current) return;

    const dims = niftiHeader.dims;
    let cols, rows;
    
    if (currentAxis === 'axial') { // Z
        cols = dims[1];
        rows = dims[2];
    } else if (currentAxis === 'coronal') { // Y
        cols = dims[1];
        rows = dims[3];
    } else { // Sagittal / X
        cols = dims[2];
        rows = dims[3];
    }

    const canvas = canvasRef.current;
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    
    const imageData = ctx.createImageData(cols, rows);

    let maxVal = niftiHeader.cal_max;
    if (maxVal === 0) {
        // Fallback for calculating max value if not in header
        const typedData = new Float32Array(niftiImage);
        maxVal = typedData.reduce((max, current) => Math.max(max, current), -Infinity);
    }
    if (maxVal === 0) maxVal = 1; // Avoid division by zero

    const sliceSize = dims[1] * dims[2];
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let voxelIndex;
            if (currentAxis === 'axial') {
                voxelIndex = j + (i * dims[1]) + (currentSlice * sliceSize);
            } else if (currentAxis === 'coronal') {
                voxelIndex = j + (currentSlice * dims[1]) + (i * sliceSize);
            } else { // sagittal
                voxelIndex = currentSlice + (j * dims[1]) + (i * sliceSize);
            }
            
            // This assumes Float32 data type for simplicity
            const pixelData = new Float32Array(niftiImage, voxelIndex * 4, 1);
            const value = Math.round(Math.abs(pixelData[0] / maxVal) * 255);
            const pixelOffset = (i * cols + j) * 4;

            imageData.data[pixelOffset] = value;
            imageData.data[pixelOffset + 1] = value;
            imageData.data[pixelOffset + 2] = value;
            imageData.data[pixelOffset + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  useEffect(() => {
    if (!loading && !error && niftiHeader) {
      drawSlice(slice, axis);
    }
  }, [slice, axis, loading, error, niftiHeader, niftiImage, zoom]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-destructive p-4">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold text-center">Error Loading MRI</p>
          <p className="text-center text-sm">{error}</p>
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
                Slice: {slice + 1} / {useViewStore.getState().maxSlices[axis]}
            </div>
             <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded capitalize">
                {axis} View
            </div>
        </>
       );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 bg-black rounded-lg">
      <div className="relative w-full max-w-[512px] aspect-square overflow-hidden rounded-md border border-border bg-black flex items-center justify-center">
        {renderContent()}
      </div>
       <ViewerToolbar />
    </div>
  );
}
