'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
  FlipHorizontal,
} from 'lucide-react';

type ViewMode = 'axial' | 'sagittal' | 'coronal';

export function SegmentationControls() {
  const [viewMode, setViewMode] = useState<ViewMode>('axial');

  return (
    <Card className="w-full h-full">
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
            <AccordionTrigger>View Controls</AccordionTrigger>
            <AccordionContent className="space-y-6">
              <div className="space-y-3">
                <Label>Slice Navigation</Label>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="axial">Axial</TabsTrigger>
                    <TabsTrigger value="sagittal">Sagittal</TabsTrigger>
                    <TabsTrigger value="coronal">Coronal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-3">
                <Label>Zoom & Pan</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <ZoomIn />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <ZoomOut />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Move />
                  </Button>
                </div>
              </div>
               <div className="space-y-3">
                <Label>Orientation</Label>
                 <Button variant="outline" className="w-full">
                   <RotateCcw className="mr-2 h-4 w-4" /> Reset View
                 </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Image Adjustments</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-3">
                    <Label>Windowing (Contrast/Brightness)</Label>
                    <div className="space-y-2">
                        <Slider defaultValue={[50]} max={100} step={1} />
                        <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Slice Thickness</Label>
                    <Slider defaultValue={[1]} min={1} max={10} step={0.5} />
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Advanced Analysis</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="mpr-switch" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Multi-planar View
                    </Label>
                    <Switch id="mpr-switch" />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="3d-switch" className="flex items-center gap-2">
                        <Box className="h-4 w-4" /> 3D Reconstruction
                    </Label>
                    <Switch id="3d-switch" />
                </div>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <AreaChart className="h-4 w-4" /> Show Histogram
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <LineChart className="h-4 w-4" /> Show Profile Curves
                </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
