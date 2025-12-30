import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Layers, PlayCircle, RotateCcw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const StackFrame = ({ label, params, returnValue, status, depth }) => {
    const getStyles = () => {
        switch (status) {
            case 'executing': return 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-105 z-10';
            case 'returning': return 'bg-green-500/20 border-green-500 text-green-500';
            case 'completed': return 'bg-muted/50 border-muted text-muted-foreground opacity-50 grayscale';
            case 'base-case': return 'bg-purple-500/20 border-purple-500 text-purple-500 border-dashed';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className={`w-full max-w-sm sm:max-w-md p-3 sm:p-4 border-2 rounded-xl sm:rounded-2xl flex flex-col gap-1 transition-all duration-500 ${getStyles()}`}
            style={{ marginLeft: `${Math.min(depth * 15, 60)}px` }}
        >
            <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">
                    Depth {depth}
                </span>
                {status === 'executing' && (
                    <Badge variant="outline" className="animate-pulse bg-yellow-500/10 text-yellow-500 border-none text-[8px]">
                        ACTIVE
                    </Badge>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono">{label}</span>
                <span className="text-sm opacity-60">({params})</span>
            </div>
            {returnValue !== undefined && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 pt-2 border-t border-current/20 flex justify-between items-center"
                >
                    <span className="text-[10px] uppercase font-bold opacity-60">Returns:</span>
                    <span className="text-lg font-bold font-mono text-green-500">{returnValue}</span>
                </motion.div>
            )}
        </motion.div>
    );
};

const HanoiVisualizer = ({ rods, moveDescription }) => {
    return (
        <div className="w-full flex flex-col items-center gap-12">
            <div className="flex gap-12 sm:gap-24 h-[250px] items-end px-12 pb-4">
                {rods.map((rod, idx) => (
                    <div key={idx} className="relative flex flex-col items-center w-40">
                        {/* The Rod */}
                        <div className="absolute bottom-0 w-2 h-full bg-muted-foreground/20 rounded-t-full" />
                        {/* Disks */}
                        <div className="flex flex-col-reverse items-center z-10 w-full">
                            <AnimatePresence>
                                {rod.map((disk, dIdx) => (
                                    <motion.div
                                        key={disk}
                                        layoutId={`disk-${disk}`}
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="h-6 rounded-full border-2 shadow-sm border-white/10"
                                        style={{
                                            width: `${disk * 15 + 30}px`,
                                            maxWidth: '100%',
                                            backgroundColor: `hsl(${disk * 60}, 70%, 50%)`
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                        <span className="mt-4 font-bold text-muted-foreground uppercase text-[10px]">Rod {String.fromCharCode(65 + idx)}</span>
                    </div>
                ))}
            </div>
            {moveDescription && (
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5">
                    {moveDescription}
                </Badge>
            )}
        </div>
    );
};

export const RecursionVisualizer = ({ stepData }) => {
    const {
        stack = [], // [{ label: 'fact', params: '4', status: 'executing', depth: 0 }]
        type = 'stack', // 'stack' or 'hanoi' or 'tree'
        rods = [], // For Hanoi
        moveDescription = '',
        description = '',
        activeDepth = 0
    } = stepData;

    return (
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center p-8 gap-12 overflow-hidden">

            {/* Left: Specialized Visual or Stack */}
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px]">
                {type === 'hanoi' ? (
                    <HanoiVisualizer rods={rods} moveDescription={moveDescription} />
                ) : (
                    <div className="flex flex-col-reverse gap-3 w-full max-w-lg overflow-y-auto max-h-[600px] p-4 scrollbar-hide">
                        <AnimatePresence mode="popLayout">
                            {stack.map((frame, idx) => (
                                <StackFrame key={`${frame.label}-${idx}`} {...frame} />
                            ))}
                        </AnimatePresence>
                        {stack.length === 0 && (
                            <div className="text-center text-muted-foreground opacity-30 flex flex-col items-center gap-4">
                                <Layers size={48} />
                                <span className="font-mono text-sm uppercase font-bold">Stack is empty</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Legend & Summary */}
            <div className="flex flex-col gap-6 bg-muted/20 p-8 rounded-3xl border border-border/50 max-w-sm">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Call Stack Legend</span>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/50" />
                        <span className="text-xs font-bold text-muted-foreground">NEW CALL</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500 animate-pulse" />
                        <span className="text-xs font-bold text-muted-foreground">EXECUTING</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 border-dashed" />
                        <span className="text-xs font-bold text-muted-foreground">BASE CASE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500" />
                        <span className="text-xs font-bold text-muted-foreground">RETURNING</span>
                    </div>
                </div>

                <div className="mt-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-primary">
                        <RotateCcw size={14} />
                        <span className="text-[10px] font-bold uppercase">Recursion Info</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground italic">
                        The "Depth" indicates how many times the function has called itself. The top frame is always the one currently solving the problem.
                    </p>
                </div>
            </div>
        </div>
    );
};
