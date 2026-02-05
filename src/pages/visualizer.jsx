import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronRight, Shuffle, BarChart2, Grid, Circle, Box, MoreVertical, Palette, List, RefreshCcw, CheckCircle2, ArrowRight, Volume2, VolumeX, Languages } from "lucide-react"; // Added Volume icons
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
    DropdownMenuSeparator, // Added Separator
} from "@/components/ui/dropdown-menu";
import { getAlgorithmGenerator } from "@/lib/algorithms";

// Visualizers
import { SortingVisualizer } from "@/components/visualizers/SortingVisualizer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { GridVisualizer } from "@/components/visualizers/GridVisualizer";
import { GreedyVisualizer } from "@/components/visualizers/GreedyVisualizer";
import { BacktrackingVisualizer } from "@/components/visualizers/BacktrackingVisualizer";
import { StringVisualizer } from "@/components/visualizers/StringVisualizer";
import { BitVisualizer } from "@/components/visualizers/BitVisualizer";
import { MathVisualizer } from "@/components/visualizers/MathVisualizer";
import { StackVisualizer } from "@/components/visualizers/StackVisualizer";
import { QueueVisualizer } from "@/components/visualizers/QueueVisualizer";
import { HeapVisualizer } from "@/components/visualizers/HeapVisualizer"
import { LinkedListVisualizer } from "@/components/visualizers/LinkedListVisualizer";
import { SlidingWindowVisualizer } from "@/components/visualizers/SlidingWindowVisualizer";
import { TwoPointerVisualizer } from "@/components/visualizers/TwoPointerVisualizer";
import { MatrixVisualizer } from "@/components/visualizers/MatrixVisualizer";
import { RecursionVisualizer } from "@/components/visualizers/RecursionVisualizer";
import { RealWorldVisualizer } from "@/components/visualizers/RealWorldVisualizer";

const getAlgorithmDescription = (id) => {
    const map = {
        'bubble-sort': {
            en: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. This pass through the list is repeated until the list is sorted.",
            hi: "बबल सॉर्ट बार-बार लिस्ट से गुजरता है, साथ वाले तत्वों की तुलना करता है और अगर वे गलत क्रम में हैं तो उन्हें बदल देता है। यह तब तक किया जाता है जब तक लिस्ट पूरी तरह सॉर्ट न हो जाए।"
        },
        'selection-sort': {
            en: "Selection Sort divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted. It repeatedly finds the minimum element and moves it to the sorted list.",
            hi: "सिलेक्शन सॉर्ट लिस्ट को दो भागों में बांटता है: सॉर्ट किया हुआ और बिना सॉर्ट किया हुआ। यह बार-बार बिना सॉर्ट किए हुए हिस्से से सबसे छोटा तत्व ढूंढता है और उसे सॉर्ट किए हुए हिस्से में ले आता है।"
        },
        'insertion-sort': {
            en: "Insertion Sort builds the final sorted array one item at a time. It iterates through an input element and finds the location it belongs within the sorted list.",
            hi: "इंसर्शन सॉर्ट एक-एक करके तत्वों को उनके सही स्थान पर रखते हुए सॉर्टेड ऐरे बनाता है।"
        },
        'merge-sort': {
            en: "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
            hi: "मर्ज सॉर्ट एक 'डिवाइड और कॉन्कर' एल्गोरिदम है जो पहले ऐरे को दो बराबर हिस्सों में बांटता है, और फिर उन्हें सॉर्ट करके वापस मिला देता है।"
        },
        'quick-sort': {
            en: "Quick Sort is a divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.",
            hi: "क्विक सॉर्ट एक 'डिवाइड और कॉन्कर' एल्गोरिदम है। यह एक तत्व को 'पिवट' चुनता है और बाकी ऐरे को उसके इर्द-गिर्द बांट देता है।"
        },
        'linear-search': {
            en: "Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.",
            hi: "लीनियर सर्च लिस्ट के हर तत्व को एक-एक करके तब तक चेक करता है जब तक कि टारगेट वैल्यू मिल न जाए।"
        },
        'binary-search': {
            en: "Binary Search locates a target value within a sorted array. It compares the target value to the middle element of the array.",
            hi: "बाइनरी सर्च सॉर्ट किए हुए ऐरे में टारगेट वैल्यू ढूंढता है। यह बार-बार ऐरे को आधा करके बीच के तत्व से तुलना करता है।"
        },
        'bfs': {
            en: "Breadth-First Search (BFS) explores all neighbors at the current depth before moving to nodes at the next depth level.",
            hi: "ब्रैड्थ-फर्स्ट सर्च (BFS) अगले स्तर पर जाने से पहले अभी के स्तर के सभी पड़ोसियों की जांच करता है।"
        },
        'dfs': {
            en: "Depth-First Search (DFS) starts at the root node and explores as far as possible along each branch before backtracking.",
            hi: "डेप्थ-फर्स्ट सर्च (DFS) एक शाखा में जितना संभव हो उतना गहरा जाता है और फिर वापस आकर दूसरी शाखा की जांच करता है।"
        },
        'reverse-array': {
            en: "Reversing an array involves swapping elements from outside in.",
            hi: "ऐरे पलटना मतलब बाहर से अंदर की ओर तत्वों को आपस में बदलना।"
        },
        'two-sum': {
            en: "Finds two numbers that sum up to a target value.",
            hi: "दो ऐसी संख्याएं ढूंढता है जिनका योग टारगेट वैल्यू के बराबर हो।"
        }
    };

    const desc = map[id] || {
        en: "Visualization logic for this algorithm is simulated or under development. It demonstrates the expected behavior.",
        hi: "इस एल्गोरिदम के लिए विज़ुअलाइज़ेशन अभी विकास के चरण में है। यह अपेक्षित व्यवहार को दर्शाता है।"
    };
    return desc;
};

export const Visualizer = () => {
    const { id } = useParams();
    const generator = getAlgorithmGenerator(id || "");
    const algorithmName = id ? id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Bubble Sort";

    // --- State ---
    const [inputArray, setInputArray] = useState([15, 8, 20, 5, 12, 3, 18, 10]);
    const [target, setTarget] = useState(12); // Default target for search
    const [targetString, setTargetString] = useState("abc"); // Default pattern
    const [mainString, setMainString] = useState("abcdef"); // Default text
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(30);
    const [isReversed, setIsReversed] = useState(false);
    const [viewMode, setViewMode] = useState('default'); // 'bars', 'dots', 'numbers', 'block', 'list'
    const [rawInput, setRawInput] = useState(generator.type === 'graph' ? "A-B, B-C, C-D, D-A, A-C" : inputArray.join(", "));
    const [rotationDirection, setRotationDirection] = useState('right');
    const [rotationK, setRotationK] = useState(1);

    // --- Voice & Language State ---
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'

    // Refs
    const intervalRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Handle String vs Array vs Bit vs Generic Inputs for Step Generation
        let newSteps = [];
        if (generator.type === 'string') {
            newSteps = generator.func(mainString, targetString);
        } else if (generator.type === 'bit') {
            if (id === 'single-number') {
                newSteps = generator.func(inputArray);
            } else {
                newSteps = generator.func(target, targetString);
            }
        } else if (generator.type === 'stack' || generator.type === 'queue' || generator.type === 'heap' || generator.type === 'linked-list' || generator.type === 'sliding-window' || generator.type === 'two-pointer' || generator.type === 'matrix' || generator.type === 'recursion' || generator.type === 'real-world') {
            if (generator.type === 'recursion' || generator.type === 'real-world') {
                newSteps = generator.func(target);
            } else if (generator.type === 'matrix' || generator.type === 'two-pointer') {
                newSteps = generator.func(inputArray, target);
            } else if (id === 'valid-parentheses' || generator.type === 'sliding-window') {
                if (id === 'max-sum-subarray-of-size-k' || id === 'max-sum-sub-') {
                    newSteps = generator.func(inputArray);
                } else {
                    newSteps = generator.func(mainString, targetString);
                }
            } else {
                newSteps = generator.func(inputArray);
            }
        } else if (generator.type === 'graph') {
            newSteps = generator.func(rawInput);
        } else {
            newSteps = generator.func(inputArray, id === 'rotate-array' ? rotationK : target, id === 'rotate-array' ? rotationDirection : undefined);
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsReversed(false);
        if (!['string', 'bit', 'recursion', 'real-world', 'graph'].includes(generator.type)) setRawInput(inputArray.join(", "));
    }, [id, inputArray, target, mainString, targetString, rawInput, rotationDirection, rotationK]);

    // Set default view mode and inputs based on type/id
    useEffect(() => {
        if (generator.type === 'sorting') setViewMode('bars');
        else if (generator.type === 'array' || generator.type === 'searching') setViewMode('block');
        else setViewMode('default');

        // Update defaults for specific algorithms
        if (id === 'valid-parentheses' && (mainString === 'abcdef' || mainString === 'algoview')) {
            setMainString('()[]{}({})');
        }
        if (['naive-search', 'kmp-search', 'rabin-karp'].includes(id) && targetString === 'algo') {
            setTargetString('algo'); // This is fine
        }
    }, [id, generator.type]);

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
            // Keep max 12
            localStorage.setItem(key, JSON.stringify(recent.slice(0, 12)));
        } catch (e) {
            console.error("Failed to update recent", e);
        }
    }, [id, algorithmName]);

    // --- Voice Logic ---
    useEffect(() => {
        // Stop speech if disabled OR if not playing (only if we want it to stop on pause)
        if (!isSpeechEnabled || !isPlaying || !steps[currentStep]) {
            window.speechSynthesis.cancel();
            return;
        }

        const step = steps[currentStep];
        let textToSpeak = "";

        if (typeof step.description === 'object') {
            textToSpeak = step.description[language] || step.description['en'];
        } else {
            textToSpeak = step.description;
        }

        if (textToSpeak) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            utterance.rate = 0.9;

            utterance.onend = () => {
                if (isPlaying && isSpeechEnabled) {
                    setTimeout(() => {
                        setCurrentStep(prev => {
                            if (prev < steps.length - 1) return prev + 1;
                            setIsPlaying(false);
                            return prev;
                        });
                    }, 800);
                }
            };

            window.speechSynthesis.speak(utterance);
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [currentStep, isSpeechEnabled, language, steps, isPlaying]);

    // Handle Input Change / Reset
    const handleReset = (newInput = null) => {
        setIsPlaying(false);
        if (newInput) {
            if (generator.type === 'graph') {
                setRawInput(newInput);
            } else if (Array.isArray(newInput)) {
                setInputArray(newInput);
            }
        }
        setCurrentStep(0);
    };

    const handleRandomize = () => {
        if (generator.type === 'string') {
            const words = ["algorithm", "visualization", "anagram", "palindrome", "substring", "searching", "sorting", "pattern"];
            const res = words[Math.floor(Math.random() * words.length)];
            setMainString(res);
            if (id === 'anagram-check') {
                setTargetString(res.split('').sort(() => Math.random() - 0.5).join(''));
            } else if (['naive-search', 'kmp-search', 'rabin-karp'].includes(id)) {
                setTargetString(res.substring(1, 4));
            }
            return;
        }
        if (generator.type === 'bit') {
            if (id === 'single-number') {
                const base = [1, 2, 3, 4];
                const arr = [...base, ...base, Math.floor(Math.random() * 20) + 10].sort(() => Math.random() - 0.5);
                setInputArray(arr);
                setRawInput(arr.join(", "));
                return;
            }
            const r1 = Math.floor(Math.random() * 50) + 1;
            const r2 = Math.floor(Math.random() * 10) + 1;
            setTarget(r1);
            setTargetString(r2.toString());
            return;
        }
        if (generator.type === 'stack' || generator.type === 'queue' || generator.type === 'heap' || generator.type === 'linked-list' || generator.type === 'sliding-window' || generator.type === 'two-pointer') {
            if (id === 'valid-parentheses' || id === 'longest-substring-without-repeating-characters' || id === 'longest-substr' || id === 'minimum-window-substring' || id === 'min-window') {
                setMainString("abcabcbb");
                setTargetString("abc");
            } else if (generator.type === 'two-pointer') {
                let randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1).sort((a, b) => a - b);
                setInputArray(randomArr);
                setRawInput(randomArr.join(", "));
                setTarget(15);
            } else {
                let randomArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1);
                setInputArray(randomArr);
                setRawInput(randomArr.join(", "));
            }
            return;
        }
        if (generator.type === 'math') {
            const r1 = Math.floor(Math.random() * 100) + 10;
            const r2 = Math.floor(Math.random() * 20) + 2;
            setTarget(r1);
            setTargetString(r2.toString());
            return;
        }
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
            handleReset([...inputArray].sort((a, b) => b - a));
        }
    };

    // --- Playback Control ---
    useEffect(() => {
        // If speech is enabled and playing, we don't use the interval
        // because the 'onend' event of SpeechSynthesisUtterance handles the next step.
        if (isPlaying && !isSpeechEnabled) {
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
    }, [isPlaying, steps.length, playbackSpeed, isSpeechEnabled]);

    const saveProgress = (data, step) => {
        localStorage.setItem(`algoView_${id}`, JSON.stringify({
            data: data,
            step: step,
            timestamp: new Date().toISOString()
        }));
    };

    // Save progress on step change
    useEffect(() => {
        if (steps.length > 0) {
            saveProgress(generator.type === 'string' ? mainString : inputArray, currentStep);
        }
    }, [currentStep, inputArray, mainString, steps, generator.type, saveProgress]);

    // --- Render Helpers ---
    const stepData = steps[currentStep] || {
        array: [],
        comparing: [],
        sorted: [],
        found: [],
        range: [],
        // Graph/Grid Placeholders
        nodes: [],
        edges: [],
        grid: [],
        // Backtracking placeholders
        currentPath: [],
        options: [],
        // String placeholders
        text: [],
        pattern: [],
        indices: {},
        patternIndices: {},
        textPointers: [],
        patternPointers: [],
        type: '',
        n: 0,
        description: "Loading..."
    };

    // Helper to get current description based on language
    const currentDescription = typeof stepData.description === 'object'
        ? (stepData.description[language] || stepData.description['en'])
        : stepData.description;

    // Determine which visualizer to use
    const renderVisualizer = () => {
        switch (generator.type) {
            case 'sorting':
                return <SortingVisualizer stepData={stepData} viewMode={viewMode} />;
            case 'searching':
            case 'array':
                return <ArrayVisualizer stepData={stepData} viewMode={viewMode} />;
            case 'graph':
                if (id?.toLowerCase().includes('floyd')) return <GridVisualizer stepData={stepData} />;
                return <GraphVisualizer stepData={stepData} />;
            case 'tree':
                return <GraphVisualizer stepData={stepData} />;
            case 'dp': // DP often uses tables/grids
                return <GridVisualizer stepData={stepData} />;
            case 'greedy':
                return <GreedyVisualizer stepData={stepData} />;
            case 'backtracking':
                return <BacktrackingVisualizer stepData={stepData} />;
            case 'bit':
                return <BitVisualizer stepData={stepData} />;
            case 'math':
                return <MathVisualizer stepData={stepData} />;
            case 'stack':
                return <StackVisualizer stepData={stepData} />;
            case 'queue':
                return <QueueVisualizer stepData={stepData} />;
            case 'heap':
                return <HeapVisualizer stepData={stepData} />;
            case 'linked-list':
                return <LinkedListVisualizer stepData={stepData} />;
            case 'sliding-window':
                return <SlidingWindowVisualizer stepData={stepData} />;
            case 'two-pointer':
                return <TwoPointerVisualizer stepData={stepData} />;
            case 'matrix':
                return <MatrixVisualizer stepData={stepData} />;
            case 'recursion':
                return <RecursionVisualizer stepData={stepData} />;
            case 'real-world':
                return <RealWorldVisualizer stepData={stepData} />;
            case 'string':
                return <StringVisualizer stepData={stepData} />;
            default:
                // Fallback to ArrayVisualizer for now as it's the safest generic view
                return <ArrayVisualizer stepData={stepData} viewMode={viewMode} />;
        }
    };

    return (
        <div className="min-h-full lg:h-[calc(100vh-8rem)] flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{algorithmName}</h1>
                    <p className="text-muted-foreground text-sm">
                        {generator.type === 'sorting' && 'Sorting • O(n²) • Stable (Visualization)'}
                        {generator.type === 'searching' && 'Searching • O(log n) • Iterative'}
                        {generator.type === 'array' && 'Array Logic • Index Manipulation'}
                        {generator.type === 'graph' && 'Graph Traversal • Nodes & Edges'}
                        {generator.type === 'backtracking' && 'Backtracking • Recursion • Grid'}
                        {generator.type === 'greedy' && 'Greedy Strategy • Optimization'}
                        {generator.type === 'string' && 'String Processing • Pointers • Matching'}
                        {generator.type === 'stack' && 'Stack • LIFO • O(1) Operations'}
                        {generator.type === 'queue' && 'Queue • FIFO • O(1) Operations'}
                        {generator.type === 'heap' && 'Heap • Priority Queue • O(log n)'}
                        {generator.type === 'linked-list' && 'Linked List • Dynamic Data Structure • O(n)'}
                        {generator.type === 'sliding-window' && 'Sliding Window • Optimized Subarray • O(n)'}
                        {generator.type === 'two-pointer' && 'Two Pointer • Array Optimization • O(n)'}
                        {generator.type === 'matrix' && 'Matrix Traversal • Grid Optimization • O(nm)'}
                        {generator.type === 'recursion' && 'Recursion • Call Stack • Base Cases'}
                        {generator.type === 'real-world' && 'Real-World Simulation • System Optimization'}
                        {generator.type === 'math' && 'Mathematics • Number Theory • Visualization'}
                        {!['sorting', 'searching', 'array', 'graph', 'backtracking', 'greedy', 'string', 'stack', 'math', 'queue', 'heap', 'linked-list', 'sliding-window', 'two-pointer', 'matrix', 'recursion', 'real-world'].includes(generator.type) && 'Algorithm Visualization'}
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {/* Voice & Lang Controls */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 min-w-[100px] justify-between transition-all"
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    >
                        <div className="flex items-center gap-2">
                            <Languages className="w-3 h-3 text-primary" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                {language === 'en' ? 'English' : 'हिंदी'}
                            </span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${language === 'en' ? 'bg-primary' : 'bg-orange-500'} animate-pulse`} />
                    </Button>
                    <div className="flex items-center bg-muted/50 rounded-md p-1 border shrink-0 ml-1">
                        <div className="w-[1px] h-4 bg-border mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 hover:bg-transparent shrink-0 ${isSpeechEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                            title={isSpeechEnabled ? "Mute Voice" : "Enable Voice Explanation"}
                        >
                            {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* View Mode Selector */}
                    {(generator.type === 'sorting' || generator.type === 'array' || generator.type === 'searching') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    {viewMode === 'bars' && <BarChart2 className="w-4 h-4" />}
                                    {viewMode === 'rainbow' && <Palette className="w-4 h-4" />}
                                    {viewMode === 'dots' && <Circle className="w-4 h-4" />}
                                    {viewMode === 'numbers' && <Box className="w-4 h-4" />}
                                    {viewMode === 'block' && <Grid className="w-4 h-4" />}
                                    {viewMode === 'list' && <List className="w-4 h-4" />}
                                    {viewMode === 'circular' && <RefreshCcw className="w-4 h-4" />}
                                    <span className="capitalize">{viewMode} View</span>
                                    <MoreVertical className="w-3 h-3 text-muted-foreground ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {generator.type === 'sorting' && (
                                    <>
                                        <DropdownMenuItem onClick={() => setViewMode('bars')} className="cursor-pointer">
                                            <BarChart2 className="w-4 h-4 mr-2" /> Bars
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setViewMode('rainbow')} className="cursor-pointer hidden sm:flex">
                                            <Palette className="w-4 h-4 mr-2" /> Rainbow
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setViewMode('dots')} className="cursor-pointer hidden sm:flex">
                                            <Circle className="w-4 h-4 mr-2" /> Dots
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setViewMode('numbers')} className="cursor-pointer">
                                            <Box className="w-4 h-4 mr-2" /> Numbers
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {(generator.type === 'array' || generator.type === 'searching') && (
                                    <>
                                        <DropdownMenuItem onClick={() => setViewMode('block')} className="cursor-pointer">
                                            <Grid className="w-4 h-4 mr-2" /> Blocks
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Main Visualization Canvas */}
                <Card className="lg:col-span-2 border-primary/10 bg-muted/10 relative overflow-hidden flex flex-col min-h-[400px] sm:min-h-[500px] lg:h-auto shadow-inner">
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            Step {currentStep + 1} / {steps.length}
                        </Badge>
                    </div>

                    {/* Canvas Area */}
                    <div ref={containerRef} className="flex-1 flex px-4 pb-4 pt-16 relative min-h-0 overflow-hidden items-center justify-center">
                        {renderVisualizer()}
                    </div>

                    {/* Playback Controls (Bottom of Canvas) */}
                    <div className="p-4 border-t bg-card/50 backdrop-blur-sm z-20">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}>
                                    <SkipBack className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-105"
                                    onClick={() => {
                                        if (!isPlaying && currentStep >= steps.length - 1) {
                                            setCurrentStep(0);
                                            setIsPlaying(true);
                                        } else {
                                            setIsPlaying(!isPlaying);
                                        }
                                    }}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}>
                                    <SkipForward className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-3 flex-1 w-full sm:max-w-xs px-2 sm:px-0">
                                <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider w-14 shrink-0 ${isSpeechEnabled ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
                                    {isSpeechEnabled ? 'Voice sync' : 'Speed'}
                                </span>
                                <Slider
                                    value={[isSpeechEnabled ? 15 : playbackSpeed]}
                                    max={100}
                                    step={1}
                                    disabled={isSpeechEnabled}
                                    className={`w-full ${isSpeechEnabled ? 'opacity-40' : 'cursor-pointer'}`}
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
                        <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed flex-1 border border-border/50 overflow-y-auto">

                            {currentStep === 0 && !isPlaying ? (
                                <div className="space-y-3">
                                    <p className="font-medium text-foreground">{algorithmName}</p>
                                    <p className="text-muted-foreground">
                                        {getAlgorithmDescription(id)[language] || getAlgorithmDescription(id)['en']}
                                    </p>
                                    <div className="text-xs text-muted-foreground mt-4 pt-4 border-t flex flex-col gap-3">
                                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md border">
                                            <div className="flex items-center gap-2">
                                                <Volume2 className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-semibold text-[10px] uppercase">Voice Explanation</span>
                                            </div>
                                            <Button
                                                variant={isSpeechEnabled ? "primary" : "outline"}
                                                size="sm"
                                                className="h-7 px-3 text-[10px]"
                                                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                                            >
                                                {isSpeechEnabled ? "Enabled" : "Disabled"}
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md border">
                                            <div className="flex items-center gap-2">
                                                <Languages className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-semibold text-[10px] uppercase text-muted-foreground">Select Language</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 text-[10px] gap-2 font-bold min-w-[80px]"
                                                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                                            >
                                                {language === 'en' ? 'English' : 'हिंदी'}
                                                <div className={`w-1.5 h-1.5 rounded-full ${language === 'en' ? 'bg-primary' : 'bg-orange-500'}`} />
                                            </Button>
                                        </div>
                                        <p className="mt-2 text-[11px]">
                                            Click <span className="font-bold text-primary">Play</span> to start the visualization and hear the explanation.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-medium text-foreground mb-2">Step {currentStep + 1}</p>
                                    <p className="text-muted-foreground">{currentDescription}</p>

                                    {currentStep === steps.length - 1 && steps.length > 1 && (
                                        <div className="mt-6 pt-6 border-t border-primary/10 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="flex items-center gap-2 text-primary">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="font-bold uppercase tracking-wider text-xs">Final Result</span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                                    <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1 tracking-tight">Input</div>
                                                    <div className="font-mono text-sm break-all">
                                                        {generator.type === 'string' ? mainString :
                                                            generator.type === 'graph' ? rawInput :
                                                                generator.type === 'bit' ? (id === 'single-number' ? inputArray.join(", ") : `${target}${targetString ? `, ${targetString}` : ''}`) :
                                                                    generator.type === 'math' ? `${target}${targetString ? `, ${targetString}` : ''}` :
                                                                        inputArray.join(", ")}
                                                    </div>
                                                </div>

                                                <div className="flex justify-center -my-2 opacity-30">
                                                    <ArrowRight className="w-4 h-4 rotate-90" />
                                                </div>

                                                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                                                    <div className="text-[10px] uppercase text-primary/70 font-semibold mb-1 tracking-tight">Final Output</div>
                                                    <div className="font-bold text-sm text-primary">
                                                        {(() => {
                                                            const lastStep = steps[steps.length - 1];
                                                            if (generator.type === 'sorting') return lastStep.array.join(", ");
                                                            if (generator.type === 'searching') {
                                                                return lastStep.found && lastStep.found.length > 0 ? `Found at index ${lastStep.found[0]}` : "Not Found";
                                                            }
                                                            if (id === 'find-max-min') {
                                                                const minVal = Math.min(...inputArray);
                                                                const maxVal = Math.max(...inputArray);
                                                                return `Min: ${minVal} • Max: ${maxVal}`;
                                                            }
                                                            if (id === 'reverse-array' || id === 'rotate-array' || id === 'move-zeros') return lastStep.array.join(", ");
                                                            if (id === 'two-sum' || id === 'two-sum-sorted' || id === 'pair-sum-sorted') {
                                                                return lastStep.found && lastStep.found.length > 0 ? `Values found at indices [${lastStep.found.join(", ")}]` : "No pair found";
                                                            }
                                                            if (id === 'count-set-bits') return lastStep.description.match(/\d+$/)?.[0] || "Completed";
                                                            if (id === 'palindrome-check') return lastStep.description.toLowerCase().includes('is a palindrome') ? "Palindrome" : "Not a Palindrome";
                                                            if (id === 'anagram-check') return lastStep.description.toLowerCase().includes('are anagrams') ? "Anagram Match" : "Not Anagrams";

                                                            // Generic fallback to description if it's short, or a "Completed" message
                                                            const desc = lastStep.description;
                                                            if (desc.length < 50) return desc;
                                                            return "Algorithm Executed Successfully";
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-[10px] h-8 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                                onClick={() => handleReset()}
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Run Again
                                            </Button>
                                        </div>
                                    )}

                                    {stepData.comparing && stepData.comparing.length > 0 && generator.type !== 'graph' && generator.type !== 'string' && (
                                        <div className="mt-4 p-3 bg-background/50 rounded border text-xs font-mono space-y-1">
                                            <div className="flex justify-between">
                                                <span>comparing:</span>
                                                <span className="text-primary">indices [{stepData.comparing.join(", ")}]</span>
                                            </div>
                                            {(stepData.array && stepData.comparing) && (
                                                <div className="flex justify-between">
                                                    <span>values:</span>
                                                    <span>
                                                        [{stepData.comparing.map(idx => stepData.array[idx] !== undefined ? stepData.array[idx] : '?').join(", ")}]
                                                    </span>
                                                </div>
                                            )}
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
                            {generator.type === 'string' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Text / Main String</Label>
                                        <Input
                                            value={mainString}
                                            onChange={(e) => setMainString(e.target.value)}
                                            className="h-8 text-sm font-mono"
                                            placeholder="Enter text..."
                                        />
                                    </div>
                                    {['naive-search', 'kmp-search', 'rabin-karp', 'anagram-check'].includes(id) && (
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                {id === 'anagram-check' ? 'Anagram String' : 'Pattern to Search'}
                                            </Label>
                                            <Input
                                                value={targetString}
                                                onChange={(e) => setTargetString(e.target.value)}
                                                className="h-8 text-sm font-mono"
                                                placeholder="Enter pattern..."
                                            />
                                        </div>
                                    )}
                                </>
                            ) : generator.type === 'bit' ? (
                                <>
                                    {id !== 'single-number' ? (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Value (Decimal)</Label>
                                                <Input
                                                    type="number"
                                                    value={target}
                                                    onChange={(e) => setTarget(Number(e.target.value))}
                                                    className="h-8 text-sm font-mono"
                                                />
                                            </div>
                                            {['bitwise-and', 'bitwise-or', 'bitwise-xor', 'left-shift', 'right-shift'].includes(id) && (
                                                <div className="space-y-2">
                                                    <Label className="text-xs">
                                                        {['left-shift', 'right-shift'].includes(id) ? 'Shift Amount' : 'Second Value'}
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={targetString}
                                                        onChange={(e) => setTargetString(e.target.value)}
                                                        className="h-8 text-sm font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label className="text-xs">Array (paired elements + 1 unique)</Label>
                                            <Input
                                                value={rawInput}
                                                onChange={(e) => setRawInput(e.target.value)}
                                                onBlur={() => {
                                                    const arr = rawInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
                                                    if (arr.length > 0) {
                                                        setInputArray(arr);
                                                        handleReset(arr);
                                                    }
                                                }}
                                                className="h-8 text-sm font-mono"
                                                placeholder="e.g. 1, 2, 2, 1, 3"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : generator.type === 'math' ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                {['gcd', 'lcm', 'modular-exponentiation'].includes(id) ? 'First Number (a)' : 'Number (n) / Limit'}
                                            </Label>
                                            <Input
                                                type="number"
                                                value={target}
                                                onChange={(e) => setTarget(Number(e.target.value))}
                                                className="h-8 text-sm font-mono"
                                            />
                                        </div>
                                        {['gcd', 'lcm', 'modular-exponentiation'].includes(id) && (
                                            <div className="space-y-2">
                                                <Label className="text-xs">
                                                    {id === 'modular-exponentiation' ? 'Exponent (e)' : 'Second Number (b)'}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={targetString}
                                                    onChange={(e) => setTargetString(e.target.value)}
                                                    className="h-8 text-sm font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (generator.type === 'stack' || generator.type === 'queue' || generator.type === 'heap' || generator.type === 'linked-list' || generator.type === 'sliding-window' || generator.type === 'two-pointer') ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                {(id === 'longest-substring-without-repeating-characters' || id === 'longest-substr' || id === 'minimum-window-substring' || id === 'min-window') ? 'Input String' : 'Array (comma separated)'}
                                            </Label>
                                            <Input
                                                value={(id === 'longest-substring-without-repeating-characters' || id === 'longest-substr' || id === 'minimum-window-substring' || id === 'min-window') ? mainString : rawInput}
                                                onChange={(e) => {
                                                    if ((id === 'longest-substring-without-repeating-characters' || id === 'longest-substr' || id === 'minimum-window-substring' || id === 'min-window')) {
                                                        setMainString(e.target.value);
                                                    } else {
                                                        setRawInput(e.target.value);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!(id === 'longest-substring-without-repeating-characters' || id === 'longest-substr' || id === 'minimum-window-substring' || id === 'min-window')) {
                                                        const arr = rawInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
                                                        if (arr.length > 0) handleReset(arr);
                                                    }
                                                }}
                                                className="h-8 text-sm font-mono"
                                            />
                                        </div>
                                        {(id === 'pair-sum-sorted' || id === 'two-sum-sorted' || generator.type === 'recursion') && (
                                            <div className="space-y-2">
                                                <Label className="text-xs">
                                                    {generator.type === 'recursion' ? 'Number (n)' : 'Target Sum'}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={target}
                                                    onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                                                    className="h-8 text-sm font-mono"
                                                />
                                            </div>
                                        )}
                                        {(id === 'minimum-window-substring' || id === 'min-window') && (
                                            <div className="space-y-2">
                                                <Label className="text-xs">Target Characters</Label>
                                                <Input
                                                    value={targetString}
                                                    onChange={(e) => setTargetString(e.target.value)}
                                                    className="h-8 text-sm font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : generator.type === 'graph' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Graph Edges (u-v or u-v:w)</Label>
                                        <Input
                                            value={rawInput}
                                            onChange={(e) => setRawInput(e.target.value)}
                                            onBlur={() => handleReset(rawInput)}
                                            className="h-8 text-sm font-mono"
                                            placeholder="e.g. A-B, B-C:5, C-A"
                                        />
                                        <p className="text-[10px] text-muted-foreground opacity-70 italic">
                                            Format: Node1-Node2:Weight (Weight is optional)
                                        </p>
                                    </div>
                                </>
                            ) : id === 'rotate-array' ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Array to Rotate</Label>
                                            <Input
                                                value={rawInput}
                                                onChange={(e) => setRawInput(e.target.value)}
                                                onBlur={() => {
                                                    const arr = rawInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
                                                    if (arr.length > 0) handleReset(arr);
                                                }}
                                                className="h-8 text-sm font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Rotation Direction & Count</Label>
                                            <div className="flex gap-2">
                                                <div className="grid grid-cols-2 gap-2 flex-1">
                                                    <Button
                                                        variant={rotationDirection === 'left' ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            setRotationDirection('left');
                                                            handleReset();
                                                        }}
                                                        className="h-8 gap-2"
                                                    >
                                                        <SkipBack className="w-3 h-3" />
                                                        Left
                                                    </Button>
                                                    <Button
                                                        variant={rotationDirection === 'right' ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            setRotationDirection('right');
                                                            handleReset();
                                                        }}
                                                        className="h-8 gap-2"
                                                    >
                                                        <SkipForward className="w-3 h-3" />
                                                        Right
                                                    </Button>
                                                </div>
                                                <div className="w-20">
                                                    <Input
                                                        type="number"
                                                        value={rotationK}
                                                        min={1}
                                                        max={inputArray.length}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 1;
                                                            setRotationK(val);
                                                            handleReset();
                                                        }}
                                                        className="h-8 text-sm text-center font-mono"
                                                        placeholder="k"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground opacity-70 italic">
                                                Rotate the array {rotationK} time(s) to the {rotationDirection}.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Array (comma separated)</Label>
                                        <Input
                                            value={rawInput}
                                            onChange={(e) => setRawInput(e.target.value)}
                                            onBlur={() => {
                                                const arr = rawInput.split(',').map(s => {
                                                    const trimmed = s.trim();
                                                    const num = Number(trimmed);
                                                    return isNaN(num) || trimmed === "" ? trimmed : num;
                                                }).filter(val => val !== "");
                                                if (arr.length > 0) handleReset(arr);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const arr = rawInput.split(',').map(s => {
                                                        const trimmed = s.trim();
                                                        const num = Number(trimmed);
                                                        return isNaN(num) || trimmed === "" ? trimmed : num;
                                                    }).filter(val => val !== "");
                                                    if (arr.length > 0) handleReset(arr);
                                                }
                                            }}
                                            className="h-8 text-sm font-mono"
                                            placeholder="e.g. 10, 20 or A, B, C"
                                        />
                                    </div>
                                    {(generator.type === 'searching' || generator.type === 'greedy') && (
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                {generator.type === 'searching' && 'Search Target'}
                                                {id === 'coin-change-greedy' && 'Target Amount'}
                                                {id === 'frac-knapsack' && 'Knapsack Capacity'}
                                                {!['searching', 'coin-change-greedy', 'frac-knapsack'].includes(id || '') && 'Target Value'}
                                            </Label>
                                            <Input
                                                value={target}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const num = Number(val);
                                                    setTarget(isNaN(num) || val === "" ? val : num);
                                                }}
                                                className="h-8 text-sm"
                                                placeholder="Target value..."
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex gap-2">
                                <Button variant="secondary" className="w-full text-xs" onClick={handleRandomize}>
                                    <Shuffle className="w-3 h-3 mr-2" />
                                    Randomize
                                </Button>
                                {['sorting', 'searching', 'array'].includes(generator.type) && (
                                    <Button
                                        variant="outline"
                                        className={`w-full text-xs ${isReversed ? "border-blue-500 bg-blue-500/10 text-blue-500" : ""}`}
                                        onClick={toggleReverseMode}
                                        title={isReversed ? "Disable Worst-Case Mode" : "Enable Worst-Case Mode (Sorts Descending)"}
                                    >
                                        Reverse Order
                                    </Button>
                                )}
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
            </div >
        </div >
    );
};
