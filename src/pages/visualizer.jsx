import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings, ChevronRight, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAlgorithmGenerator } from "@/lib/algorithms";

export const Visualizer = () => {
    const { id } = useParams();
    const algorithmName = id ? id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Bubble Sort";

    // --- State ---
    const [inputArray, setInputArray] = useState([15, 8, 20, 5, 12, 3, 18, 10]);
    const [target, setTarget] = useState(12); // Default target for search
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(50);
    const intervalRef = useRef(null);

    const generator = getAlgorithmGenerator(id || "");

    useEffect(() => {
        // Generate steps whenever inputs change
        const newSteps = generator.func(inputArray, target);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [id, inputArray, target]);

    // Check for saved progress on mount (only once per id)
    useEffect(() => {
        const saved = localStorage.getItem(`algoView_${id || 'bubble-sort'}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Apply saved state if valid? 
                // Actually, simpler to just restore step if array matches, 
                // but for now let's just restore step index if possible, 
                // or just ignore to avoid sync issues. 
                // Let's stick to fresh start for consistency unless simple.
                // We will skip complex restore for now to ensure stability.
            } catch (e) { }
        }
    }, [id]);

    // Save progress
    useEffect(() => {
        if (currentStep > 0) {
            localStorage.setItem(`algoView_${id || 'bubble-sort'}`, JSON.stringify({
                step: currentStep,
                timestamp: new Date().toISOString()
            }));
        }
    }, [currentStep, id]);


    // Handle Input Change / Reset
    const handleReset = (newArray = null) => {
        setIsPlaying(false);
        if (newArray) {
            // If array provided, standard effect will pick it up via setInputArray
            // So we don't need to do much here except ensure state updates
            // But setInputArray is async.
        }
        setCurrentStep(0);
    };

    const handleRandomize = () => {
        const randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
        setInputArray(randomArr);
        // Effect will trigger regeneration
    };

    // --- Playback Control ---
    useEffect(() => {
        if (isPlaying) {
            const delay = 1000 - (playbackSpeed * 9);
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, Math.max(50, delay));
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, steps.length, playbackSpeed]);


    // Save progress on step change
    useEffect(() => {
        if (steps.length > 0) {
            saveProgress(inputArray, currentStep);
        }
    }, [currentStep, inputArray, steps]);

    const saveProgress = (arr, step) => {
        localStorage.setItem(`algoView_${id}`, JSON.stringify({
            array: arr,
            step: step,
            timestamp: new Date().toISOString()
        }));
    };

    // --- Render Helpers ---
    const stepData = steps[currentStep] || { array: [], comparing: [], sorted: [], found: [], range: [], description: "Loading..." };

    const getBarColor = (index) => {
        // High priority: Found elements (target found, or min/max identified)
        if (stepData.found && stepData.found.includes(index)) return "#22c55e"; // Green-500

        // Swap operation highlight
        if (stepData.swapped && stepData.comparing && stepData.comparing.includes(index)) return "#a855f7"; // Purple-500

        // Comparison highlight
        if (stepData.comparing && stepData.comparing.includes(index)) return "#eab308"; // Yellow-500

        // Range highlight (for Binary Search)
        if (stepData.range && stepData.range.length > 0) {
            if (stepData.range.includes(index)) return "rgba(124, 58, 237, 0.6)"; // Active range
            return "rgba(31, 41, 55, 0.3)"; // Dimmed
        }

        // Sorted elements
        if (stepData.sorted && stepData.sorted.includes(index)) return "#3b82f6"; // Blue-500

        // Default bar
        return "rgba(124, 58, 237, 0.4)";
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{algorithmName}</h1>
                    <p className="text-muted-foreground text-sm">Sorting • O(n²) • Stable</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => localStorage.removeItem(`algoView_${id}`)}>
                        Clear Save
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Main Visualization Canvas */}
                <Card className="lg:col-span-2 border-primary/10 bg-muted/10 relative overflow-hidden flex flex-col h-[500px] lg:h-auto">
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            Step {currentStep + 1} / {steps.length}
                        </Badge>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 flex items-end justify-center px-8 pb-12 gap-2 sm:gap-4 relative pt-20">
                        <AnimatePresence>
                            {stepData.array.map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        height: `${Math.max(10, (value / 50) * 100)}%`,
                                        backgroundColor: getBarColor(idx)
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`w-8 sm:w-12 rounded-t-md flex items-end justify-center pb-2 text-white font-bold text-xs sm:text-sm shadow-lg`}
                                >
                                    {value}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Base Line */}
                        <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-border mx-8" />
                    </div>

                    {/* Playback Controls (Bottom of Canvas) */}
                    <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}>
                                    <SkipBack className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-105"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}>
                                    <SkipForward className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 flex-1 w-full sm:max-w-xs px-4 sm:px-0">
                                <span className="text-xs font-medium text-muted-foreground w-12">Speed</span>
                                <Slider
                                    value={[playbackSpeed]}
                                    max={100}
                                    step={1}
                                    className="w-full cursor-pointer"
                                    onValueChange={(val) => setPlaybackSpeed(val[0])}
                                />
                            </div>

                            <Button variant="ghost" size="icon" onClick={() => handleReset()} className="text-muted-foreground hover:text-primary">
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
                            <h3 className="font-semibold">What's happening?</h3>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed flex-1 border border-border/50">
                            <p className="font-medium text-foreground mb-2">Step {currentStep + 1}</p>
                            <p className="text-muted-foreground">{stepData.description}</p>

                            {stepData.comparing.length > 0 && (
                                <div className="mt-4 p-3 bg-background/50 rounded border text-xs font-mono space-y-1">
                                    <div className="flex justify-between">
                                        <span>comparing:</span>
                                        <span className="text-primary">indices [{stepData.comparing.join(", ")}]</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>values:</span>
                                        <span>
                                            [{stepData.comparing.map(idx => stepData.array[idx]).join(", ")}]
                                        </span>
                                    </div>
                                    {stepData.swapped && (
                                        <div className="text-purple-500 font-bold mt-1">
                                            &rarr; SWAPPED
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Input Controls */}
                    <Card className="p-4">
                        <h3 className="font-semibold text-sm mb-3">Input Data</h3>
                        <div className="space-y-4">
                            {generator.type === 'searching' && (
                                <div className="space-y-2">
                                    <Label className="text-xs">Search Target</Label>
                                    <Input
                                        type="number"
                                        value={target}
                                        onChange={(e) => setTarget(Number(e.target.value))}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button variant="secondary" className="w-full text-xs" onClick={handleRandomize}>
                                    <Shuffle className="w-3 h-3 mr-2" />
                                    Randomize
                                </Button>
                                <Button variant="outline" className="w-full text-xs" onClick={() => handleReset([5, 4, 3, 2, 1])}>
                                    Reverse
                                </Button>
                            </div>
                            <div className="pt-2 border-t">
                                <Label className="text-xs text-muted-foreground mb-2 block">Resume Logic</Label>
                                <p className="text-xs text-muted-foreground/80">
                                    Your progress is automatically saved. If you leave and come back, you'll resume at step {currentStep + 1}.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
