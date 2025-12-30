import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Circle, HelpCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Node = ({ value, status, pointers = [], id, isLast, isLoop, loopIndex, currentIdx }) => {
    const getStyles = () => {
        switch (status) {
            case 'current': return 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-110 z-10';
            case 'success': return 'bg-green-500/20 border-green-500 text-green-500';
            case 'error': return 'bg-red-500/20 border-red-500 text-red-500';
            case 'removed': return 'bg-muted/50 border-muted text-muted-foreground opacity-50 gray-scale';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative flex items-center"
        >
            {/* Pointer Labels */}
            <div className="absolute -top-16 left-0 right-0 flex flex-col items-center gap-1">
                <AnimatePresence mode="popLayout">
                    {pointers.map(p => (
                        <motion.div
                            key={p}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                        >
                            <Badge variant="outline" className={`text-[9px] uppercase font-bold py-0 px-1 border-primary/30 ${p === 'head' ? 'bg-indigo-500/20 text-indigo-400' :
                                p === 'slow' ? 'bg-orange-500/20 text-orange-400' :
                                    p === 'fast' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-primary/20 text-primary'
                                }`}>
                                {p}
                            </Badge>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Node Box */}
            <div className={`w-20 sm:w-28 h-12 sm:h-14 flex border-2 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${getStyles()}`}>
                <div className="flex-1 flex items-center justify-center font-bold text-base sm:text-lg border-r-2 border-inherit">
                    {value}
                </div>
                <div className="w-6 sm:w-8 flex items-center justify-center bg-background/20 group relative">
                    <Circle className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current opacity-50" />
                </div>
            </div>

            {/* Arrow to Next */}
            {!isLast && (
                <div className="w-12 flex items-center justify-center relative">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="w-full h-0.5 bg-primary/30 origin-left"
                    />
                    <ArrowRight className="w-4 h-4 text-primary/50 absolute -right-1" />
                </div>
            )}

            {isLast && !isLoop && (
                <div className="ml-4 flex flex-col items-center opacity-40">
                    <span className="text-[10px] font-mono uppercase tracking-tighter">NULL</span>
                    <div className="w-4 h-0.5 bg-muted-foreground/30" />
                    <div className="w-2 h-0.5 bg-muted-foreground/30 mt-0.5" />
                </div>
            )}
        </motion.div>
    );
};

export const LinkedListVisualizer = ({ stepData }) => {
    const {
        nodes = [],
        pointers = {},
        description = '',
        operation = '',
        isLoop = false,
        loopIndex = -1,
        secondaryNodes = []
    } = stepData;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 gap-20 overflow-hidden">

            {/* Primary List Container */}
            <div className="relative flex flex-col items-center gap-4 w-full overflow-x-auto pb-10 scrollbar-hide z-10">
                <div className="flex items-center min-w-max px-20 relative py-20">
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, idx) => (
                            <Node
                                key={node.id || idx}
                                value={node.val}
                                status={node.status}
                                pointers={pointers[idx] || []}
                                isLast={idx === nodes.length - 1}
                                isLoop={isLoop}
                                loopIndex={loopIndex}
                                currentIdx={idx}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Loop-back Arrow Overlay - Relative to the list */}
                    {isLoop && loopIndex !== -1 && nodes.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ minWidth: '100%' }}>
                            <defs>
                                <marker id="arrowhead-loop" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-red-500" />
                                </marker>
                            </defs>
                            {/* The Loop Path */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                d={`M ${80 + (nodes.length - 1) * 160 + 104} 108 
                                   C ${80 + (nodes.length - 1) * 160 + 160} 220, 
                                     ${80 + loopIndex * 160 + 56} 220, 
                                     ${80 + loopIndex * 160 + 56} 122`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray="8,4"
                                markerEnd="url(#arrowhead-loop)"
                                className="text-red-500/60"
                            />
                            {/* Connection point dot */}
                            <motion.circle
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                cx={80 + loopIndex * 160 + 56}
                                cy={118}
                                r={4}
                                className="fill-red-500 shadow-xl"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {/* Secondary List (For Merge/Intersection) */}
            {secondaryNodes.length > 0 && (
                <div className="flex flex-col items-center gap-4 w-full overflow-x-auto pb-10 scrollbar-hide">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mr-auto ml-10">List 2</span>
                    <div className="flex items-center min-w-max px-20">
                        <AnimatePresence mode="popLayout">
                            {secondaryNodes.map((node, idx) => (
                                <Node
                                    key={`sec-${idx}`}
                                    value={node.val}
                                    status={node.status}
                                    pointers={pointers[`sec-${idx}`] || []}
                                    isLast={idx === secondaryNodes.length - 1}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Labels & Legend */}
            <div className="flex gap-8 mt-4 bg-muted/20 px-6 py-2 rounded-full border border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50" />
                    Normal
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                    Pointer
                </div>
                {isLoop && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-red-500">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 animate-pulse" />
                        Loop Target
                    </div>
                )}
            </div>
        </div>
    );
};
