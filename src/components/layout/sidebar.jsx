import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Zap, Clock, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar({ className }) {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        const loadRecent = () => {
            const items = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("algoView_")) {
                    // Extract name from algoView_bubble-sort
                    const algoNameSlug = key.replace("algoView_", "");
                    const displayName = algoNameSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                    items.push({ name: displayName, href: `/visualize/${algoNameSlug}` });
                }
            }
            // Simple method to just show the list, ideally we'd sort by last accessed if we stored timestamps in separate index
            setRecentItems(items.slice(0, 10)); // Limit to 10
        };

        loadRecent();
        // Listen for storage events in case other tabs update it
        window.addEventListener('storage', loadRecent);
        return () => window.removeEventListener('storage', loadRecent);
    }, []);

    return (
        <div className={cn("h-screen border-r bg-card hidden md:flex flex-col w-64 fixed left-0 top-0", className)}>
            <div className="px-6 py-6 flex items-center">
                <div className="h-8 w-8 mr-2 bg-primary rounded-lg flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">AlgoView</h2>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-6">
                    {/* Main Menu */}
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-sm h-9"
                            asChild
                        >
                            <Link to="/">
                                <Home className="mr-3 h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                    </div>

                    {/* Recent Visualizations - Only shows if there are items */}
                    {recentItems.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Recent Visualizations
                            </h3>
                            <div className="space-y-1">
                                {recentItems.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant="ghost"
                                        className="w-full justify-start font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-sm h-9"
                                        asChild
                                    >
                                        <Link to={item.href}>
                                            <Clock className="mr-3 h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 mt-auto">
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/20 p-1.5 rounded-md">
                            <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-sm text-primary">Pro Features</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 mb-3 pl-1">
                        <li className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-primary" /> Advanced Algorithms
                        </li>
                        <li className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-primary" /> Voice Explanations
                        </li>
                    </ul>
                    <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90 shadow-sm">
                        Upgrade to Pro
                    </Button>
                </div>
            </div>
        </div>
    );
}
