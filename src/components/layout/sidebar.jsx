import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar({ className }) {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        const loadRecent = () => {
            try {
                const recentStr = localStorage.getItem('algoView_recent');
                if (recentStr) {
                    const items = JSON.parse(recentStr);
                    setRecentItems(items.map(item => ({
                        name: item.name,
                        href: `/visualize/${item.id}`
                    })));
                } else {
                    // Fallback/Legacy scan (optional, but cleaner to rely on the list)
                    setRecentItems([]);
                }
            } catch (e) {
                console.error("Failed to load recent history", e);
            }
        };

        loadRecent();
        // Custom event dispatcher or interval check could be better, 
        // but 'storage' event works for cross-tab, and we can add a short interval for same-tab updates if needed.
        const interval = setInterval(loadRecent, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("h-screen border-r bg-card hidden md:flex flex-col w-64 fixed left-0 top-0", className)}>
            <div className="px-6 py-6 flex items-center">
                <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">AlgoView</h2>
                </Link>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-6">


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


        </div>
    );
}
