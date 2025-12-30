import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const QueueElement = ({ value, status, isFront, isRear, index }) => {
    const getStyles = () => {
        switch (status) {
            case 'active': return 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            case 'success': return 'bg-green-500/20 border-green-500 text-green-500';
            case 'error': return 'bg-red-500/20 border-red-500 text-red-500';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            className="relative flex flex-col items-center group"
        >
            {/* Index Label */}
            <span className="text-[10px] font-mono text-muted-foreground mb-1">[{index}]</span>

            {/* Pointer: Front */}
            {isFront && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-12 flex flex-col items-center"
                >
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0">FRONT</Badge>
                    <ArrowDown className="w-4 h-4 text-primary animate-bounce mt-1" />
                </motion.div>
            )}

            {/* Queue Box */}
            <div className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 ${getStyles()}`}>
                {value}
            </div>

            {/* Pointer: Rear */}
            {isRear && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -bottom-10 flex flex-col items-center"
                >
                    <ArrowDown className="w-4 h-4 text-purple-500 rotate-180 mb-1" />
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] py-0">REAR</Badge>
                </motion.div>
            )}
        </motion.div>
    );
};

export const QueueVisualizer = ({ stepData }) => {
    const {
        queue = [],
        front = 0,
        rear = 0,
        operation = '',
        status = '',
        capacity = 8,
        description = '',
        extraInfo = {},
        isCircular = false,
        stack1 = [],
        stack2 = []
    } = stepData;

    // Special view for Queue Using Two Stacks
    if (stack1.length > 0 || stack2.length > 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-12">
                <div className="grid grid-cols-2 gap-20">
                    {/* Stack 1 - Inbox */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Stack 1 (Inbox)</span>
                        <div className="w-24 h-64 border-x-4 border-b-4 border-primary/30 rounded-b-2xl relative flex flex-col-reverse p-2 gap-2 bg-primary/5">
                            <AnimatePresence>
                                {stack1.map((val, i) => (
                                    <motion.div
                                        key={`${i}-${val}`}
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ x: 100, opacity: 0 }}
                                        className="h-10 w-full bg-primary/20 border border-primary/50 rounded flex items-center justify-center font-bold text-primary shadow-sm"
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stack 2 - Outbox */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Stack 2 (Outbox)</span>
                        <div className="w-24 h-64 border-x-4 border-b-4 border-purple-500/30 rounded-b-2xl relative flex flex-col-reverse p-2 gap-2 bg-purple-500/5">
                            <AnimatePresence>
                                {stack2.map((val, i) => (
                                    <motion.div
                                        key={`${i}-${val}`}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        className="h-10 w-full bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center font-bold text-purple-500 shadow-sm"
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Transfer Animation Indicator */}
                {operation === 'TRANSFER' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 text-primary bg-primary/5 px-6 py-2 rounded-full border border-primary/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold">Transferring elements for Dequeue</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.div>
                )}
            </div>
        );
    }

    // Circular Queue Rendering
    if (isCircular) {
        const radius = 120;
        const centerX = 200;
        const centerY = 200;

        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8">
                {/* Status Information */}
                <div className="flex gap-8 mb-4">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold font-mono text-primary">{queue.filter(x => x !== null).length}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Size</span>
                    </div>
                    <div className="flex flex-col items-center border-x px-8 border-border/50">
                        <span className="text-2xl font-bold font-mono text-purple-500">{capacity}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Capacity</span>
                    </div>
                </div>

                <div className="relative w-full max-w-[min(90vw,400px)] aspect-square flex items-center justify-center">
                    {/* Inner Circle Decoration */}
                    <div className="absolute w-[180px] h-[180px] rounded-full border-2 border-dashed border-primary/10 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Modulo</span>
                            <span className="text-xl font-bold font-mono text-primary">%{capacity}</span>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {Array.from({ length: capacity }).map((_, idx) => {
                            const angle = (idx * 360) / capacity - 90; // Start from top
                            const radian = (angle * Math.PI) / 180;
                            const x = centerX + radius * Math.cos(radian) - 28; // 28 is half of element width
                            const y = centerY + radius * Math.sin(radian) - 28;

                            const item = queue[idx];
                            const isFront = idx === front;
                            const isRear = idx === rear;

                            return (
                                <motion.div
                                    key={`idx-${idx}`}
                                    className="absolute"
                                    style={{ left: x, top: y }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {/* Index Label (Polar) */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground">
                                        {idx}
                                    </div>

                                    {/* Queue Box */}
                                    <div className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl font-bold text-lg transition-all duration-300 ${!item ? 'bg-muted/10 border-dashed border-border/50 text-muted-foreground/30' :
                                        item.status === 'active' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                            item.status === 'error' ? 'bg-red-500/20 border-red-500 text-red-500' :
                                                'bg-blue-500/10 border-blue-500 text-blue-400'
                                        }`}>
                                        {item?.val || '-'}
                                    </div>

                                    {/* Pointers */}
                                    {isFront && (
                                        <Badge className="absolute -left-12 top-1/2 -translate-y-1/2 bg-primary text-[10px] px-1 py-0 shadow-lg">F</Badge>
                                    )}
                                    {isRear && (
                                        <Badge className="absolute -right-12 top-1/2 -translate-y-1/2 bg-purple-500 text-[10px] px-1 py-0 shadow-lg">R</Badge>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* SVG Connections for Circular Visual */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                        <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>
                </div>

                {/* Pointer Logic Box */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-primary">Front Index</span>
                        <code className="text-sm font-bold">{front}</code>
                    </div>
                    <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-purple-500">Rear Index</span>
                        <code className="text-sm font-bold">{rear}</code>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-16">

            {/* Status Information */}
            <div className="flex gap-8 mb-4">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold font-mono text-primary">{queue.filter(x => x !== null).length}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Size</span>
                </div>
                <div className="flex flex-col items-center border-x px-8 border-border/50">
                    <span className="text-2xl font-bold font-mono text-purple-500">{capacity}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Capacity</span>
                </div>
                {Object.entries(extraInfo).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center">
                        <span className="text-2xl font-bold font-mono text-green-500">{value}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{key}</span>
                    </div>
                ))}
            </div>

            {/* Queue Horizontal Layout */}
            <div className="relative flex items-center gap-3 bg-muted/20 p-8 rounded-3xl border border-dashed border-primary/20 min-w-[300px] justify-center">
                {/* Entry Indicator */}
                <div className="absolute -left-16 flex flex-col items-center opacity-30">
                    <ArrowRight className="w-8 h-8 text-primary" />
                    <span className="text-[10px] font-bold uppercase mt-1">Exit</span>
                </div>

                <AnimatePresence mode="popLayout" initial={false}>
                    {queue.map((item, idx) => {
                        if (item === null) {
                            return (
                                <div key={`empty-${idx}`} className="w-14 h-14 border-2 border-dashed border-border/30 rounded-xl flex items-center justify-center grayscale opacity-20">
                                    <span className="text-[10px] font-mono">[{idx}]</span>
                                </div>
                            );
                        }
                        return (
                            <QueueElement
                                key={item.id}
                                value={item.val}
                                status={item.status}
                                isFront={idx === front}
                                isRear={idx === rear}
                                index={idx}
                            />
                        );
                    })}
                </AnimatePresence>

                {/* Exit Indicator */}
                <div className="absolute -right-16 flex flex-col items-center opacity-30">
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                    <span className="text-[10px] font-bold uppercase mt-1">Entry</span>
                </div>

                {/* Operation Overlay */}
                <AnimatePresence>
                    {operation && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: -60 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`absolute top-0 px-6 py-2 rounded-full font-bold text-sm shadow-xl z-20 border-2 ${operation === 'ENQUEUE' ? 'bg-purple-500 text-white border-purple-400' :
                                operation === 'DEQUEUE' ? 'bg-primary text-white border-primary-foreground/20' :
                                    'bg-yellow-500 text-white border-yellow-400'
                                }`}
                        >
                            {operation}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Pointer Logic Box (Optional but helpful) */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-primary">Front Pointer</span>
                    <code className="text-sm font-bold">{front}</code>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-purple-500">Rear Pointer</span>
                    <code className="text-sm font-bold">{rear}</code>
                </div>
            </div>
        </div>
    );
};
