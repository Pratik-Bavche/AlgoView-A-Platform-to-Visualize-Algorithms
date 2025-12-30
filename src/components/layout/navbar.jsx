import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Menu,
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    Home,
    LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const titles = [
    "Visualize complex algorithms with ease",
    "Master data structures through animation",
    "Interactive learning for better understanding",
    "Explore the logic behind the code",
    "See how algorithms actually work",
    "Your journey to algorithmic mastery"
];

export const Navbar = () => {
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % titles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center p-4 border-b h-16 bg-background/50 backdrop-blur-md sticky top-0 z-30 ml-0 transition-all duration-300">
            <MobileSidebar />

            <div className="hidden md:flex items-center ml-6">
                <div className="h-8 flex items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={titles[statusIndex]}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                        >
                            {titles[statusIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>



            <div className="flex items-center gap-x-3 ml-auto">
                <Button variant="ghost" size="sm" asChild className="hidden md:flex gap-2">
                    <Link to="/">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>

                {/* Home Icon for Mobile */}
                <Button variant="ghost" size="icon" asChild className="md:hidden">
                    <Link to="/">
                        <Home className="h-5 w-5" />
                    </Link>
                </Button>

                {/* Profile */}
                <Avatar className="h-8 w-8 border border-primary/20 cursor-pointer">
                    <AvatarFallback className="bg-primary/5 text-primary">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};
