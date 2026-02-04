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

    // Helper: Numeric conversion for colors/heights
    const getNumericValue = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.length > 0) return val.charCodeAt(0);
        return 0;
    };

    // Pre-calculate numeric values for sorting visualization
    // Removing the floor of 10 to allow proper scaling for small numbers
    const numericArray = array.map(getNumericValue);
    const maxVal = Math.max(...numericArray, 1);

    // --- Color Logic ---
    const getBarColor = (index, value) => {
        // 1. Pivot / Key (Yellow)
        if (index === pivot || index === keyIndex) return "#eab308"; // Yellow-500

        // 2. Comparing / Swapped (Red)
        if (comparing.includes(index)) {
            return "#ef4444"; // Red-500
        }

        // 3. Sorted (Green)
        if (sorted.includes(index)) return "#22c55e"; // Green-500

        // 4. Rainbow Mode (HSL) based on value
        if (viewMode === 'rainbow') {
            const val = getNumericValue(value);
            // Hue from 0 to 300 (Red to Purple) to look nice
            const hue = (val / maxVal) * 340;
            return `hsl(${hue}, 85%, 55%)`;
        }

        // 5. Default / Unsorted (Blue)
        return "#3b82f6"; // Blue-500
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">

            {/* Top Info Panel (Pass Counters) - Static Layout (No Overlap) */}
            {extraData && (
                <div className="w-full flex justify-end px-2 pt-2 pb-2">
                    <div className="bg-muted/90 backdrop-blur px-3 py-1.5 rounded-md border border-border/50 text-xs font-mono flex items-center gap-2 shadow-sm">
                        <span className="text-muted-foreground font-semibold">PASS</span>
                        <span className="font-bold text-lg text-primary">{extraData.pass ?? '-'}<span className="text-muted-foreground/50 text-xs font-normal ml-1">/ {extraData.totalPasses ?? '-'}</span></span>
                    </div>
                </div>
            )}

            {/* Main Bars Canvas */}
            <div className={`flex-1 flex items-end justify-center px-1 sm:px-4 pb-4 sm:pb-8 gap-0.5 sm:gap-2 ${viewMode === 'numbers' ? 'items-center flex-wrap content-center gap-2 sm:gap-4' : ''}`}>
                <AnimatePresence>
                    {array.map((value, idx) => {
                        const color = getBarColor(idx, value);
                        const currentVal = getNumericValue(value);
                        // Scale to 100% of available container height (flex-1)
                        const heightPercent = Math.max(5, (currentVal / maxVal) * 100);

                        return (
                            <motion.div
                                key={`${idx}-${value}`} // Composite key for stable reordering animation
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: 1,
                                    height: viewMode === 'numbers' ? '3rem' : `${heightPercent}%`,
                                    backgroundColor: viewMode === 'dots' ? 'transparent' : color, // Transparent for dots
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
                                    relative flex items-end justify-center rounded-t-sm sm:rounded-t-md group
                                    ${viewMode === 'numbers' ? 'rounded-lg items-center justify-center shrink-0 shadow-sm' : 'flex-1 min-w-[2px] max-w-[3rem]'}
                                    ${viewMode !== 'dots' && viewMode !== 'numbers' ? 'shadow-sm' : ''}
                                `}
                                style={{
                                    // box shadow for glowing effect in rainbow mode
                                    boxShadow: viewMode === 'rainbow' && !comparing.includes(idx) && !sorted.includes(idx) ? `0 0 10px ${color}80` : ''
                                }}
                            >
                                {/* DOT Visualizer Element */}
                                {viewMode === 'dots' && (
                                    <>
                                        {/* Lollipop Line (Thinner on mobile) */}
                                        <div className="absolute bottom-0 top-0 w-[1px] sm:w-0.5 bg-primary/20 border-l border-dashed border-primary/40 left-1/2 -translate-x-1/2" />

                                        {/* The Dot (Responsive sizing) */}
                                        <div
                                            className="absolute top-0 w-2 h-2 sm:w-4 sm:h-4 rounded-full shadow-md transform -translate-y-1/2 left-1/2 -translate-x-1/2 z-10"
                                            style={{ backgroundColor: color }}
                                        />
                                    </>
                                )}

                                {/* Value Label */}
                                <span className={`
                                    font-bold tracking-tighter leading-none
                                    ${viewMode === 'numbers' ? 'text-lg text-white mb-0' : ''}
                                    ${viewMode === 'dots' ? 'text-[9px] sm:text-xs text-primary absolute -top-4 sm:-top-6 font-mono z-20' : ''}
                                    ${viewMode !== 'numbers' && viewMode !== 'dots' ? 'text-[9px] sm:text-xs text-white mb-1' : ''}
                                    
                                    /* Intelligent Hiding on Mobile: Hide if array is dense or element is narrow */
                                    ${(viewMode !== 'numbers' && array.length > 12) ? 'hidden sm:block' : ''} 
                                `}>
                                    {value}
                                </span>

                                {/* Index Label (Floating below) */}
                                <span className={`
                                    absolute -bottom-4 sm:-bottom-6 text-[8px] sm:text-[10px] text-muted-foreground font-mono
                                    ${array.length > 15 ? 'hidden sm:block' : ''} 
                                `}>
                                    {idx}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Base Line */}
                {viewMode !== 'numbers' && <div className="absolute bottom-8 sm:bottom-10 left-4 right-4 h-0.5 bg-border -z-10" />}
            </div>
        </div>
    );
};
