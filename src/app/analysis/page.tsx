'use client';

import { MriViewer } from '@/components/mri-viewer';
import { SegmentationControls } from '@/components/segmentation-controls';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SegmentationFAB } from '@/components/segmentation-fab';
import { useCineMode } from '@/hooks/use-cine-mode';
import { MetadataViewerDialog } from '@/components/metadata-viewer-dialog';

export default function AnalysisPage() {
  useCineMode();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Logo />
        <Button variant="outline" asChild>
            <Link href="/">
              Back to Upload
            </Link>
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-hidden relative">
        <div className="lg:col-span-3 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
          <MriViewer />
        </div>
        <div className="lg:col-span-1 overflow-y-auto">
          <SegmentationControls />
        </div>
        <SegmentationFAB />
      </main>
      <MetadataViewerDialog />
    </div>
  );
}
