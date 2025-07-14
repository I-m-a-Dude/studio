'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Loader2, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useAnalysisStore } from '@/stores/analysis-store';

export function SegmentationFAB() {
    const [isSegmenting, setIsSegmenting] = useState(false);
    const { showAnalysisPanel, setShowAnalysisPanel } = useAnalysisStore();

    const handleStartSegmentation = () => {
        setIsSegmenting(true);
        // Simulate segmentation process
        setTimeout(() => {
            setIsSegmenting(false);
        }, 3000); 
    };

    return (
        <TooltipProvider>
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-12 w-12 rounded-full shadow-lg"
                            onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
                            aria-label="Toggle Analysis Panel"
                        >
                            {showAnalysisPanel ? (
                                <PanelRightClose className="h-6 w-6" />
                            ) : (
                                <PanelRightOpen className="h-6 w-6" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{showAnalysisPanel ? 'Close' : 'Open'} Analysis Panel</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-lg"
                            onClick={handleStartSegmentation}
                            disabled={isSegmenting}
                            aria-label="Start Segmentation"
                        >
                            {isSegmenting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Sparkles className="h-6 w-6" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Start AI Segmentation</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
