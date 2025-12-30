import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Code, Upload, Clock, ArrowRight, TrendingUp, Search, Sparkles, Zap, GitBranch } from "lucide-react";
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
                        <CardTitle>Visualize Algorithm</CardTitle>
                        <CardDescription>Choose from our extensive library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Explore popular algorithms like sorting, graphs, and trees with step-by-step guidance.
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

            {/* Main Content Split */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                {/* Recent Activity */}
                <motion.div variants={item} className="col-span-1 lg:col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                Recent Visualizations
                            </CardTitle>
                            <CardDescription>
                                Continue where you left off.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 sm:mt-0 flex-shrink-0">
                                                <GitBranch className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{activity.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>{activity.type}</span>
                                                    <span>•</span>
                                                    <span>{activity.steps} steps</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                                            <Button size="sm" variant="outline" className="h-8 gap-2" onClick={() => handleVisualize(activity.title)}>
                                                Resume <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Learning Progress Widget */}
                <motion.div variants={item} className="col-span-1 lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                Learning Progress
                            </CardTitle>
                            <CardDescription>Track your mastery</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Graph Algorithms</span>
                                        <span className="text-sm text-green-600 font-bold">75%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-3/4 rounded-full transition-all duration-1000" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Practice specific topics &rarr;
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Sorting</span>
                                        <span className="text-sm text-yellow-600 font-bold">40%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-2/5 rounded-full transition-all duration-1000" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Improve usage &rarr;
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Dynamic Programming</span>
                                        <span className="text-sm text-red-600 font-bold">10%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[10%] rounded-full transition-all duration-1000" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Start basic problems &rarr;
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        View Full Report
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};
