import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Search, Sparkles, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Dashboard = () => {
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };



    const handleVisualize = (algo) => {
        navigate(`/visualize/${algo.toLowerCase().replace(/['\s/]/g, '-')}`);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            handleVisualize(searchQuery);
        }
    };
    const [activeCategory, setActiveCategory] = useState("Array");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const algorithmCategories = {
        "Array": {
            common: [
                { name: "Reverse Array", desc: "Reverse elements in place", complexity: "O(n)" },
                { name: "Find max/min", desc: "Find largest and smallest elements", complexity: "O(n)" },
                { name: "Rotate Array", desc: "Shift elements by k positions", complexity: "O(n)" },
                { name: "Two Sum", desc: "Find pair with given sum", complexity: "O(n)" },
                { name: "Move Zeros", desc: "Move all zeros to end", complexity: "O(n)" },
                { name: "Remove Duplicates", desc: "Remove duplicates from sorted array", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Max Subarray", desc: "Kadane's Algorithm", complexity: "O(n)" },
                { name: "Merge Intervals", desc: "Merge overlapping intervals", complexity: "O(n log n)" },
                { name: "Subarray Sum", desc: "Find subarray with given sum", complexity: "O(n)" },
                { name: "Rain Water", desc: "Trapping rain water problem", complexity: "O(n)" },
                { name: "Product Array", desc: "Product of array except self", complexity: "O(n)" },
            ]
        },
        "Sorting": {
            common: [
                { name: "Bubble Sort", desc: "Simple comparison-based sorting", complexity: "O(n²)" },
                { name: "Selection Sort", desc: "Selects smallest element repeatedly", complexity: "O(n²)" },
                { name: "Insertion Sort", desc: "Builds sorted array one item at a time", complexity: "O(n²)" },
            ],
            advanced: [
                { name: "Merge Sort", desc: "Stable, divide-and-conquer sorting", complexity: "O(n log n)" },
                { name: "Quick Sort", desc: "Efficient divide-and-conquer sorting", complexity: "O(n log n)" },
                { name: "Heap Sort", desc: "Binary heap-based sorting", complexity: "O(n log n)" },
                { name: "Counting Sort", desc: "Integer sorting within range", complexity: "O(n+k)" },
                { name: "Radix Sort", desc: "Digit-based sorting algorithm", complexity: "O(nk)" },
            ]
        },
        "Searching": {
            common: [
                { name: "Linear Search", desc: "Sequentially checks each element", complexity: "O(n)" },
                { name: "Binary Search", desc: "Search in sorted array", complexity: "O(log n)" },
            ],
            advanced: [
                { name: "Rotated Search", desc: "Search in rotated sorted array", complexity: "O(log n)" },
                { name: "First/Last Occur.", desc: "Find boundary of element", complexity: "O(log n)" },
                { name: "Binary w/ Answer", desc: "Optimize problems using BS", complexity: "O(log n)" },
                { name: "Infinite Search", desc: "Search in infinite sorted array", complexity: "O(log n)" },
            ]
        },
        "Tree": {
            common: [
                { name: "Traversals", desc: "Inorder, Preorder, Postorder", complexity: "O(n)" },
                { name: "Height", desc: "Maximum depth of tree", complexity: "O(n)" },
                { name: "Count Nodes", desc: "Count total nodes / leaves", complexity: "O(n)" },
            ],
            advanced: [
                { name: "LCA", desc: "Lowest Common Ancestor", complexity: "O(n)" },
                { name: "Diameter", desc: "Longest path between two nodes", complexity: "O(n²)" },
                { name: "Balanced Check", desc: "Check if tree is balanced", complexity: "O(n)" },
                { name: "Tree to DLL", desc: "Flatten binary tree to list", complexity: "O(n)" },
                { name: "AVL Rotations", desc: "Self-balancing operations", complexity: "O(1)" },
            ]
        },
        "Graph": {
            common: [
                { name: "BFS", desc: "Breadth-First Search traversal", complexity: "O(V+E)" },
                { name: "DFS", desc: "Depth-First Search traversal", complexity: "O(V+E)" },
                { name: "Connected Comp.", desc: "Find all connected subgraphs", complexity: "O(V+E)" },
            ],
            advanced: [
                { name: "Cycle Detect", desc: "Detect cycle in graph", complexity: "O(V+E)" },
                { name: "Topological Sort", desc: "Linear ordering of vertices", complexity: "O(V+E)" },
                { name: "Bipartite Check", desc: "Check if graph is 2-colorable", complexity: "O(V+E)" },
                { name: "SCC", desc: "Strongly Connected Components", complexity: "O(V+E)" },
            ]
        },
        "Shortest Path": {
            common: [
                { name: "BFS Path", desc: "Shortest path (unweighted)", complexity: "O(V+E)" },
                { name: "Dijkstra", desc: "Shortest path (weighted)", complexity: "O((V+E)logV)" },
            ],
            advanced: [
                { name: "Bellman-Ford", desc: "Negative cycle detection", complexity: "O(VE)" },
                { name: "Floyd–Warshall", desc: "All-pairs shortest path", complexity: "O(V³)" },
                { name: "Multi-Source", desc: "Shortest path from multiple sources", complexity: "O(V+E)" },
            ]
        },
        "MST": {
            common: [
                { name: "Prim's Algo", desc: "Builds MST from arbitrary node", complexity: "O(E log V)" },
            ],
            advanced: [
                { name: "Kruskal's", desc: "Builds MST by adding edges", complexity: "O(E log E)" },
                { name: "Union-Find", desc: "DSU based implementation", complexity: "O(E α(V))" },
                { name: "MST Constraints", desc: "MST with edge inclusions", complexity: "O(E log E)" },
            ]
        },
        "Dynamic Prog.": {
            common: [
                { name: "Fibonacci (DP)", desc: "Calculates Fib numbers", complexity: "O(n)" },
                { name: "Climbing Stairs", desc: "Ways to reach top", complexity: "O(n)" },
                { name: "Coin Change", desc: "Min coins for value (Basic)", complexity: "O(nW)" },
            ],
            advanced: [
                { name: "0/1 Knapsack", desc: "Maximize value with weight limit", complexity: "O(nW)" },
                { name: "LCS", desc: "Longest Common Subsequence", complexity: "O(nm)" },
                { name: "LIS", desc: "Longest Increasing Subsequence", complexity: "O(n²)" },
                { name: "Matrix Chain", desc: "Optimal multiplication order", complexity: "O(n³)" },
                { name: "DP on Trees", desc: "Optimization on tree structures", complexity: "O(n)" },
            ]
        },
        "Greedy": {
            common: [
                { name: "Activity Selection", desc: "Max non-overlapping activities", complexity: "O(n log n)" },
                { name: "Coin Change", desc: "Greedy approach", complexity: "O(V)" },
            ],
            advanced: [
                { name: "Job Sequencing", desc: "Max profit with deadlines", complexity: "O(n²)" },
                { name: "Huffman Coding", desc: "Lossless compression", complexity: "O(n log n)" },
                { name: "Frac. Knapsack", desc: "Maximize value (fractional)", complexity: "O(n log n)" },
            ]
        },
        "Backtracking": {
            common: [
                { name: "Permutations", desc: "Generate all permutations", complexity: "O(n!)" },
                { name: "Subsets", desc: "Generate all subsets", complexity: "O(2^n)" },
                { name: "Combinations", desc: "Generate k-combinations", complexity: "O(C(n,k))" },
            ],
            advanced: [
                { name: "N-Queens", desc: "Place N queens safely", complexity: "O(N!)" },
                { name: "Sudoku Solver", desc: "Fill 9x9 grid", complexity: "Exponential" },
                { name: "Rat in a Maze", desc: "Find path in maze", complexity: "O(2^N²)" },
                { name: "Word Search", desc: "Find word in grid", complexity: "Exponential" },
            ]
        },
        "String": {
            common: [
                { name: "Reverse String", desc: "In-place reversal", complexity: "O(n)" },
                { name: "Palindrome", desc: "Check if palindrome", complexity: "O(n)" },
                { name: "Anagram", desc: "Check if anagrams", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Longest Palin.", desc: "Longest Palindromic Substring", complexity: "O(n²)" },
                { name: "KMP Algo", desc: "Pattern search (Prefix)", complexity: "O(n+m)" },
                { name: "Rabin-Karp", desc: "Rolling hash search", complexity: "O(n+m)" },
                { name: "Z-Algorithm", desc: "Pattern matching improvement", complexity: "O(n+m)" },
            ]
        },
        "Bit Manip.": {
            common: [
                { name: "Count Set Bits", desc: "Number of 1s", complexity: "O(log n)" },
                { name: "Power of Two", desc: "Check if power of 2", complexity: "O(1)" },
                { name: "Bitwise Ops", desc: "AND, OR, XOR basics", complexity: "O(1)" },
            ],
            advanced: [
                { name: "Single Number", desc: "Find element appearing once", complexity: "O(n)" },
                { name: "Bit Masking", desc: "Subset generation using masks", complexity: "O(1)" },
                { name: "Subsets via Bits", desc: "Generate power set", complexity: "O(2^n)" },
            ]
        },
        "Math": {
            common: [
                { name: "Prime Check", desc: "Check primality", complexity: "O(√n)" },
                { name: "GCD / LCM", desc: "Euclidean algorithm", complexity: "O(log(min(a,b)))" },
            ],
            advanced: [
                { name: "Sieve", desc: "Find primes up to n", complexity: "O(n log log n)" },
                { name: "Modular Exp.", desc: "Compute (a^b)%c", complexity: "O(log b)" },
                { name: "Chinese Remainder", desc: "Solve modular equations", complexity: "O(k log n)" },
            ]
        },
        "Stack": {
            common: [
                { name: "Valid Parentheses", desc: "Check balanced brackets", complexity: "O(n)" },
                { name: "Implementation", desc: "Basic stack operations", complexity: "O(1)" },
            ],
            advanced: [
                { name: "Next Greater", desc: "Find next greater element", complexity: "O(n)" },
                { name: "Histogram Area", desc: "Largest rectangle in histogram", complexity: "O(n)" },
                { name: "Min Stack", desc: "Stack with O(1) getMin", complexity: "O(1)" },
            ]
        },
        "Queue": {
            common: [
                { name: "Implementation", desc: "Basic queue operations", complexity: "O(1)" },
                { name: "Circular Queue", desc: "Ring buffer implementation", complexity: "O(1)" },
            ],
            advanced: [
                { name: "Sliding Window", desc: "Maximum in sliding window", complexity: "O(n)" },
                { name: "Deque Apps", desc: "Double-ended queue problems", complexity: "O(1)" },
            ]
        },
        "Heap": {
            common: [
                { name: "K Largest/Smallest", desc: "Find top k elements", complexity: "O(n log k)" },
                { name: "Heap Sort", desc: "Sort using heap", complexity: "O(n log n)" },
            ],
            advanced: [
                { name: "Median Stream", desc: "Find median in data stream", complexity: "O(log n)" },
                { name: "Merge K Lists", desc: "Merge k sorted lists", complexity: "O(N log k)" },
                { name: "Top K Frequent", desc: "Find most frequent elements", complexity: "O(n log k)" },
            ]
        },
        "Linked List": {
            common: [
                { name: "Reverse LL", desc: "Reverse linked list", complexity: "O(n)" },
                { name: "Detect Loop", desc: "Cycle detection (Floyd's)", complexity: "O(n)" },
                { name: "Find Middle", desc: "Middle of linked list", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Merge Two", desc: "Merge sorted lists", complexity: "O(n)" },
                { name: "Intersection", desc: "Find intersection point", complexity: "O(n)" },
                { name: "LRU Cache", desc: "Least Recently Used Cache", complexity: "O(1)" },
                { name: "Clone List", desc: "Deep copy with random ptrs", complexity: "O(n)" },
            ]
        },
        "Sliding Window": {
            common: [
                { name: "Max Sum Sub.", desc: "Max sum of subarray size K", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Longest Substr", desc: "No repeating chars", complexity: "O(n)" },
                { name: "Min Window", desc: "Minimum window substring", complexity: "O(n)" },
            ]
        },
        "Two Pointer": {
            common: [
                { name: "Pair Sum", desc: "Find pair with target sum", complexity: "O(n)" },
                { name: "Remove Dup.", desc: "Remove duplicates sorted", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Container", desc: "Most water container", complexity: "O(n)" },
                { name: "3-Sum / 4-Sum", desc: "Find triplets/quads summing to 0", complexity: "O(n²)" },
            ]
        },
        "Matrix": {
            common: [
                { name: "Traversal", desc: "Row-wise / Col-wise", complexity: "O(nm)" },
                { name: "Row/Col Sum", desc: "Sum of rows and columns", complexity: "O(nm)" },
            ],
            advanced: [
                { name: "Rotate Matrix", desc: "Rotate image 90 degrees", complexity: "O(nm)" },
                { name: "Flood Fill", desc: "DFS on grid", complexity: "O(nm)" },
                { name: "Island Count", desc: "Number of islands in grid", complexity: "O(nm)" },
                { name: "Word Search", desc: "Find word in matrix", complexity: "Exponential" },
            ]
        },
        "Recursion": {
            common: [
                { name: "Factorial", desc: "Calculate n!", complexity: "O(n)" },
                { name: "Fibonacci", desc: "Nth Fibonacci number", complexity: "O(2^n)" },
                { name: "Power Calc", desc: "Calculate x^n", complexity: "O(n)" },
            ],
            advanced: [
                { name: "Tower of Hanoi", desc: "Classic recursion puzzle", complexity: "O(2^n)" },
                { name: "Tree Recursion", desc: "Solving tree problems", complexity: "O(n)" },
                { name: "Backtracking", desc: "General backtracking", complexity: "Exponential" },
            ]
        },
        "Union-Find": {
            common: [
                { name: "DSU Impl.", desc: "Disjoint Set Union basics", complexity: "O(α(n))" },
            ],
            advanced: [
                { name: "Cycle Detect", desc: "Cycle detection using DSU", complexity: "O(α(n))" },
                { name: "Network Connect", desc: "Connectivity problems", complexity: "O(α(n))" },
            ]
        },
        "Real-World": {
            common: [
                { name: "Scheduling", desc: "Basic task scheduling", complexity: "O(n)" },
                { name: "Resource Alloc.", desc: "Simple resource distribution", complexity: "O(n)" },
            ],
            advanced: [
                { name: "TSP", desc: "Traveling Salesman Problem", complexity: "NP-Hard" },
                { name: "Max Flow", desc: "Network flow algorithms", complexity: "O(V²E)" },
                { name: "Load Balance", desc: "Distribute load efficiently", complexity: "O(n)" },
                { name: "Routing Opt.", desc: "Optimizing network paths", complexity: "NP-Hard" },
            ]
        }
    };

    const allAlgorithms = Object.values(algorithmCategories).flatMap(cat => [
        ...(cat.common || []),
        ...(cat.advanced || [])
    ]);

    const suggestions = searchQuery.trim()
        ? allAlgorithms.filter(algo =>
            algo.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 200;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            // Check status slightly after scroll starts/ends
            setTimeout(checkScroll, 300);
        }
    };

    // Initial check
    useState(() => {
        checkScroll();
    }, []);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-8"
        >
            {/* ... keeping Hero section ... */}

            {/* Hero Section */}
            <motion.div variants={item} className="flex flex-col items-center justify-center text-center space-y-6 pt-2 pb-6 px-4">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-2 leading-tight">
                        What would you like to visualize today?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Explore, learn, and master algorithms with interactive animations.
                    </p>
                </div>

                <div className="w-full max-w-2xl relative z-50">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative flex items-center bg-background rounded-lg border shadow-sm">
                            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Explain Bellman-Ford with negative cycle..."
                                className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 pr-32"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <div className="absolute right-2 hidden sm:block">
                                <Button
                                    className="h-10 px-6 rounded-md"
                                    size="sm"
                                    onClick={handleSearch}
                                    disabled={!searchQuery.trim()}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Visualize
                                </Button>
                            </div>
                            <div className="absolute right-2 sm:hidden">
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-md"
                                    onClick={handleSearch}
                                    disabled={!searchQuery.trim()}
                                >
                                    <Sparkles className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Search Suggestions */}
                    {suggestions.length > 0 && searchQuery !== suggestions[0]?.name && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 z-50">
                            {suggestions.map((algo) => (
                                <div
                                    key={algo.name}
                                    className="px-4 py-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors"
                                    onClick={() => setSearchQuery(algo.name)}
                                >
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{algo.name}</span>
                                        <span className="text-xs text-muted-foreground">{algo.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="hidden sm:inline">Try:</span>
                    <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleVisualize("Bubble Sort")}
                    >
                        Bubble sort
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleVisualize("Dijkstra")}
                    >
                        Dijkstra's Algorithm
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleVisualize("N-Queens")}
                    >
                        N-Queens
                    </Badge>
                </div>
            </motion.div>

            {/* Algorithm Catalog */}
            <motion.div variants={item} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">Browse Algorithms</h2>
                </div>

                <div className="relative group">
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-md transition-opacity duration-300 ${canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 invisible"
                        }`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('left')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="flex space-x-2 overflow-x-auto scrollbar-hide px-1 py-2 items-center"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {Object.keys(algorithmCategories).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setShowAdvanced(false); }}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('right')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Render Common Algorithms */}
                    {algorithmCategories[activeCategory]?.common?.map((algo) => (
                        <Card
                            key={algo.name}
                            className="group cursor-pointer hover:shadow-md transition-all border-primary/10 hover:border-primary/30"
                            onClick={() => handleVisualize(algo.name)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Code2 className="h-4 w-4" />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-normal bg-background/50">{algo.complexity}</Badge>
                                </div>
                                <CardTitle className="text-base">{algo.name}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2 mt-1">{algo.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}

                    {/* Render Advanced Algorithms ONLY if showAdvanced is true */}
                    {showAdvanced && algorithmCategories[activeCategory]?.advanced?.map((algo) => (
                        <Card
                            key={algo.name}
                            className="group cursor-pointer hover:shadow-md transition-all border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5"
                            onClick={() => handleVisualize(algo.name)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-normal bg-background/50 border-purple-200">{algo.complexity}</Badge>
                                </div>
                                <CardTitle className="text-base">{algo.name}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2 mt-1">{algo.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}

                    {/* Show/Hide Advanced Toggle Card */}
                    <Card
                        className={`group cursor-pointer hover:shadow-md transition-all border-dashed flex flex-col items-center justify-center text-center p-6 min-h-[140px] ${showAdvanced
                            ? "border-red-200 hover:border-red-400 hover:bg-red-50"
                            : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                            }`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <div className={`p-3 rounded-full mb-3 transition-colors ${showAdvanced ? "bg-red-100 text-red-500" : "bg-purple-100 text-purple-600"
                            }`}>
                            {showAdvanced ? <Zap className="h-6 w-6 rotate-180" /> : <Zap className="h-6 w-6" />}
                        </div>
                        <h3 className={`font-semibold ${showAdvanced ? "text-red-700" : "text-purple-700"}`}>
                            {showAdvanced ? "Hide Advanced" : "View Advanced"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {showAdvanced ? "Show less problems" : "Challenge yourself"}
                        </p>
                    </Card>
                </div>
            </motion.div>

            {/* Action Cards */}



        </motion.div>
    );
};
