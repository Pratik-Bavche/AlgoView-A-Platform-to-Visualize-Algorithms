import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const WindowBox = ({ left, right, color = "primary" }) => {
    // Calculate width and position based on node indices
    // This assumes nodes are 64px wide with 8px gap (72px total offset)
    const nodeWidth = 64;
    const gap = 8;
    const offset = left * (nodeWidth + gap);
    const width = (right - left + 1) * nodeWidth + (right - left) * gap;

    return (
        <motion.div
            layout
            initial={false}
            animate={{ x: offset, width }}
            className={`absolute -top-2 -bottom-2 border-2 rounded-2xl pointer-events-none z-0 ${color === 'primary' ? 'bg-primary/5 border-primary/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                    color === 'success' ? 'bg-green-500/5 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                        'bg-yellow-500/5 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                }`}
        />
    );
};

export const SlidingWindowVisualizer = ({ stepData }) => {
    const {
        array = [],
        left = 0,
        right = 0,
        windowColor = 'primary',
        condition = {}, // { label: 'Sum', value: 7, target: 6 }
        pointers = {}, // { L: 0, R: 2 }
        description = '',
        results = []
    } = stepData;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-20">

            {/* Condition Panel */}
            <div className="flex gap-6 mb-4">
                {Object.entries(condition).map(([key, data]) => (
                    <div key={key} className="flex flex-col items-center px-6 py-2 bg-muted/30 rounded-2xl border border-border/50">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{data.label}</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold font-mono ${data.value > data.target ? 'text-red-500' : 'text-primary'}`}>
                                {data.value}
                            </span>
                            {data.target && (
                                <span className="text-sm text-muted-foreground font-mono">/ {data.target}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Array and Window */}
            <div className="relative flex items-center gap-2 min-h-[120px]">
                {/* Window Highlight */}
                {right >= left && <WindowBox left={left} right={right} color={windowColor} />}

                <AnimatePresence mode="popLayout">
                    {array.map((val, idx) => {
                        const inWindow = idx >= left && idx <= right;
                        return (
                            <motion.div
                                key={`idx-${idx}`}
                                layout
                                className="relative flex flex-col items-center"
                            >
                                {/* Pointers */}
                                <div className="absolute -top-12 flex flex-col items-center h-10 justify-end">
                                    {Object.entries(pointers).map(([label, pos]) => (
                                        pos === idx && (
                                            <motion.div
                                                key={label}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex flex-col items-center"
                                            >
                                                <Badge variant="outline" className={`text-[9px] font-bold px-1 py-0 mb-1 border-primary/30 ${label === 'L' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {label}
                                                </Badge>
                                                <ArrowDown className={`w-4 h-4 ${label === 'L' ? 'text-red-500' : 'text-blue-500'}`} />
                                            </motion.div>
                                        )
                                    ))}
                                </div>

                                {/* Node */}
                                <div className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl font-bold text-lg transition-all duration-500 z-10 ${inWindow ? 'bg-background border-primary text-primary shadow-sm' : 'bg-muted/10 border-border text-muted-foreground/50'
                                    }`}>
                                    {val}
                                </div>

                                {/* Index */}
                                <span className="text-[10px] font-mono text-muted-foreground mt-2">{idx}</span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Results / History */}
            {results.length > 0 && (
                <div className="w-full max-w-2xl bg-muted/20 rounded-2xl p-4 border border-border/50">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-3">Recent Results</span>
                    <div className="flex flex-wrap gap-2">
                        {results.map((res, i) => (
                            <Badge key={i} variant="secondary" className="font-mono">{res}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
