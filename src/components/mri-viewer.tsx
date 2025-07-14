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
import { cn } from '@/lib/utils';

// From nifti-reader-js, because the export is problematic.
const NIFTI_DATA_TYPE_MAP: Record<number, string> = {
    0: 'NONE',
    1: 'BINARY',
    2: 'UINT8',
    4: 'INT16',
    8: 'INT32',
    16: 'FLOAT32',
    32: 'COMPLEX64',
    64: 'FLOAT64',
    128: 'RGB24',
    255: 'ALL',
    256: 'INT8',
    512: 'UINT16',
    768: 'UINT32',
    1024: 'INT64',
    1280: 'UINT64',
    1536: 'FLOAT128',
    1792: 'COMPLEX128',
    2048: 'COMPLEX256',
};
function getDataType(code: number): string {
    return NIFTI_DATA_TYPE_MAP[code] || 'UNKNOWN';
}


export function MriViewer() {
  const file = useMriStore((state) => state.file);
  const { slice, zoom, axis, pan, setPan, setMaxSlices, zoomIn, zoomOut } = useViewStore();
  const { 
    brightness, 
    contrast, 
    sliceThickness,
    setHistogramData, 
    setProfileCurveData, 
    setMetadata 
  } = useAnalysisStore();

  const [niftiHeader, setNiftiHeader] = useState<nifti.NIFTI1 | nifti.NIFTI2 | null>(null);
  const [niftiImage, setNiftiImage] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });


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
          setMetadata({
            'Description': header.description,
            'Dimensions': header.dims,
            'Voxel Size': header.pixDims,
            'Data Type': getDataType(header.datatype),
            'Endianness': header.little_endian ? 'Little' : 'Big',
            'Calibration Max': header.cal_max,
            'Calibration Min': header.cal_min,
            'Slice Duration': header.slice_duration,
            'Time Offset': header.toffset,
            'Q-form Code': header.qform_code,
            'S-form Code': header.sform_code,
            'Quaternion B': header.quatern_b,
            'Quaternion C': header.quatern_c,
            'Quaternion D': header.quatern_d,
            'Q-offset X': header.qoffset_x,
            'Q-offset Y': header.qoffset_y,
            'Q-offset Z': header.qoffset_z,
            'S-Row X': header.srow_x,
            'S-Row Y': header.srow_y,
            'S-Row Z': header.srow_z,
            'Intent Name': header.intent_name,
          });

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
  }, [file, setMaxSlices, setHistogramData, setProfileCurveData, setMetadata]);
  
  const drawSlice = (currentSlice: number, currentAxis: ViewAxis) => {
    if (!niftiHeader || !niftiImage || !canvasRef.current) return;

    const dims = niftiHeader.dims;
    let cols, rows, maxSliceForAxis;
    
    if (currentAxis === 'axial') { // Z
        cols = dims[1];
        rows = dims[2];
        maxSliceForAxis = dims[3];
    } else if (currentAxis === 'coronal') { // Y
        cols = dims[1];
        rows = dims[3];
        maxSliceForAxis = dims[2];
    } else { // Sagittal / X
        cols = dims[2];
        rows = dims[3];
        maxSliceForAxis = dims[1];
    }

    const canvas = canvasRef.current;
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Apply brightness and contrast
    // 50 is default (100%), 0 is 0%, 100 is 200%
    ctx.filter = `brightness(${brightness / 50}) contrast(${contrast / 50})`;
    
    const imageData = ctx.createImageData(cols, rows);

    let maxVal = niftiHeader.cal_max;
    if (maxVal === 0) {
        // Fallback for calculating max value if not in header
        const typedData = new Float32Array(niftiImage);
        maxVal = typedData.reduce((max, current) => Math.max(max, current), -Infinity);
    }
    if (maxVal === 0) maxVal = 1; // Avoid division by zero

    const sliceSize = dims[1] * dims[2];
    const thickness = Math.floor(sliceThickness);
    const halfThickness = Math.floor(thickness / 2);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let totalValue = 0;
            let count = 0;

            for(let t = -halfThickness; t <= halfThickness; t++) {
                const sliceToSample = Math.round(currentSlice) + t;
                if (sliceToSample < 0 || sliceToSample >= maxSliceForAxis) continue;

                let voxelIndex;
                if (currentAxis === 'axial') {
                    voxelIndex = j + (i * dims[1]) + (sliceToSample * sliceSize);
                } else if (currentAxis === 'coronal') {
                    voxelIndex = j + (sliceToSample * dims[1]) + (i * sliceSize);
                } else { // sagittal
                    voxelIndex = sliceToSample + (j * dims[1]) + (i * sliceSize);
                }
                
                // This assumes Float32 data type for simplicity
                const pixelData = new Float32Array(niftiImage, voxelIndex * 4, 1);
                totalValue += pixelData[0];
                count++;
            }
            
            const avgValue = count > 0 ? totalValue / count : 0;
            const value = Math.round(Math.abs(avgValue / maxVal) * 255);
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
  }, [slice, axis, loading, error, niftiHeader, niftiImage, brightness, contrast, sliceThickness]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only pan on left-click
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    e.preventDefault();
    setIsPanning(false);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      handleMouseUp(e);
    }
  };


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
                style={{ 
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
                    imageRendering: 'pixelated' 
                }}
            />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Slice: {Math.round(slice) + 1} / {useViewStore.getState().maxSlices[axis]}
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
      <div
        className={cn(
            "relative w-full max-w-[512px] aspect-square overflow-hidden rounded-md border border-border bg-black flex items-center justify-center",
             isPanning ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </div>
       <ViewerToolbar />
    </div>
  );
}
