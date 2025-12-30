import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Code, Code2, Upload, Clock, ArrowRight, TrendingUp, Search, Sparkles, Zap, GitBranch } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

    const recentActivity = [
        { title: "Dijkstra's Algorithm", type: "Graph", steps: 12, date: "2 hours ago", status: "Completed" },
        { title: "Merge Sort Visualization", type: "Sorting", steps: 45, date: "Yesterday", status: "In Progress" },
        { title: "Binary Search Tree", type: "Tree", steps: 8, date: "2 days ago", status: "Completed" },
    ];

    const handleVisualize = (algo) => {
        navigate(`/visualize/${algo.toLowerCase().replace(/['\s]/g, '-')}`);
    };

    const [activeCategory, setActiveCategory] = useState("Sorting");

    const algorithmCategories = {
        "Sorting": [
            { name: "Bubble Sort", desc: "Simple comparison-based sorting", complexity: "O(n²)" },
            { name: "Selection Sort", desc: "Selects smallest element repeatedly", complexity: "O(n²)" },
            { name: "Insertion Sort", desc: "Builds sorted array one item at a time", complexity: "O(n²)" },
            { name: "Merge Sort", desc: "Stable, divide-and-conquer sorting", complexity: "O(n log n)" },
            { name: "Quick Sort", desc: "Efficient divide-and-conquer sorting", complexity: "O(n log n)" },
            { name: "Heap Sort", desc: "Binary heap-based sorting", complexity: "O(n log n)" },
        ],
        "Searching": [
            { name: "Linear Search", desc: "Sequentially checks each element", complexity: "O(n)" },
            { name: "Binary Search", desc: "Search in sorted array by dividing interval", complexity: "O(log n)" },
        ],
        "Graph": [
            { name: "BFS", desc: "Breadth-First Search traversal", complexity: "O(V+E)" },
            { name: "DFS", desc: "Depth-First Search traversal", complexity: "O(V+E)" },
            { name: "Topological Sort", desc: "Linear ordering of vertices", complexity: "O(V+E)" },
        ],
        "Shortest Path": [
            { name: "Dijkstra", desc: "Shortest path in weighted graph", complexity: "O((V+E)logV)" },
            { name: "Bellman-Ford", desc: "Shortest path with negative edges", complexity: "O(VE)" },
            { name: "Floyd–Warshall", desc: "All-pairs shortest path", complexity: "O(V³)" },
        ],
        "MST": [
            { name: "Prim's Algo", desc: "Builds MST from arbitrary node", complexity: "O(E log V)" },
            { name: "Kruskal's Algo", desc: "Builds MST by adding edges", complexity: "O(E log E)" },
        ],
        "Dynamic Prog.": [
            { name: "Fibonacci (DP)", desc: "Calculates Fib numbers efficiently", complexity: "O(n)" },
            { name: "Knapsack Problem", desc: "Maximize value with weight limit", complexity: "O(nW)" },
            { name: "LCS", desc: "Longest Common Subsequence", complexity: "O(nm)" },
            { name: "LIS", desc: "Longest Increasing Subsequence", complexity: "O(n²)" },
        ],
        "Greedy": [
            { name: "Activity Selection", desc: "Max non-overlapping activities", complexity: "O(n log n)" },
            { name: "Huffman Coding", desc: "Lossless data compression", complexity: "O(n log n)" },
            { name: "Coin Change", desc: "Min coins for value (Greedy)", complexity: "O(V)" },
        ],
        "Backtracking": [
            { name: "N-Queens", desc: "Place N queens safely on NxN board", complexity: "O(N!)" },
            { name: "Sudoku Solver", desc: "Fills 9x9 grid with constraints", complexity: "Exponential" },
            { name: "Rat in a Maze", desc: "Find path from start to end", complexity: "O(2^N²)" },
        ],
        "Divide & Conquer": [
            { name: "Merge Sort", desc: "Sorts by dividing list into halves", complexity: "O(n log n)" },
            { name: "Quick Sort", desc: "Sorts by partitioning around pivot", complexity: "O(n log n)" },
            { name: "Binary Search", desc: "Search by dividing range", complexity: "O(log n)" },
        ],
        "Tree": [
            { name: "Traversals", desc: "Inorder, Preorder, Postorder", complexity: "O(n)" },
            { name: "BST Operations", desc: "Insert, Delete, Search", complexity: "O(h)" },
            { name: "AVL Rotations", desc: "Self-balancing tree operations", complexity: "O(1)" },
        ],
        "String": [
            { name: "Naive Match", desc: "Simple pattern searching", complexity: "O(mn)" },
            { name: "KMP Algorithm", desc: "Pattern search with prefix array", complexity: "O(n+m)" },
            { name: "Rabin-Karp", desc: "Rolling hash pattern match", complexity: "O(n+m)" },
        ],
        "Bit Manip.": [
            { name: "Bitwise Ops", desc: "AND, OR, XOR operations", complexity: "O(1)" },
            { name: "Count Set Bits", desc: "Number of 1s in binary", complexity: "O(log n)" },
            { name: "Power of Two", desc: "Check if number is power of 2", complexity: "O(1)" },
        ],
        "Math": [
            { name: "Prime Check", desc: "Determine if number is prime", complexity: "O(√n)" },
            { name: "Sieve of Eratosthenes", desc: "Find all primes up to n", complexity: "O(n log log n)" },
            { name: "GCD / LCM", desc: "Euclidean algorithm", complexity: "O(log(min(a,b)))" },
        ]
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-8"
        >
            {/* Hero Section */}
            <motion.div variants={item} className="flex flex-col items-center justify-center text-center space-y-6 py-8 md:py-12 px-4">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        What would you like to visualize today?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Explore, learn, and master algorithms with interactive animations.
                    </p>
                </div>

                <div className="w-full max-w-2xl relative">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative flex items-center bg-background rounded-lg border shadow-sm">
                            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Explain Bellman-Ford with negative cycle..."
                                className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 pr-32"
                            />
                            <div className="absolute right-2 hidden sm:block">
                                <Button
                                    className="h-10 px-6 rounded-md"
                                    size="sm"
                                    onClick={() => handleVisualize("Bellman-Ford")}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Visualize
                                </Button>
                            </div>
                            <div className="absolute right-2 sm:hidden">
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-md"
                                    onClick={() => handleVisualize("Bellman-Ford")}
                                >
                                    <Sparkles className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
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
            <motion.div variants={item} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Browse Algorithms</h2>
                </div>

                <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                    {Object.keys(algorithmCategories).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeCategory === cat
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {algorithmCategories[activeCategory].map((algo) => (
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
                                    <Badge variant="outline" className="text-xs font-normal">{algo.complexity}</Badge>
                                </div>
                                <CardTitle className="text-base">{algo.name}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2 mt-1">{algo.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Action Cards */}
            <motion.div variants={item} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card
                    className="hover:shadow-xl transition-all duration-300 border-primary/10 bg-gradient-to-br from-card to-primary/5 cursor-pointer group relative overflow-hidden"
                    onClick={() => navigate('/library')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Play className="w-24 h-24 text-primary transform translate-x-4 -translate-y-4" />
                    </div>
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle>Full Library</CardTitle>
                        <CardDescription>View all 50+ algorithms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Browse the complete catalog of algorithms organized by category and difficulty.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Code className="w-24 h-24 text-primary transform translate-x-4 -translate-y-4" />
                    </div>
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <CardTitle>Custom Input</CardTitle>
                        <CardDescription>Paste code, array, or graph data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Visualize your own data structures and see how algorithms process your specific inputs.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 cursor-pointer group relative overflow-hidden md:col-span-2 lg:col-span-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Upload className="w-24 h-24 text-primary transform translate-x-4 -translate-y-4" />
                    </div>
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Upload className="h-5 w-5 text-purple-500" />
                        </div>
                        <CardTitle>Upload Problem</CardTitle>
                        <CardDescription>Extract from book or screenshot</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Take a picture of a textbook problem or whiteboard and let AI convert it to a visualization.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>


        </motion.div>
    );
};
