import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export const ArrayVisualizer = ({ stepData }) => {
    // Destructure typical step data.
    const {
        array = [],
        comparing = [],
        found = [],
        range = [],
        swapped,
        pointers = [],
        window = null,
        extraData = null
    } = stepData;

    // --- Helper: Block Color Logic ---
    const getBlockColor = (index) => {
        // 1. Found / Sorted (Success) - Highest Priority
        if (found.includes(index)) return "bg-green-500 border-green-600 text-white shadow-green-500/20";

        // 2. Swapped / Match (Action)
        if (swapped && comparing.includes(index)) return "bg-purple-500 border-purple-600 text-white shadow-purple-500/20";

        // 3. Comparing (Active Focus)
        if (comparing.includes(index)) return "bg-blue-500 border-blue-600 text-white shadow-blue-500/20";

        // 4. Window / Range (Active Search Area)
        if (range.length > 0) {
            if (range.includes(index)) return "bg-background border-primary/50 text-foreground"; // Inside Range
            return "bg-muted/10 border-transparent text-muted-foreground/30"; // Outside Range (Dimmed)
        }

        // 5. Default
        return "bg-card border-border text-foreground shadow-sm";
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden relative">

            {/* Context/Extra Data Panel (Top Right) */}
            {extraData && (
                <div className="absolute top-2 right-2 flex flex-col items-end gap-2 pointer-events-none z-20">
                    {Object.entries(extraData).map(([key, value]) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card/90 backdrop-blur border rounded-md px-3 py-1.5 shadow-sm text-xs flex items-center gap-2"
                        >
                            <span className="text-muted-foreground font-medium capitalize">{key}:</span>
                            <span className="font-mono font-bold text-primary">{value}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-10 sm:gap-x-6 sm:gap-y-16 py-12">
                <AnimatePresence mode="popLayout">
                    {array.map((value, idx) => {
                        const activePointers = pointers.filter(p => p.index === idx);
                        const blockColor = getBlockColor(idx);

                        // Window Highlight Logic (if index is within window range)
                        const isInWindow = window && idx >= window.start && idx <= window.end;

                        return (
                            <div
                                key={`${idx}-${value}`}
                                className="relative group flex flex-col items-center"
                            >
                                {/* TOP POINTERS */}
                                <div className="absolute -top-8 left-0 right-0 flex justify-center items-end h-8 pointer-events-none">
                                    <AnimatePresence>
                                        {activePointers.filter(p => !p.position || p.position === 'top').map((p, i) => (
                                            <motion.div
                                                key={`ptr-top-${i}`}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 10, opacity: 0 }}
                                                className="flex flex-col items-center"
                                            >
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white mb-0.5 shadow-sm whitespace-nowrap"
                                                    style={{ backgroundColor: p.color || '#3b82f6' }} // Default blue
                                                >
                                                    {p.label}
                                                </span>
                                                <ArrowDown
                                                    className="w-4 h-4"
                                                    style={{ color: p.color || '#3b82f6' }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* THE BLOCK */}
                                <motion.div
                                    layout
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        borderColor: isInWindow ? '#3b82f6' : undefined, // Window Border override
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                        relative z-10 flex items-center justify-center font-bold border-2 transition-all duration-300
                                        w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl text-base sm:text-xl lg:text-2xl shrink-0
                                        ${blockColor}
                                        ${isInWindow ? 'border-dashed border-blue-500 bg-blue-500/10 text-foreground' : ''}
                                    `}
                                >
                                    {value}
                                </motion.div>

                                {/* INDEX LABEL */}
                                <span className="text-xs text-muted-foreground font-mono font-medium mt-2">
                                    {idx}
                                </span>

                                {/* BOTTOM POINTERS */}
                                <div className="absolute -bottom-14 left-0 right-0 flex justify-center items-start h-8 pointer-events-none pt-4">
                                    <AnimatePresence>
                                        {activePointers.filter(p => p.position === 'bottom').map((p, i) => (
                                            <motion.div
                                                key={`ptr-bot-${i}`}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                className="flex flex-col items-center"
                                            >
                                                <ArrowUp
                                                    className="w-4 h-4"
                                                    style={{ color: p.color || '#10b981' }} // Default green
                                                />
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white mt-0.5 shadow-sm whitespace-nowrap"
                                                    style={{ backgroundColor: p.color || '#10b981' }}
                                                >
                                                    {p.label}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
