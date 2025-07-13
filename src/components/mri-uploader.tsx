'use client';

import { useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMriStore } from '@/stores/mri-store';

export function MriUploader() {
  const setMriFile = useMriStore((state) => state.setFile);
  const mriFile = useMriStore((state) => state.file);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFile = (selectedFile: File | undefined | null) => {
    if (selectedFile) {
      if (selectedFile.name.endsWith('.nii') || selectedFile.name.endsWith('.nii.gz')) {
        setMriFile(selectedFile);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a .nii or .nii.gz file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setMriFile(null);
  };

  const handleNavigateToAnalysis = () => {
    if (mriFile) {
      setIsNavigating(true);
      router.push('/analysis');
    }
  };

  return (
    <div className="w-full">
      {!mriFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative w-full border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300',
            isDragging ? 'border-primary bg-accent' : 'border-border hover:border-primary'
          )}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Drag & drop your file here</p>
              <p className="text-muted-foreground">or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">.nii or .nii.gz files only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept=".nii,.nii.gz"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>
      ) : (
        <div className="w-full bg-card border rounded-lg p-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3 bg-muted p-3 rounded-md w-full max-w-md">
            <File className="h-6 w-6 text-primary" />
            <span className="font-mono text-sm truncate flex-1">{mriFile.name}</span>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleNavigateToAnalysis} disabled={isNavigating} size="lg">
            {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNavigating ? 'Processing...' : 'Go to Analysis'}
          </Button>
        </div>
      )}
    </div>
  );
}
