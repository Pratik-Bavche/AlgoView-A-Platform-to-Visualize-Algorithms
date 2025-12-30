import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const NumberBox = ({ value, label, status, highlight }) => {
    const getBgColor = () => {
        switch (status) {
            case 'active': return 'bg-blue-500 border-blue-600 text-white shadow-blue-500/50';
            case 'operation': return 'bg-yellow-500 border-yellow-600 text-white shadow-yellow-500/50';
            case 'success': return 'bg-green-500 border-green-600 text-white shadow-green-500/50';
            case 'error': return 'bg-red-500 border-red-600 text-white shadow-red-500/50';
            case 'disabled': return 'bg-muted border-border text-muted-foreground opacity-40';
            default: return 'bg-card border-border text-foreground';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {label && <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>}
            <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: highlight ? 1.1 : 1, opacity: 1 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono text-xl font-bold transition-all duration-300 ${getBgColor()}`}
            >
                {value}
            </motion.div>
        </div>
    );
};

const GridView = ({ numbers, crossed, primes, active }) => (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-muted/20 rounded-xl border">
        {numbers.map((num) => {
            const isCrossed = crossed.includes(num);
            const isPrime = primes.includes(num);
            const isActive = active === num;

            return (
                <motion.div
                    key={num}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`
                        relative h-10 flex items-center justify-center rounded border font-mono text-sm font-bold transition-all
                        ${isActive ? 'bg-yellow-500 border-yellow-600 text-white scale-110 z-10' :
                            isPrime ? 'bg-green-500 border-green-600 text-white' :
                                isCrossed ? 'bg-muted text-muted-foreground/30 border-muted-foreground/20' :
                                    'bg-card border-border'}
                    `}
                >
                    {num}
                    {isCrossed && <X className="absolute w-6 h-6 text-red-500/40" />}
                </motion.div>
            );
        })}
    </div>
);

export const MathVisualizer = ({ stepData }) => {
    const {
        primaryValues = [], // [{ value, label, status }]
        grid = null, // { numbers, crossed, primes, active }
        calculations = [], // strings
        result = null,
        factors = [],
        comparison = null, // { a, b, symbol }
    } = stepData;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-12">
            {/* Main Values Transition */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                {primaryValues.map((v, i) => (
                    <React.Fragment key={i}>
                        <NumberBox {...v} />
                        {i < primaryValues.length - 1 && (
                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 mt-6" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Comparison Logic */}
            {comparison && (
                <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-3xl font-mono font-bold">{comparison.a}</div>
                    <div className="px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-600 font-bold">
                        {comparison.symbol}
                    </div>
                    <div className="text-3xl font-mono font-bold">{comparison.b}</div>
                </div>
            )}

            {/* Sieve Grid */}
            {grid && grid.numbers && (
                <div className="space-y-4">
                    <span className="text-xs font-bold uppercase text-muted-foreground block text-center">Number Sieve (1 - {grid.numbers.length})</span>
                    <GridView
                        numbers={grid.numbers || []}
                        crossed={grid.crossed || []}
                        primes={grid.primes || []}
                        active={grid.active}
                    />
                </div>
            )}

            {/* Calculations & Detailed Steps */}
            {((calculations && calculations.length > 0) || (factors && factors.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {calculations && calculations.length > 0 && (
                        <div className="space-y-3 p-6 bg-card rounded-xl border border-border shadow-sm">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">Calculations</span>
                            <div className="space-y-2">
                                {calculations.map((calc, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="font-mono text-sm border-l-2 border-primary/30 pl-3 py-1"
                                    >
                                        {calc}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                    {factors && factors.length > 0 && (
                        <div className="space-y-3 p-6 bg-card rounded-xl border border-border shadow-sm">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">Factors Found</span>
                            <div className="flex flex-wrap gap-2">
                                {factors.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full font-bold text-sm"
                                    >
                                        {f}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Final Success Observation */}
            {result && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-4 bg-green-500/5 p-8 rounded-2xl border border-green-500/20"
                >
                    <span className="text-[10px] font-bold uppercase text-green-600 tracking-widest">Final Result</span>
                    <div className="text-4xl font-mono font-black text-primary">{result}</div>
                </motion.div>
            )}
        </div>
    );
};
