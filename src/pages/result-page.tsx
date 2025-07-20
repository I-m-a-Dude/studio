'use client';

import { MriViewer } from '@/components/mri-viewer';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCineMode } from '@/utils/hooks/use-cine-mode';
import { MetadataViewerDialog } from '@/components/metadata-viewer-dialog';
import { useResultStore } from '@/utils/stores/result-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, FileText, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { pages } from '@/utils/pages';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResultPage() {
  useCineMode();
  const { analysisResult } = useResultStore();
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) {
      // Redirect back to analysis if there's no result to show
      router.replace(pages.analysis);
    }
  }, [analysisResult, router]);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Logo />
        <div className="flex items-center gap-4">
           <Button variant="outline" asChild className="rounded-full">
              <Link href={pages.analysis}>
                Back to Analysis
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
            <Card className="w-full h-full overflow-y-auto rounded-none border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6" />
                    Analysis Result
                    </CardTitle>
                    <CardDescription>
                    The following is the AI-generated analysis of the MRI scan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ScrollArea className="h-[calc(100vh-220px)] w-full rounded-md border p-4">
                       {analysisResult ? (
                         <p className="text-sm whitespace-pre-wrap">{analysisResult}</p>
                       ) : (
                         <p className="text-sm text-muted-foreground">Loading result...</p>
                       )}
                    </ScrollArea>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Download className="h-4 w-4" /> Export as PDF
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" /> View Full Report
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <MetadataViewerDialog />
    </div>
  );
}
