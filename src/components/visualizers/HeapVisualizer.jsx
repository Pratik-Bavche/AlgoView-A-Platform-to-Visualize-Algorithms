import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

const HeapNode = ({ value, index, status, x, y }) => {
    const getStyles = () => {
        switch (status) {
            case 'comparing': return 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] z-10';
            case 'success': return 'bg-green-500/20 border-green-500 text-green-500';
            case 'violation': return 'bg-red-500/20 border-red-500 text-red-500';
            case 'swapped': return 'bg-purple-500/20 border-purple-500 text-purple-500 scale-110 z-20';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ x, y, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute"
            style={{ left: -24, top: -24 }} // Center onto coordinates
        >
            <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-full font-bold text-sm transition-all duration-300 ${getStyles()}`}>
                {value}
                <span className="absolute -bottom-5 text-[8px] font-mono text-muted-foreground">idx: {index}</span>
            </div>
        </motion.div>
    );
};

const SvgLines = ({ heap, positions }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {heap.map((_, i) => {
                const leftChild = 2 * i + 1;
                const rightChild = 2 * i + 2;
                const lines = [];

                if (leftChild < heap.length && heap[leftChild] !== null) {
                    lines.push(
                        <motion.line
                            key={`line-l-${i}`}
                            x1={positions[i].x}
                            y1={positions[i].y}
                            x2={positions[leftChild].x}
                            y2={positions[leftChild].y}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-border/30"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        />
                    );
                }
                if (rightChild < heap.length && heap[rightChild] !== null) {
                    lines.push(
                        <motion.line
                            key={`line-r-${i}`}
                            x1={positions[i].x}
                            y1={positions[i].y}
                            x2={positions[rightChild].x}
                            y2={positions[rightChild].y}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-border/30"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        />
                    );
                }
                return lines;
            })}
        </svg>
    );
};

export const HeapVisualizer = ({ stepData }) => {
    const {
        heap = [],
        comparing = [],
        swapped = [],
        violation = [],
        sorted = [],
        type = 'max', // 'max' or 'min'
        description = ''
    } = stepData;

    // Calculate tree positions
    const positions = useMemo(() => {
        const coords = [];
        const levels = Math.ceil(Math.log2(heap.length + 1));
        const verticalSpacing = 80;
        const initialHorizontalSpacing = Math.pow(2, levels - 1) * 30;

        for (let i = 0; i < heap.length; i++) {
            const level = Math.floor(Math.log2(i + 1));
            const levelIdx = i - (Math.pow(2, level) - 1);
            const numNodesInLevel = Math.pow(2, level);

            const x = (levelIdx - (numNodesInLevel - 1) / 2) * (initialHorizontalSpacing / Math.pow(2, level));
            const y = level * verticalSpacing;
            coords.push({ x: x + 400, y: y + 40 }); // Offset for container centering
        }
        return coords;
    }, [heap.length]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 overflow-hidden">
            {/* Tree Area */}
            <div className="relative flex-1 w-full max-w-4xl bg-muted/5 rounded-3xl border border-primary/5 overflow-visible flex items-center justify-center">
                <div className="relative w-full h-[350px]">
                    <SvgLines heap={heap} positions={positions} />
                    <AnimatePresence>
                        {heap.map((val, idx) => {
                            if (val === null) return null;
                            let status = 'normal';
                            if (swapped.includes(idx)) status = 'swapped';
                            else if (comparing.includes(idx)) status = 'comparing';
                            else if (violation.includes(idx)) status = 'violation';
                            else if (sorted.includes(idx)) status = 'success';

                            return (
                                <HeapNode
                                    key={`node-${idx}`}
                                    value={val}
                                    index={idx}
                                    status={status}
                                    x={positions[idx].x}
                                    y={positions[idx].y}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Array Mapping Area */}
            <div className="w-full mt-12 bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Array Representation</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 capitalize">{type}-Heap</Badge>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    {heap.map((val, idx) => {
                        let status = 'normal';
                        if (swapped.includes(idx)) status = 'swapped';
                        else if (comparing.includes(idx)) status = 'comparing';
                        else if (sorted.includes(idx)) status = 'success';

                        return (
                            <motion.div
                                key={`arr-${idx}`}
                                layout
                                className={`w-10 h-10 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ${status === 'comparing' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600' :
                                        status === 'swapped' ? 'bg-purple-500/20 border-purple-500 text-purple-600' :
                                            status === 'success' ? 'bg-green-500/20 border-green-500 text-green-600' :
                                                'bg-muted/50 border-border'
                                    }`}
                            >
                                <span className="font-bold text-xs">{val}</span>
                                <span className="text-[8px] text-muted-foreground mt-0.5">{idx}</span>
                            </motion.div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 flex flex-col gap-1 items-center">
                        <span className="text-[9px] font-bold text-primary uppercase">Left Child</span>
                        <code className="text-xs">2i + 1</code>
                    </div>
                    <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 flex flex-col gap-1 items-center">
                        <span className="text-[9px] font-bold text-purple-500 uppercase">Right Child</span>
                        <code className="text-xs">2i + 2</code>
                    </div>
                </div>
            </div>
        </div>
    );
};
