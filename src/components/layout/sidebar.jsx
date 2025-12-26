import { Home, Library, TestTube, Save, BarChart, Settings, Code2, Sparkles, Zap, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarGroups = [
    {
        label: "Main",
        items: [
            { icon: LayoutDashboard, label: "Home", href: "/" },
            { icon: Library, label: "Algorithms Library", href: "/library" },
            { icon: TestTube, label: "Visual Playground", href: "/playground" },
        ]
    },
    {
        label: "Learning",
        items: [
            { icon: Save, label: "Saved Sessions", href: "/saved" },
            { icon: BarChart, label: "Learning Progress", href: "/progress" },
        ]
    },
    {
        label: "System",
        items: [
            { icon: Settings, label: "Settings", href: "/settings" },
        ]
    }
];

export function Sidebar({ className }) {
    return (
        <div className={cn("pb-12 h-screen border-r bg-card hidden md:flex flex-col w-64 fixed left-0 top-0", className)}>
            <div className="px-6 py-6 flex items-center">
                <div className="h-8 w-8 mr-2 bg-primary rounded-lg flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">AlgoView</h2>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-6">
                    {sidebarGroups.map((group, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((route) => (
                                    <Button
                                        key={route.href}
                                        variant="ghost"
                                        className="w-full justify-start font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-sm h-9"
                                        asChild
                                    >
                                        <a href={route.href}>
                                            <route.icon className="mr-3 h-4 w-4" />
                                            {route.label}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
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
