'use client';

import { MriViewer } from '@/components/mri-viewer';
import { SegmentationControls } from '@/components/segmentation-controls';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCineMode } from '@/hooks/use-cine-mode';
import { MetadataViewerDialog } from '@/components/metadata-viewer-dialog';
import { Sparkles } from 'lucide-react';

export default function AnalysisPage() {
  useCineMode();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-full">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Segmentation
          </Button>
          <Button variant="outline" asChild className="rounded-full">
              <Link href="/">
                Back to Upload
              </Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4 overflow-hidden min-w-0">
            <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center overflow-hidden relative">
                <MriViewer />
            </div>
        </div>
        <div className="h-full w-full max-w-sm border-l border-border bg-card flex-shrink-0">
          <SegmentationControls />
        </div>
      </main>
      <MetadataViewerDialog />
    </div>
  );
}
