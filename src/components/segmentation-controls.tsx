'use client';

import { useViewStore } from '@/stores/view-store';
import { useAnalysisStore } from '@/stores/analysis-store';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  BrainCircuit,
  Layers,
  Box,
  AreaChart,
  LineChart,
} from 'lucide-react';
import { useMriStore } from '@/stores/mri-store';

export function SegmentationControls() {
  const { axis } = useViewStore();

  const {
    multiPlanarView,
    threeDReconstruction,
    showHistogram,
    showProfileCurves,
    setMultiPlanarView,
    setThreeDReconstruction,
    setShowHistogram,
    setShowProfileCurves,
  } = useAnalysisStore();

  const file = useMriStore(state => state.file);
  const isDisabled = !file;

  return (
    <Card className="w-full h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          Analysis
        </CardTitle>
        <CardDescription>
          Adjust image properties and run advanced analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger disabled={isDisabled}>Image Adjustments</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-4">
                    <Label>Windowing</Label>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Contrast</Label>
                            <div className="flex items-center gap-2">
                                <Slider defaultValue={[50]} max={100} step={1} disabled={isDisabled} />
                                <Input type="number" defaultValue={50} className="w-20 h-8" disabled={isDisabled}/>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Brightness</Label>
                            <div className="flex items-center gap-2">
                                <Slider defaultValue={[50]} max={100} step={1} disabled={isDisabled}/>
                                <Input type="number" defaultValue={50} className="w-20 h-8" disabled={isDisabled}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Slice Thickness</Label>
                     <div className="flex items-center gap-2">
                        <Slider defaultValue={[1]} min={1} max={10} step={0.5} disabled={isDisabled} />
                        <Input type="number" defaultValue={1} min={1} max={10} step={0.5} className="w-20 h-8" disabled={isDisabled}/>
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger disabled={isDisabled}>Advanced Analysis</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="mpr-switch" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Multi-planar View
                    </Label>
                    <Switch id="mpr-switch" checked={multiPlanarView} onCheckedChange={setMultiPlanarView} disabled={isDisabled}/>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="3d-switch" className="flex items-center gap-2">
                        <Box className="h-4 w-4" /> 3D Reconstruction
                    </Label>
                    <Switch id="3d-switch" checked={threeDReconstruction} onCheckedChange={setThreeDReconstruction} disabled={isDisabled}/>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowHistogram(!showHistogram)} disabled={isDisabled}>
                    <AreaChart className="h-4 w-4" /> Show Histogram
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowProfileCurves(!showProfileCurves)} disabled={isDisabled}>
                    <LineChart className="h-4 w-4" /> Show Profile Curves
                </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
