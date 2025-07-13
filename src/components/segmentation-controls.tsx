'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, BrainCircuit } from 'lucide-react';

export function SegmentationControls() {
    const [showSegmentation, setShowSegmentation] = useState(true);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            Analysis & Segmentation
        </CardTitle>
        <CardDescription>
            Control the automated segmentation process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <Label>Display Options</Label>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2">
                    {showSegmentation ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    <span className="font-medium">Show Segmentation</span>
                </div>
                <Switch
                    checked={showSegmentation}
                    onCheckedChange={setShowSegmentation}
                    aria-label="Toggle segmentation visibility"
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
