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
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out">
                <MriViewer />
            </div>
        </div>
        <div 
          className={cn(
            "transition-transform duration-300 ease-in-out transform w-full max-w-sm border-l border-border bg-card lg:w-96",
            "absolute lg:relative h-full top-0 right-0",
            showAnalysisPanel ? 'translate-x-0' : 'translate-x-full'
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
