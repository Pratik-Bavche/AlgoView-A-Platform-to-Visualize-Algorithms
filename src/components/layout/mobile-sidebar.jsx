import { Menu, Home, Library, TestTube, Save, BarChart, Settings, Code2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const MobileSidebar = () => {

    const sidebarRoutes = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Library, label: "Algorithms Library", href: "/library" },
        { icon: TestTube, label: "Visual Playground", href: "/playground" },
        { icon: Save, label: "Saved Sessions", href: "/saved" },
        { icon: BarChart, label: "Learning Progress", href: "/progress" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-card w-72">
                <div className="space-y-4 py-4 h-full flex flex-col">
                    <div className="px-3 py-2 flex-1">
                        <div className="flex items-center pl-2 mb-8">
                            <div className="h-8 w-8 mr-2 bg-primary rounded-lg flex items-center justify-center">
                                <Code2 className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">AlgoView</h2>
                        </div>
                        <div className="space-y-1">
                            {sidebarRoutes.map((route) => (
                                <Button
                                    key={route.href}
                                    variant="ghost"
                                    className="w-full justify-start font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    asChild
                                >
                                    <a href={route.href}>
                                        <route.icon className="mr-2 h-5 w-5" />
                                        {route.label}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
