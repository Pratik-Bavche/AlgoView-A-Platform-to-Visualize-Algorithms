import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export const Visualizer = () => {
    const { id } = useParams();
    const algorithmName = id ? id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Algorithm";

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(10);
    const [speed, setSpeed] = useState(50);

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{algorithmName}</h1>
                    <p className="text-muted-foreground text-sm">Graph Algorithm • Weighted • Directed</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Main Visualization Canvas */}
                <Card className="lg:col-span-2 border-primary/10 bg-muted/10 relative overflow-hidden flex flex-col">
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            Step {currentStep + 1} / {totalSteps}
                        </Badge>
                    </div>

                    {/* Canvas Placeholder */}
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg w-full h-full flex items-center justify-center text-muted-foreground">
                            Visualization Canvas Area
                        </div>
                    </div>

                    {/* Playback Controls (Bottom of Canvas) */}
                    <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
                                    <SkipBack className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-105"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}>
                                    <SkipForward className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 flex-1 max-w-xs">
                                <span className="text-xs font-medium text-muted-foreground w-12">Speed</span>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                    onValueChange={(val) => setSpeed(val[0])}
                                />
                            </div>

                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Sidebar Info Panel */}
                <div className="flex flex-col gap-4">
                    {/* Explanation Card */}
                    <Card className="flex-1 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-primary/10 rounded-md">
                                <ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="font-semibold">Current Step</h3>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 text-sm leading-relaxed flex-1">
                            <p>The algorithm is currently inititalizing the distance to all nodes as infinity, except for the source node which is set to 0.</p>
                            <div className="mt-4 p-2 bg-background rounded border font-mono text-xs text-muted-foreground">
                                dist[source] = 0;<br />
                                for (v in V) dist[v] = ∞;
                            </div>
                        </div>
                    </Card>

                    {/* Data/Variable Watch */}
                    <Card className="h-1/3 p-4">
                        <h3 className="font-semibold text-sm mb-3">Variables</h3>
                        <div className="space-y-2">
                            <div className="flexjustify-between text-sm border-b pb-2">
                                <span className="text-muted-foreground">Unvisited</span>
                                <span className="font-mono">{`{A, B, C, D, E}`}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                                <span className="text-muted-foreground">Current</span>
                                <span className="font-mono text-primary font-bold">A (Source)</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
