import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export const TwoPointerVisualizer = ({ stepData }) => {
    const {
        array = [],
        left = -1,
        right = -1,
        fixed = -1, // For 3Sum
        pointers = {}, // Custom labels: { 0: 'L', 4: 'R' }
        status = {}, // { index: 'comparing' | 'swapping' | 'success' }
        condition = {}, // { label: 'Sum', value: 10, target: 8 }
        type = 'default', // 'container', 'duplicates', 'default'
        area = null, // for container with most water
        description = '',
        swappingIndices = []
    } = stepData;

    // Helper for specialized visualizations
    const renderSpecialized = () => {
        if (type === 'container') {
            const maxHeight = Math.max(...array, 1);
            return (
                <div className="flex items-end gap-1 h-[200px] mb-8 relative px-10">
                    {array.map((val, idx) => {
                        const isPointer = idx === left || idx === right;
                        const heightPercent = (val / maxHeight) * 100;
                        return (
                            <div key={idx} className="flex flex-col items-center flex-1 min-w-[20px]">
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 ${isPointer ? 'bg-primary' : 'bg-muted/30'
                                        }`}
                                    style={{ height: `${heightPercent}%` }}
                                />
                                <span className="text-[10px] mt-1 font-mono">{val}</span>
                            </div>
                        );
                    })}
                    {/* Area Overlay */}
                    {left !== -1 && right !== -1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute border-2 border-primary/40 bg-primary/10 rounded-sm"
                            style={{
                                left: `${(left / array.length) * 100}%`,
                                right: `${100 - ((right + 1) / array.length) * 100}%`,
                                bottom: '20px',
                                height: `${(Math.min(array[left], array[right]) / maxHeight) * 100}%`
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-background/80 px-2 py-0.5 rounded text-xs font-bold border">
                                    Area: {area}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </div>
            );
        }

        if (stepData.heights) { // Specific to Rain Water
            const { heights, leftMax, rightMax, water } = stepData;
            const maxHeight = Math.max(...heights, 1);
            return (
                <div className="flex flex-col gap-8 w-full max-w-3xl">
                    <div className="flex justify-between items-center px-6 py-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Water Trapped</span>
                            <span className="text-2xl font-bold text-blue-600 font-mono">{water} units</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Left Max</span>
                                <span className="font-bold text-xs">{leftMax}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Right Max</span>
                                <span className="font-bold text-xs">{rightMax}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end gap-1 h-[240px] relative px-4">
                        {heights.map((h, idx) => {
                            const isL = idx === left;
                            const isR = idx === right;
                            const currentWaterLevel = Math.min(leftMax, rightMax);
                            const trappedAtThisIdx = Math.max(0, currentWaterLevel - h);
                            
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center relative">
                                    {/* Water Level */}
                                    {trappedAtThisIdx > 0 && (
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(trappedAtThisIdx / maxHeight) * 100}%` }}
                                            className="absolute bg-blue-400/40 w-full rounded-t-sm z-0"
                                            style={{ bottom: `${(h / maxHeight) * 100}%` }}
                                        />
                                    )}
                                    {/* Block Level */}
                                    <div 
                                        className={`w-full rounded-t-sm border-x border-t transition-all duration-300 z-10 ${
                                            isL ? 'bg-blue-600 border-blue-700' : isR ? 'bg-red-600 border-red-700' : 'bg-slate-700 border-slate-800'
                                        }`}
                                        style={{ height: `${(h / maxHeight) * 100}%` }}
                                    />
                                    <span className="text-[8px] mt-1 font-mono">{h}</span>
                                    {(isL || isR) && (
                                        <div className={`absolute -bottom-6 text-[10px] font-bold ${isL ? 'text-blue-600' : 'text-red-600'}`}>
                                            {isL ? 'L' : 'R'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-16">

            {/* Condition Panel */}
            {Object.entries(condition).length > 0 && (
                <div className="flex gap-6 mb-4">
                    {Object.entries(condition).map(([key, data]) => (
                        <div key={key} className="flex flex-col items-center px-6 py-2 bg-muted/30 rounded-2xl border border-border/50 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{data.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-bold font-mono ${data.target && data.value > data.target ? 'text-red-500' :
                                    data.target && data.value < data.target ? 'text-blue-500' : 'text-primary'
                                    }`}>
                                    {data.value}
                                </span>
                                {data.target !== undefined && data.target !== null && (
                                    <span className="text-sm text-muted-foreground font-mono">/ {data.target}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Specialized Area */}
            {renderSpecialized()}

            {/* Standard Array Representation */}
            {type !== 'container' && !stepData.heights && (
                <div className="relative flex items-center gap-2 min-h-[140px]">
                    <AnimatePresence mode="popLayout">
                        {array.map((val, idx) => {
                            const isL = idx === left;
                            const isR = idx === right;
                            const isF = idx === fixed;
                            const currentStatus = status[idx];
                            const isSwapping = swappingIndices.includes(idx);

                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    className="relative flex flex-col items-center"
                                >
                                    {/* Pointers */}
                                    <div className="absolute -top-14 flex flex-col items-center h-12 justify-end gap-1">
                                        <AnimatePresence>
                                            {(isL || isR || isF || pointers[idx]) && (
                                                <motion.div
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -10, opacity: 0 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <Badge className={`text-[9px] font-bold px-1 py-0 ${isF ? 'bg-orange-500/20 text-orange-500' :
                                                        isL ? 'bg-blue-500 text-white' :
                                                            isR ? 'bg-red-500 text-white' : 'bg-primary text-white'
                                                        }`}>
                                                        {isF ? 'FIXED' : isL ? 'L' : isR ? 'R' : pointers[idx]}
                                                    </Badge>
                                                    <ArrowDown className={`w-4 h-4 ${isF ? 'text-orange-500' :
                                                        isL ? 'text-blue-500' :
                                                            isR ? 'text-red-500' : 'text-primary'
                                                        }`} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Node */}
                                    <motion.div
                                        animate={{
                                            scale: isSwapping ? 1.1 : 1,
                                            y: isSwapping ? -10 : 0
                                        }}
                                        className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 z-10 ${currentStatus === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' :
                                            currentStatus === 'comparing' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' :
                                                (isL || isR || isF) ? 'bg-background border-primary text-primary shadow-md' :
                                                    'bg-muted/10 border-border text-muted-foreground/50'
                                            }`}
                                    >
                                        {val}
                                    </motion.div>

                                    {/* Index */}
                                    <span className="text-[10px] font-mono text-muted-foreground mt-2">{idx}</span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
