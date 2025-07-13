'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Play, Eye, EyeOff, BrainCircuit, Loader2 } from 'lucide-react';

export function SegmentationControls() {
    const [isSegmenting, setIsSegmenting] = useState(false);
    const [showSegmentation, setShowSegmentation] = useState(true);
    const [threshold, setThreshold] = useState([50]);

    const handleStartSegmentation = () => {
        setIsSegmenting(true);
        setTimeout(() => {
            setIsSegmenting(false);
        }, 3000); // Simulate segmentation process
    };

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
            <Label>Actions</Label>
            <Button className="w-full" onClick={handleStartSegmentation} disabled={isSegmenting}>
                {isSegmenting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Play className="mr-2 h-4 w-4" />
                )}
                {isSegmenting ? 'Segmenting...' : 'Start Segmentation'}
            </Button>
        </div>

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

        <div className="space-y-4">
            <Label htmlFor="threshold">Segmentation Threshold</Label>
             <div className="p-3 bg-muted/50 rounded-md space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                </div>
                <Slider
                    id="threshold"
                    value={threshold}
                    onValueChange={setThreshold}
                    max={100}
                    step={1}
                />
                <div className="text-center font-mono text-primary">{threshold[0]}</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
