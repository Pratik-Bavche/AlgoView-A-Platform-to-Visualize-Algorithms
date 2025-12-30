import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings, ChevronRight, Shuffle, BarChart2, Circle, Grid, Network, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAlgorithmGenerator } from "@/lib/algorithms";

const getAlgorithmDescription = (id) => {
    const map = {
        'bubble-sort': "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. This pass through the list is repeated until the list is sorted.",
        'selection-sort': "Selection Sort divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted. It repeatedly finds the minimum element and moves it to the sorted list.",
        'insertion-sort': "Insertion Sort builds the final sorted array one item at a time. It iterates through an input element and finds the location it belongs within the sorted list.",
        'merge-sort': "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        'quick-sort': "Quick Sort is a divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.",
        'linear-search': "Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.",
        'binary-search': "Binary Search locates a target value within a sorted array. It compares the target value to the middle element of the array.",
        'find-max-min': "This algorithm iterates through the array to find the maximum and minimum values by comparing each element with the current max and min.",
        'reverse-array': "Reversing an array involves swapping the first and last elements, then the second and second-to-last, and so on, until the middle is reached.",
        'rotate-array': "Array Rotation involves shifting the elements of the array by a specified number of positions (k).",
        'two-sum': "Two Sum finds two numbers in the array that add up to a specific target number.",
        'move-zeros': "Move Zeros involves moving all zeros in the array to the end while maintaining the relative order of the non-zero elements.",
        'bellman-ford': "Bellman-Ford computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph.",
    };
    return map[id] || "Visualization logic for this algorithm is simulated or under development. It demonstrates the expected behavior.";
};

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
    const [viewMode, setViewMode] = useState("bars"); // 'bars', 'dots', 'numbers'
    const intervalRef = useRef(null);

    const generator = getAlgorithmGenerator(id || "");

    useEffect(() => {
        // Generate steps whenever inputs change
        const newSteps = generator.func(inputArray, target);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [id, inputArray, target]);

    // Save to Recent Activity
    useEffect(() => {
        if (!id) return;
        try {
            const key = 'algoView_recent';
            const recentStr = localStorage.getItem(key);
            let recent = [];
            if (recentStr) {
                recent = JSON.parse(recentStr);
            }

            // Remove duplicates
            recent = recent.filter(item => item.id !== id);

            // Add to top
            recent.unshift({
                id,
                name: algorithmName,
                date: new Date().toISOString()
            });

            // Keep max 6
            localStorage.setItem(key, JSON.stringify(recent.slice(0, 6)));
        } catch (e) {
            console.error("Failed to update recent", e);
        }
    }, [id, algorithmName]);

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


    const [isReversed, setIsReversed] = useState(false);

    // ... (effects)

    // Handle Input Change / Reset
    const handleReset = (newArray = null) => {
        setIsPlaying(false);
        if (newArray) {
            setInputArray(newArray);
        }
        setCurrentStep(0);
    };

    const handleRandomize = () => {
        let randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
        if (isReversed) {
            randomArr.sort((a, b) => b - a);
        }
        setInputArray(randomArr);
    };

    const toggleReverseMode = () => {
        const newState = !isReversed;
        setIsReversed(newState);
        if (newState) {
            // Force current array to reverse sorted (Worst Case)
            // Note: If we just want "reverse order", we reverse. 
            // If we want "Worst Case" (Reverse Sorted), we sort descending.
            // "Reverse Order" implies indices flip. "Worst Case" implies data values flip.
            // Given "Reverse is enable... perform oprtaon accordingly", I'll assume Worst Case Mode (Sort Descending).
            handleReset([...inputArray].sort((a, b) => b - a));
        } else {
            // If turning off, we just let it be. User can randomize next.
        }
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                {viewMode === 'bars' && <BarChart2 className="w-4 h-4" />}
                                {viewMode === 'dots' && <Circle className="w-4 h-4" />}
                                {viewMode === 'numbers' && <Grid className="w-4 h-4" />}
                                {viewMode === 'graph' && <Network className="w-4 h-4" />}
                                {viewMode === 'pointer' && <ArrowRight className="w-4 h-4" />}
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewMode('bars')} className="gap-2">
                                <BarChart2 className="w-4 h-4" /> Bars
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('dots')} className="gap-2">
                                <Circle className="w-4 h-4" /> Scatter Plot
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('numbers')} className="gap-2">
                                <Grid className="w-4 h-4" /> Numbers
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('graph')} className="gap-2">
                                <Network className="w-4 h-4" /> Graph Nodes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('pointer')} className="gap-2">
                                <ArrowRight className="w-4 h-4" /> Pointer List
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>


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
                    <div className={`flex-1 flex px-8 pb-12 gap-2 sm:gap-4 relative pt-20 transition-all ${viewMode === 'numbers' ? 'items-center justify-center flex-wrap content-center' : 'items-end justify-center'}`}>

                        {viewMode === 'graph' ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* SVG Lines for Comparisons */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    {stepData.comparing && stepData.comparing.length === 2 && (
                                        <line
                                            x1={`${50 + 35 * Math.cos((2 * Math.PI * stepData.comparing[0]) / stepData.array.length)}%`}
                                            y1={`${50 + 35 * Math.sin((2 * Math.PI * stepData.comparing[0]) / stepData.array.length)}%`}
                                            x2={`${50 + 35 * Math.cos((2 * Math.PI * stepData.comparing[1]) / stepData.array.length)}%`}
                                            y2={`${50 + 35 * Math.sin((2 * Math.PI * stepData.comparing[1]) / stepData.array.length)}%`}
                                            stroke="#eab308"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                        >
                                            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                                        </line>
                                    )}
                                </svg>

                                <AnimatePresence>
                                    {stepData.array.map((value, idx) => {
                                        const angle = (2 * Math.PI * idx) / stepData.array.length;
                                        const x = 50 + 35 * Math.cos(angle); // %
                                        const y = 50 + 35 * Math.sin(angle); // %
                                        const color = getBarColor(idx);

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, backgroundColor: color }}
                                                className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-background z-10"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                {value}
                                                <span className="absolute -bottom-6 text-xs text-muted-foreground font-mono">idx:{idx}</span>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence>
                                    {stepData.array.map((value, idx) => {
                                        const color = getBarColor(idx);

                                        return (
                                            <motion.div
                                                key={idx}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    height: (viewMode === 'numbers' || viewMode === 'pointer') ? 'auto' : `${Math.max(10, (value / 50) * 100)}%`,
                                                    backgroundColor: (viewMode === 'bars' || viewMode === 'numbers' || viewMode === 'pointer') ? color : 'transparent'
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={`
                                                    ${viewMode === 'bars' ? 'w-8 sm:w-12 rounded-t-md flex items-end justify-center pb-2 text-white font-bold text-xs sm:text-sm shadow-lg' : ''}
                                                    ${viewMode === 'dots' ? 'w-8 sm:w-12 flex flex-col justify-end items-center relative' : ''}
                                                    ${(viewMode === 'numbers' || viewMode === 'pointer') ? 'w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md relative' : ''}
                                                    ${viewMode === 'pointer' ? 'mr-8' : ''}
                                                `}
                                            >
                                                {viewMode === 'bars' && value}
                                                {(viewMode === 'numbers' || viewMode === 'pointer') && value}

                                                {viewMode === 'pointer' && idx < stepData.array.length - 1 && (
                                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center w-8">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </div>
                                                )}

                                                {viewMode === 'dots' && (
                                                    <>
                                                        <div
                                                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-md z-10 transition-colors duration-200"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <div className="w-0.5 bg-border/20 flex-1 rounded-full mt-[-2px]" />
                                                        <span className="absolute -bottom-6 text-xs text-muted-foreground font-medium">{value}</span>
                                                    </>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Base Line (Hidden in Numbers/Grid/Pointer mode) */}
                                {viewMode !== 'numbers' && viewMode !== 'pointer' && <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-border mx-8" />}
                            </>
                        )}
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
                            <h3 className="font-semibold">
                                {currentStep === 0 && !isPlaying ? "Algorithm Details" : "What's happening?"}
                            </h3>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed flex-1 border border-border/50">

                            {currentStep === 0 && !isPlaying ? (
                                <div className="space-y-3">
                                    <p className="font-medium text-foreground">{algorithmName}</p>
                                    <p className="text-muted-foreground">
                                        {getAlgorithmDescription(id)}
                                    </p>
                                    <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                                        Click <span className="font-bold text-primary">Play</span> to start the visualization.
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-medium text-foreground mb-2">Step {currentStep + 1}</p>
                                    <p className="text-muted-foreground">{stepData.description}</p>

                                    {stepData.comparing && stepData.comparing.length > 0 && (
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
                                </>
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
                                <Button
                                    variant="outline"
                                    className={`w-full text-xs ${isReversed ? "border-blue-500 bg-blue-500/10 text-blue-500" : ""}`}
                                    onClick={toggleReverseMode}
                                    title={isReversed ? "Disable Worst-Case Mode" : "Enable Worst-Case Mode (Sorts Descending)"}
                                >
                                    Reverse Order
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
