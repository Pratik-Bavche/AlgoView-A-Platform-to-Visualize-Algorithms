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

// --- Algorithm Logic ---
const generateBubbleSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;
    let sortedIndices = [];

    // Initial State
    steps.push({
        array: [...array],
        comparing: [],
        swapped: false,
        sorted: [],
        description: "Initial state. Ready to start sorting."
    });

    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Compare step
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapped: false,
                sorted: [...sortedIndices],
                description: `Comparing elements at indices ${j} (${array[j]}) and ${j + 1} (${array[j + 1]}).`
            });

            if (array[j] > array[j + 1]) {
                // Swap logic
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                swapped = true;

                // Swap step
                steps.push({
                    array: [...array],
                    comparing: [j, j + 1],
                    swapped: true,
                    sorted: [...sortedIndices],
                    description: `${temp} is greater than ${array[j]}. Swapping them.`
                });
            }
        }

        // Mark the element placed at the end as sorted
        sortedIndices.push(n - i - 1);

        // Add step to show it's sorted
        steps.push({
            array: [...array],
            comparing: [],
            swapped: false,
            sorted: [...sortedIndices],
            description: `${array[n - i - 1]} is now in its correct sorted position.`
        });

        // Optimization: if no swaps, array is sorted
        if (!swapped) {
            // Mark all remaining as sorted
            const remaining = [];
            for (let k = 0; k < n - i - 1; k++) {
                remaining.push(k);
            }
            sortedIndices = [...sortedIndices, ...remaining];
            break;
        }
    }

    // Ensure fully sorted state is captured nicely
    steps.push({
        array: [...array],
        comparing: [],
        swapped: false,
        sorted: [...Array(n).keys()], // All indices sorted
        description: "Array is completely sorted! 🎉"
    });

    return steps;
};


export const Visualizer = () => {
    const { id } = useParams();
    const algorithmName = id ? id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Bubble Sort";

    // --- State ---
    const [inputArray, setInputArray] = useState([15, 8, 20, 5, 12, 3, 18, 10]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50); // 1 = slow, 100 = fast
    const intervalRef = useRef(null);

    // Initialize Logic
    useEffect(() => {
        // Load from local storage if resume
        const savedState = localStorage.getItem(`algoView_${id}`);
        let initialArr = [15, 8, 20, 5, 12, 3, 18, 10];
        let initialStep = 0;

        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.array) initialArr = parsed.array;
                if (parsed.step) initialStep = parsed.step;
            } catch (e) { console.error("Failed to load save", e); }
        }

        setInputArray(initialArr);
        const generatedSteps = generateBubbleSortSteps(initialArr);
        setSteps(generatedSteps);

        // Validate step index
        if (initialStep >= 0 && initialStep < generatedSteps.length) {
            setCurrentStep(initialStep);
        } else {
            setCurrentStep(0);
        }

    }, [id]);

    // Handle Input Change / Reset
    const handleReset = (newArray = null) => {
        setIsPlaying(false);
        const arr = newArray || inputArray;
        const newSteps = generateBubbleSortSteps(arr);
        setSteps(newSteps);
        setCurrentStep(0);
        saveProgress(arr, 0);
    };

    const handleRandomize = () => {
        const check = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
        setInputArray(check);
        handleReset(check);
    };

    // --- Playback Control ---
    useEffect(() => {
        if (isPlaying) {
            const delay = 1000 - (speed * 9); // Speed 50 -> 550ms, Speed 100 -> 100ms
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
    }, [isPlaying, speed, steps.length]);

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
    const stepData = steps[currentStep] || { array: [], comparing: [], sorted: [], description: "Loading..." };

    const getBarColor = (index) => {
        if (stepData.swapped && stepData.comparing.includes(index)) return "bg-purple-500";
        if (stepData.comparing.includes(index)) return "bg-blue-500";
        if (stepData.sorted.includes(index)) return "bg-green-500";
        return "bg-primary/40";
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
                                        backgroundColor: stepData.sorted.includes(idx) ? "#22c55e" : (stepData.comparing.includes(idx) ? (stepData.swapped ? "#a855f7" : "#3b82f6") : "rgba(124, 58, 237, 0.4)")
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
                                    value={[speed]}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                    onValueChange={(val) => setSpeed(val[0])}
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
                                        <span>[{stepData.array[stepData.comparing[0]]}, {stepData.array[stepData.comparing[1]]}]</span>
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
