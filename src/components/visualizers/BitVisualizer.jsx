import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BitBlock = ({ val, index, status }) => {
    const getBgColor = () => {
        switch (status) {
            case 'active': return 'bg-yellow-500 border-yellow-600 text-white shadow-yellow-500/50';
            case 'flip': return 'bg-red-500 border-red-600 text-white shadow-red-500/50';
            case 'set': return 'bg-green-500 border-green-600 text-white shadow-green-500/30';
            default: return val === '1' ? 'bg-green-500/80 border-green-600/50 text-white' : 'bg-muted border-border text-muted-foreground';
        }
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-colors duration-300 ${getBgColor()}`}
            >
                {val}
            </motion.div>
            <span className="text-[10px] font-mono text-muted-foreground">{index}</span>
        </div>
    );
};

const BinaryRow = ({ label, value, decimal, activeBit, statuses = {}, bits = 8 }) => {
    // Ensure value is a string of bits
    const binaryStr = typeof value === 'number'
        ? value.toString(2).padStart(bits, '0')
        : (value || "0").padStart(bits, '0');

    const bitArray = binaryStr.split('').reverse(); // 0-indexed from right

    return (
        <div className="space-y-3 p-4 bg-card/50 rounded-xl border border-border/50">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm font-semibold text-primary">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">Decimal:</span>
                    <span className="text-sm font-bold font-mono">{decimal ?? parseInt(binaryStr, 2)}</span>
                </div>
            </div>
            <div className="flex flex-row-reverse justify-center gap-2">
                {bitArray.map((bit, idx) => (
                    <BitBlock
                        key={idx}
                        val={bit}
                        index={idx}
                        status={idx === activeBit ? 'active' : (statuses[idx] || 'normal')}
                    />
                ))}
            </div>
        </div>
    );
};

export const BitVisualizer = ({ stepData }) => {
    const {
        values = [], // [{ label, val, decimal, activeBit, statuses }]
        result = null, // { label, val, decimal }
        array = null,
        operation = "",
        extraInfo = null
    } = stepData;

    const currentIndex = extraInfo?.Index ?? -1;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
            {/* Array View for reduction problems */}
            {array && (
                <div className="flex flex-wrap justify-center gap-2 mb-8 p-4 bg-muted/20 rounded-xl border border-dashed">
                    {array.map((val, idx) => (
                        <div
                            key={idx}
                            className={`w-10 h-10 rounded border flex items-center justify-center font-bold transition-all ${idx === currentIndex
                                ? 'bg-primary text-primary-foreground scale-110 shadow-lg border-primary'
                                : idx < currentIndex
                                    ? 'bg-muted text-muted-foreground opacity-50'
                                    : 'bg-card text-foreground'
                                }`}
                        >
                            {val}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.label || i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                        >
                            <BinaryRow {...v} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {operation && (
                    <div className="flex items-center justify-center py-2">
                        <div className="h-px flex-1 bg-border/50" />
                        <span className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary uppercase tracking-widest leading-none">
                            {operation}
                        </span>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] font-bold text-muted-foreground uppercase">Result</div>
                        <BinaryRow {...result} bits={result.bits || 8} />
                    </motion.div>
                )}
            </div>

            {extraInfo && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    {Object.entries(extraInfo).map(([key, value]) => (
                        <div key={key} className="p-3 bg-muted/30 rounded-lg border border-border/50 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{key}</span>
                            <span className="text-lg font-mono font-bold text-primary">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
