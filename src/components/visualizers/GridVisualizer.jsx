import React from "react";
import { motion } from "framer-motion";

export const GridVisualizer = ({ stepData }) => {
    const grid = stepData.grid || [];
    const rowLabels = stepData.rowLabels || [];
    const colLabels = stepData.colLabels || [];

    // Helper for Status Colors (Matches User Requirements)
    const getCellColor = (status, existingColor, active) => {
        if (active) return '#eab308'; // Legacy support
        if (existingColor) return existingColor; // Legacy support

        switch (status) {
            case 'current': return '#fde047'; // Yellow
            case 'visited': return '#86efac'; // Green
            case 'dependency': return '#93c5fd'; // Blue
            default: return 'white'; // Default/Gray
        }
    };

    if (!grid.length) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-lg p-8">
                <div className="text-center">
                    <p className="font-semibold mb-1">Grid data not ready</p>
                    <p className="text-xs opacity-70">Try resetting or selecting a valid DP/Backtracking algorithm.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 overflow-auto">
            <div className="relative border rounded-lg shadow-sm bg-muted/40 p-2 inline-block">

                {/* Column Headers */}
                {colLabels.length > 0 && (
                    <div className="flex mb-1 ml-8 sm:ml-12">
                        {colLabels.map((lbl, idx) => (
                            <div key={`col-${idx}`} className="w-8 sm:w-12 text-center text-xs text-muted-foreground font-mono truncate px-0.5">
                                {lbl}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    {grid.map((row, rIdx) => (
                        <div key={`row-${rIdx}`} className="flex gap-1 items-center">

                            {/* Row Header */}
                            {rowLabels.length > rIdx && (
                                <div className="w-8 sm:w-12 text-right text-xs text-muted-foreground font-mono pr-2 truncate">
                                    {rowLabels[rIdx]}
                                </div>
                            )}

                            {/* Grid Cells */}
                            {row.map((cell, cIdx) => (
                                <motion.div
                                    key={`${rIdx}-${cIdx}`}
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        backgroundColor: getCellColor(cell.status, cell.color, cell.active),
                                        borderColor: cell.status === 'current' ? '#ca8a04' : '#e5e7eb'
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className={`
                                        w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border rounded flex items-center justify-center font-bold text-[8px] sm:text-xs lg:text-sm shadow-sm
                                        ${cell.status === 'default' ? 'text-gray-400' : 'text-gray-900'}
                                    `}
                                >
                                    {cell.value}
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
