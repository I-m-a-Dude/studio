'use client';

import { MriViewer } from '@/components/mri-viewer';
import { SegmentationControls } from '@/components/segmentation-controls';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SegmentationFAB } from '@/components/segmentation-fab';
import { useCineMode } from '@/hooks/use-cine-mode';
import { MetadataViewerDialog } from '@/components/metadata-viewer-dialog';
import { cn } from '@/lib/utils';
import { useAnalysisStore } from '@/stores/analysis-store';

export default function AnalysisPage() {
  useCineMode();
  const showAnalysisPanel = useAnalysisStore((state) => state.showAnalysisPanel);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Logo />
        <Button variant="outline" asChild className="rounded-full">
            <Link href="/">
              Back to Upload
            </Link>
        </Button>
      </header>
      <main className="flex-1 grid lg:grid-cols-4 gap-4 p-4 overflow-hidden relative">
        <div 
          className={cn(
            "transition-all duration-500 ease-in-out bg-black/20 rounded-lg flex items-center justify-center overflow-hidden",
            showAnalysisPanel ? "lg:col-span-3" : "lg:col-span-4"
          )}
        >
          <MriViewer />
        </div>
        <div 
          className={cn(
            "lg:block transition-all duration-500 ease-in-out transform absolute lg:relative top-0 right-0 h-full lg:h-auto w-full max-w-sm lg:max-w-none lg:w-auto lg:col-span-1 overflow-y-auto",
            showAnalysisPanel
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          )}
        >
          <SegmentationControls />
        </div>
        <SegmentationFAB />
      </main>
      <MetadataViewerDialog />
    </div>
  );
}
