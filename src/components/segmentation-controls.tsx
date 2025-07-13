'use client';

import { useAnalysisStore } from '@/stores/analysis-store';
import {
  Box,
  BrainCircuit,
  Layers,
  AreaChart,
  LineChart,
  GitCompareArrows,
  Film,
  Download,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useMriStore } from '@/stores/mri-store';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HistogramChart } from './histogram-chart';
import { ProfileCurveChart } from './profile-curve-chart';

export function SegmentationControls() {
  const {
    multiPlanarView,
    threeDReconstruction,
    showHistogram,
    showProfileCurves,
    brightness,
    contrast,
    setMultiPlanarView,
    setThreeDReconstruction,
    setShowHistogram,
    setShowProfileCurves,
    setBrightness,
    setContrast,
  } = useAnalysisStore();

  const file = useMriStore((state) => state.file);
  const isDisabled = !file;
  
  const handleContrastSliderChange = (value: number[]) => {
    setContrast(value[0]);
  };
  
  const handleContrastInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setContrast(Math.max(0, Math.min(100, value)));
    }
  };

  const handleBrightnessSliderChange = (value: number[]) => {
    setBrightness(value[0]);
  };

  const handleBrightnessInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
     if (!isNaN(value)) {
      setBrightness(Math.max(0, Math.min(100, value)));
    }
  };


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
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Image Adjustments</h3>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <Label>Windowing</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Contrast</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[contrast]}
                      onValueChange={handleContrastSliderChange}
                      max={100}
                      step={1}
                      disabled={isDisabled}
                    />
                    <Input
                      type="number"
                      value={contrast}
                      onChange={handleContrastInputChange}
                      className="w-20 h-8"
                      disabled={isDisabled}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Brightness</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[brightness]}
                      onValueChange={handleBrightnessSliderChange}
                      max={100}
                      step={1}
                      disabled={isDisabled}
                    />
                    <Input
                      type="number"
                      value={brightness}
                      onChange={handleBrightnessInputChange}
                      className="w-20 h-8"
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Slice Thickness</Label>
              <div className="flex items-center gap-2">
                <Slider
                  defaultValue={[1]}
                  min={1}
                  max={10}
                  step={0.5}
                  disabled={isDisabled}
                />
                <Input
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-20 h-8"
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="font-semibold">Advanced Analysis</h3>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mpr-switch" className="flex items-center gap-2">
                <Layers className="h-4 w-4" /> Multi-planar View
              </Label>
              <Switch
                id="mpr-switch"
                checked={multiPlanarView}
                onCheckedChange={setMultiPlanarView}
                disabled={isDisabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="3d-switch" className="flex items-center gap-2">
                <Box className="h-4 w-4" /> 3D Reconstruction
              </Label>
              <Switch
                id="3d-switch"
                checked={threeDReconstruction}
                onCheckedChange={setThreeDReconstruction}
                disabled={isDisabled}
              />
            </div>
            <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowHistogram(!showHistogram)}
                  disabled={isDisabled}
                >
                  <AreaChart className="h-4 w-4" /> Show Histogram
                </Button>
                {showHistogram && (
                  <div className="h-40 w-full p-2 border rounded-md">
                    <HistogramChart />
                  </div>
                )}
            </div>
             <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowProfileCurves(!showProfileCurves)}
                  disabled={isDisabled}
                >
                  <LineChart className="h-4 w-4" /> Show Profile Curves
                </Button>
                 {showProfileCurves && (
                  <div className="h-40 w-full p-2 border rounded-md">
                    <ProfileCurveChart />
                  </div>
                )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="font-semibold">Tools</h3>
          <div className="space-y-4 pt-4">
            <Button variant="outline" className="w-full justify-start gap-2" disabled={isDisabled}>
                <GitCompareArrows className="h-4 w-4" /> Study Comparison
            </Button>
            <div className="flex items-center justify-between">
              <Label htmlFor="cine-switch" className="flex items-center gap-2">
                <Film className="h-4 w-4" /> Cine Mode
              </Label>
              <Switch
                id="cine-switch"
                disabled={isDisabled}
              />
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2" disabled={isDisabled}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem>PNG</DropdownMenuItem>
                <DropdownMenuItem>PDF with measurements</DropdownMenuItem>
                <DropdownMenuItem>DICOM</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="w-full justify-start gap-2" disabled={isDisabled}>
                <FileText className="h-4 w-4" /> Metadata Viewer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
