'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Loader2 } from 'lucide-react';

export function SegmentationFAB() {
    const [isSegmenting, setIsSegmenting] = useState(false);

    const handleStartSegmentation = () => {
        setIsSegmenting(true);
        // Simulate segmentation process
        setTimeout(() => {
            setIsSegmenting(false);
        }, 3000); 
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        className="absolute bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
                        onClick={handleStartSegmentation}
                        disabled={isSegmenting}
                        aria-label="Start Segmentation"
                    >
                        {isSegmenting ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Start Segmentation</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
