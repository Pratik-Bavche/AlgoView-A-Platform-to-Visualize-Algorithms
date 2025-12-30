import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SortingVisualizer = ({ stepData, viewMode = 'bars' }) => {
    // Destructured props based on standard algo visualization setup
    const {
        array,
        comparing = [],
        swapped,
        sorted = [],
        pivot = null,
        keyIndex = null, // key for insertion sort
        extraData
    } = stepData;

    // --- Color Logic ---
    const getBarColor = (index, value) => {
        // 1. Pivot / Key (Yellow) - Conceptually important elements
        // Check exact match for scalar pivot or check if in list if we change pivot structure later
        // Also handling 'keyIndex' for Insertion Sort
        if (index === pivot || index === keyIndex) return "#eab308"; // Yellow-500

        // 2. Comparing / Swapped (Red) - Active action
        if (comparing.includes(index)) {
            // User requested Red for "Currently compared", and swapped is outcome of comparison.
            return "#ef4444"; // Red-500
        }

        // 3. Sorted (Green) - Finalized state
        if (sorted.includes(index)) return "#22c55e"; // Green-500

        // 4. Default / Unsorted (Blue)
        return "#3b82f6"; // Blue-500
    };

    return (
        <div className="w-full h-full flex flex-col relative justify-between overflow-hidden">

            {/* Top Info Panel (Pass Counters) */}
            {extraData && (
                <div className="absolute top-2 right-4 flex gap-4 z-10">
                    <div className="bg-muted/90 backdrop-blur px-3 py-1.5 rounded border border-border/50 text-xs font-mono flex items-center gap-2">
                        <span className="text-muted-foreground w-12">PASS</span>
                        <span className="font-bold text-lg text-primary">{extraData.pass ?? '-'}<span className="text-muted-foreground/50 text-xs font-normal ml-1">/ {extraData.totalPasses ?? '-'}</span></span>
                    </div>
                </div>
            )}

            {/* Main Bars Canvas */}
            <div className={`flex-1 flex items-end justify-center px-4 pb-12 gap-1 sm:gap-2 ${viewMode === 'numbers' ? 'items-center flex-wrap content-center gap-4' : ''}`}>
                <AnimatePresence>
                    {array.map((value, idx) => {
                        const color = getBarColor(idx, value);

                        // Calculate Height Percentage relative to max value
                        // Support both Numbers and Strings (charCodeAt)
                        const getNumericValue = (val) => {
                            if (typeof val === 'number') return val;
                            if (typeof val === 'string' && val.length > 0) return val.charCodeAt(0);
                            return 0;
                        };

                        const numericArray = array.map(getNumericValue);
                        const maxVal = Math.max(...numericArray, 10);
                        const currentVal = getNumericValue(value);
                        const heightPercent = Math.max(10, (currentVal / maxVal) * 90);

                        return (
                            <motion.div
                                key={`${idx}-${value}`} // Composite key for stable reordering animation
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: 1,
                                    height: viewMode === 'numbers' ? '3rem' : `${heightPercent}%`,
                                    backgroundColor: color,
                                    width: viewMode === 'numbers' ? '3rem' : undefined
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    opacity: { duration: 0.2 }
                                }}
                                className={`
                                    relative flex items-end justify-center rounded-t-sm sm:rounded-t-md shadow-sm
                                    ${viewMode === 'numbers' ? 'rounded-lg items-center justify-center shrink-0' : 'flex-1 min-w-[2px] max-w-[3rem]'}
                                `}
                            >
                                {/* Value Label */}
                                <span className={`
                                    text-[10px] sm:text-xs font-bold mb-1
                                    ${viewMode === 'numbers' ? 'text-lg text-white mb-0' : 'text-white'}
                                    ${(viewMode !== 'numbers' && array.length > 20) ? 'hidden sm:block' : ''} // Hide text on small bars if many elements
                                `}>
                                    {value}
                                </span>

                                {/* Index Label (Floating below) */}
                                <span className="absolute -bottom-6 text-[10px] text-muted-foreground font-mono">
                                    {idx}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Base Line */}
                {viewMode !== 'numbers' && <div className="absolute bottom-10 left-4 right-4 h-0.5 bg-border -z-10" />}
            </div>
        </div>
    );
};
