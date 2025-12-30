import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoveDown, MoveUp } from "lucide-react";

const StackElement = ({ value, status, isMin }) => {
    const getBgColor = () => {
        switch (status) {
            case 'active': return 'bg-yellow-500 border-yellow-600 text-white';
            case 'pop': return 'bg-red-500 border-red-600 text-white';
            case 'match': return 'bg-green-500 border-green-600 text-white';
            case 'success': return 'bg-green-500 border-green-600 text-white';
            default: return 'bg-blue-500 border-blue-600 text-white';
        }
    };

    return (
        <motion.div
            layout
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className={`w-20 sm:w-24 h-10 sm:h-12 flex items-center justify-center rounded-lg border-2 font-bold text-base sm:text-lg shadow-md transition-colors duration-300 relative ${getBgColor()}`}
        >
            {value}
            {isMin && (
                <div className="absolute -right-2 -top-2 bg-yellow-400 text-[8px] px-1 rounded text-black font-black uppercase">Min</div>
            )}
        </motion.div>
    );
};

export const StackVisualizer = ({ stepData }) => {
    const {
        stack = [],
        input = [],
        currentIndex = -1,
        operation = "", // "PUSH", "POP", "PEEK"
        status = "normal",
        result = null,
        minStack = [], // for Min Stack problem
        extraInfo = null
    } = stepData;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-8 items-start justify-center min-h-[500px]">

            {/* Input Array View (Horizontal) */}
            <div className="flex-1 w-full space-y-6">
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest block text-center md:text-left">Input Stream</span>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {input.map((val, idx) => (
                            <div
                                key={idx}
                                className={`w-10 h-10 rounded border flex items-center justify-center font-bold transition-all ${idx === currentIndex
                                    ? 'bg-yellow-500 text-white scale-110 shadow-lg ring-2 ring-yellow-200'
                                    : idx < currentIndex
                                        ? 'bg-muted text-muted-foreground opacity-40'
                                        : 'bg-card'
                                    }`}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                {extraInfo && (
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(extraInfo).map(([key, val]) => (
                            <div key={key} className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">{key}</span>
                                <span className="text-lg font-mono font-bold text-primary">{val}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stack View (Vertical) */}
            <div className="flex-1 flex flex-col items-center w-full min-w-0 md:min-w-[300px]">
                <div className="relative p-4 sm:p-6 border-x-4 border-b-4 border-muted-foreground/30 rounded-b-3xl w-40 sm:w-48 min-h-[250px] sm:min-h-[300px] flex flex-col-reverse items-center gap-2 pb-8">
                    <AnimatePresence>
                        {stack.map((item, idx) => (
                            <StackElement
                                key={item.id || idx}
                                value={item.val}
                                status={item.status}
                                isMin={minStack.length > 0 && item.val === minStack[stack.length - 1]}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Top Pointer */}
                    {stack.length > 0 && (
                        <motion.div
                            layout
                            className="absolute -left-12 sm:-left-16 flex items-center gap-1 text-primary animate-pulse"
                            style={{ bottom: `calc(${stack.length} * 3.5rem + 10px)` }}
                        >
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter">Top</span>
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-black text-xl sm:text-2xl uppercase tracking-widest rotate-[-45deg] pointer-events-none">
                            Empty
                        </div>
                    )}
                </div>
                <div className="w-20 sm:w-24 h-2 bg-muted-foreground/30 rounded-full mt-2" />
                <span className="mt-4 text-[10px] font-bold uppercase text-muted-foreground text-center">LIFO Stack Structure</span>
            </div>

            {/* Animation Overlays for Push/Pop */}
            <AnimatePresence>
                {operation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                        <div className={`px-8 py-4 rounded-2xl border-4 shadow-2xl flex items-center gap-4 ${operation === 'PUSH' ? 'bg-blue-500 border-blue-400' :
                            operation === 'POP' ? 'bg-red-500 border-red-400' : 'bg-yellow-500 border-yellow-400'
                            } text-white font-black text-4xl`}>
                            {operation === 'PUSH' ? <MoveDown className="w-10 h-10" /> : <MoveUp className="w-10 h-10" />}
                            {operation}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
