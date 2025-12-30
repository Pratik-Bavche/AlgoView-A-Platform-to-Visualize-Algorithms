import { useState } from "react";
import { Search, Globe, Mic, MicOff, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export const Navbar = () => {
    const [isVoiceOn, setIsVoiceOn] = useState(false);

    return (
        <div className="flex items-center p-4 border-b h-16 bg-background/50 backdrop-blur-md sticky top-0 z-30 ml-0 transition-all duration-300">
            <MobileSidebar />



            <div className="flex items-center gap-x-3 ml-auto">
                {/* Language Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden sm:flex">
                            <Globe className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>English</DropdownMenuItem>
                        <DropdownMenuItem>Hindi</DropdownMenuItem>
                        <DropdownMenuItem>Español</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Voice Toggle */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`text-muted-foreground hover:text-primary ${isVoiceOn ? "text-primary bg-primary/10" : ""}`}
                                onClick={() => setIsVoiceOn(!isVoiceOn)}
                            >
                                {isVoiceOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Voice Narration: {isVoiceOn ? "ON" : "OFF"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                </Button>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8 border border-primary/20">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                                <AvatarFallback>IV</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">John Doe</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    student@algoview.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
