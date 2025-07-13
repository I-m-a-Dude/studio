'use client';

import { useViewStore, type ViewAxis } from '@/stores/view-store';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BrainCircuit,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Layers,
  Box,
  AreaChart,
  LineChart,
} from 'lucide-react';
import { useMriStore } from '@/stores/mri-store';

export function SegmentationControls() {
  const {
    slice,
    maxSlices,
    axis,
    zoom,
    setSlice,
    setAxis,
    zoomIn,
    zoomOut,
    resetView,
  } = useViewStore();

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
          Interact with the MRI scan and adjust view properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger disabled={isDisabled}>View Controls</AccordionTrigger>
            <AccordionContent className="space-y-6">
              <div className="space-y-3">
                <Label>Slice Navigation</Label>
                 <Slider
                    value={[slice]}
                    onValueChange={(value) => setSlice(value[0])}
                    max={maxSlices[axis] > 0 ? maxSlices[axis] - 1 : 0}
                    step={1}
                    disabled={isDisabled}
                  />
                <Tabs value={axis} onValueChange={(value) => setAxis(value as ViewAxis)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="axial" disabled={isDisabled}>Axial</TabsTrigger>
                    <TabsTrigger value="sagittal" disabled={isDisabled}>Sagittal</TabsTrigger>
                    <TabsTrigger value="coronal" disabled={isDisabled}>Coronal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-3">
                <Label>Zoom & Pan</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1" onClick={zoomIn} disabled={isDisabled}>
                    <ZoomIn />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1" onClick={zoomOut} disabled={isDisabled}>
                    <ZoomOut />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1" disabled={isDisabled}>
                    <Move />
                  </Button>
                </div>
              </div>
               <div className="space-y-3">
                <Label>Orientation</Label>
                 <Button variant="outline" className="w-full" onClick={resetView} disabled={isDisabled}>
                   <RotateCcw className="mr-2 h-4 w-4" /> Reset View
                 </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
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
          <AccordionItem value="item-3">
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
