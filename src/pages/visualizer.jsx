import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronRight, Shuffle, BarChart2, Grid, Circle, Box, MoreVertical, Palette, List, RefreshCcw } from "lucide-react";
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
        'n-queens': "The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.",
        'bfs': "Breadth-First Search (BFS) explores the neighbor nodes first, before moving to the next level neighbors.",
        'activity-selection': "Activity Selection Problem uses a greedy strategy to find the maximum number of non-overlapping activities.",
        'coin-change-greedy': "Greedy Coin Change tries to find the minimum number of coins by always picking the largest possible coin denomination.",
        'frac-knapsack': "Fractional Knapsack problem determines which items to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.",
        'matrix-chain': "Matrix Chain Multiplication is an optimization problem that finds the most efficient way to multiply a given sequence of matrices.",
        'dp-on-trees': "DP on Trees techniques are used to solve problems on tree structures, such as finding the Maximum Independent Set or Diameter, by using post-order traversal.",
        'sudoku-solver': "Backtracking algorithm to fill a 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all digits from 1 to 9.",
        'rat-in-a-maze': "Finds a path from the start to the destination in a maze with walls using backtracking to explore all possible routes.",
        'permutations': "Generates all possible arrangements of a set of items where the order matters.",
        'subsets': "Generates all possible subsets (the power set) of a given set of items.",
        'combinations': "Generates all possible groups of size k from a set of n items where order does not matter.",
        'word-search': "Determines if a target word exists in a grid of characters by moving horizontally or vertically.",
        'palindrome': "A palindrome is a word, phrase, or sequence that reads the same backward as forward. This algorithm checks for palindromic symmetry.",
        'palindrome-check': "A palindrome is a word, phrase, or sequence that reads the same backward as forward. This algorithm checks for palindromic symmetry.",
        'anagram': "An anagram is a word or phrase formed by rearranging the letters of a different word or phrase. We use a frequency map to verify this efficiently.",
        'anagram-check': "An anagram is a word or phrase formed by rearranging the letters of a different word or phrase. We use a frequency map to verify this efficiently.",
        'naive-search': "Naive String Searching aligns the pattern with all possible positions in the text and checks for matches character by character.",
        'kmp-algo': "The Knuth-Morris-Pratt (KMP) algorithm improves on naive search by using information about partial matches to avoid unnecessary re-checks.",
        'kmp-search': "The Knuth-Morris-Pratt (KMP) algorithm improves on naive search by using information about partial matches to avoid unnecessary re-checks.",
        'rabin-karp': "Rabin-Karp uses rolling hashes to find a pattern in a text. If hashes match, it performs a character-by-character check.",
        'count-set-bits': "Algorithm to count the number of 1s (set bits) in the binary representation of a number. Also known as population count or Hamming weight.",
        'power-of-two': "A number is a power of two if it has exactly one bit set to 1 in its binary representation. We can check this efficiently using 'n & (n-1)'.",
        'bitwise-and': "Commonly used to check if a bit is set or to mask certain bits. Result is 1 only if both corresponding bits are 1.",
        'bitwise-or': "Commonly used to set specific bits. Result is 1 if at least one corresponding bit is 1.",
        'bitwise-xor': "Exclusive OR is used in various tricks, like swapping numbers without a temp variable or finding the unique number in a pair-filled array.",
        'bitwise-not': "Flips all bits of a number. In our 8-bit visualization, 0 becomes 1 and 1 becomes 0.",
        'left-shift': "Shifting bits to the left effectively multiplies the number by 2 for each position shifted. Vacant spots on the right are filled with 0.",
        'right-shift': "Shifting bits to the right effectively divides the number by 2 (floor) for each position shifted.",
        'single-number': "Find the element that appears only once in an array where every other element appears twice, using XOR properties (x ^ x = 0).",
        'prime-check': "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. We use trial division to verify this.",
        'prime-number-check': "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. We use trial division up to the square root.",
        'sieve-of-eratosthenes': "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit by iteratively marking the multiples of each prime.",
        'gcd': "The Greatest Common Divisor (GCD) of two numbers is the largest positive integer that divides both numbers. We use the efficient Euclidean algorithm.",
        'lcm': "The Least Common Multiple (LCM) is the smallest positive integer that is divisible by both a and b. It's calculated using the GCD formula.",
        'modular-exponentiation': "Modular exponentiation is a type of exponentiation performed over a modulus. It's efficiently computed using binary exponentiation.",
        'modular-exp-': "Modular exponentiation is a type of exponentiation performed over a modulus. It's efficiently computed using binary exponentiation.",
        'valid-parentheses': "Checks if a string of brackets is valid by matching opening and closing symbols using a LIFO stack.",
        'next-greater-element': "Finds the first greater element to the right for every array element using a monotonic stack.",
        'next-greater': "Finds the first greater element to the right for every array element using a monotonic stack.",
        'min-stack': "A stack that supports push, pop, top, and retrieving the minimum element in constant time.",
        'stack-implementation': "Basic stack operations demonstrating PUSH (adding to top) and POP (removing from top) behavior.",
        'implementation': "Basic stack operations demonstrating PUSH (adding to top) and POP (removing from top) behavior.",
        'sieve': "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit by iteratively marking the multiples of each prime.",
        'gcd---lcm': "The Greatest Common Divisor (GCD) of two numbers is the largest positive integer that divides both numbers. We use the efficient Euclidean algorithm.",
        'queue-implementation': "Basic Queue operations demonstrating FIFO (First In, First Out) behavior with ENQUEUE and DEQUEUE.",
        'circular-queue': "A circular buffer that connects the end back to the beginning to efficiently reuse space. Uses modulo arithmetic.",
        'queue-using-stack': "Implementing a Queue using two Stacks. One stack for incoming elements and another for outgoing elements to maintain FIFO order.",
        'max-heap-implementation': "Visualizes the construction of a Max-Heap where हर parent node is greater than its children.",
        'min-heap-implementation': "Visualizes the construction of a Min-Heap where every parent node is smaller than its children.",
        'k-largest-smallest': "Finding the K largest or smallest elements using a heap of size K.",
        'heap-sort-algo': "An efficient comparison-based sorting algorithm that uses a heap data structure to sort elements.",
        'median-stream': "Maintains a min-heap and a max-heap to find the median of a continuous stream of numbers in O(1).",
        'merge-k-lists': "Merge K sorted linked lists efficiently using a Min-Heap of size K.",
        'top-k-frequent': "Find the K most frequent elements in an array using a frequency map and a heap.",
        'reverse-linked-list': "Reverses the direction of pointers in a singly linked list so that the tail becomes the head.",
        'detect-loop-floyd-s-': "Uses Floyd's Cycle-Finding algorithm (slow and fast pointers) to detect if a cycle exists in the list.",
        'middle-of-linked-list': "Finds the middle node of a linked list using the two-pointer technique in a single pass.",
        'remove-n-th-node': "Removes the N-th node from the end of a linked list by maintaining a specific gap between two pointers.",
        'intersection': "Finds the node where two singly linked lists intersect by aligning their starting positions based on length difference."
    };
    return map[id] || "Visualization logic for this algorithm is simulated or under development. It demonstrates the expected behavior.";
};

export const Visualizer = () => {
    const { id } = useParams();
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
    const [rawInput, setRawInput] = useState(inputArray.join(", "));

    // Refs
    const intervalRef = useRef(null);
    const containerRef = useRef(null);

    const generator = getAlgorithmGenerator(id || "");

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
        } else {
            newSteps = generator.func(inputArray, target);
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
        if (!['string', 'bit', 'recursion', 'real-world'].includes(generator.type)) setRawInput(inputArray.join(", "));
    }, [id, inputArray, target, mainString, targetString]);

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

    // Handle Input Change / Reset
    const handleReset = (newArray = null) => {
        setIsPlaying(false);
        if (newArray) {
            setInputArray(newArray);
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

    // Determine which visualizer to use
    const renderVisualizer = () => {
        switch (generator.type) {
            case 'sorting':
                return <SortingVisualizer stepData={stepData} viewMode={viewMode} />;
            case 'searching':
            case 'array':
                return <ArrayVisualizer stepData={stepData} viewMode={viewMode} />;
            case 'graph':
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
                                    <DropdownMenuItem onClick={() => setViewMode('rainbow')} className="cursor-pointer">
                                        <Palette className="w-4 h-4 mr-2" /> Rainbow
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode('dots')} className="cursor-pointer">
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
                        <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed flex-1 border border-border/50 overflow-y-auto">

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
                                {generator.type !== 'string' && generator.type !== 'bit' && (
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
