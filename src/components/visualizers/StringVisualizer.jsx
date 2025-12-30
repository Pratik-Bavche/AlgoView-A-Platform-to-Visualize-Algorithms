import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';

const COLORS = {
    UNCHECKED: 'bg-blue-100 border-blue-300 text-blue-800',
    COMPARING: 'bg-yellow-100 border-yellow-500 text-yellow-800 ring-2 ring-yellow-200',
    MATCHED: 'bg-green-100 border-green-500 text-green-800',
    MISMATCH: 'bg-red-100 border-red-500 text-red-800',
    FIXED: 'bg-slate-100 border-slate-300 text-slate-500 opacity-60',
};

const CharBlock = ({ char, index, status, subLabel, highlight }) => (
    <div className="flex flex-col items-center gap-1">
        <motion.div
            layout
            className={`
                w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md border-2 font-mono text-lg font-bold shadow-sm transition-colors duration-200
                ${COLORS[status.toUpperCase()] || COLORS.UNCHECKED}
                ${highlight ? 'scale-110' : ''}
            `}
        >
            {char}
        </motion.div>
        <span className="text-[10px] text-muted-foreground font-mono">{index}</span>
        {subLabel && <span className="text-[10px] font-bold text-primary">{subLabel}</span>}
    </div>
);

const FrequencyMap = ({ data }) => (
    <div className="flex flex-wrap gap-2 justify-center p-3 bg-muted/30 rounded-lg border border-border/50">
        {Object.entries(data).map(([char, count]) => (
            <div key={char} className="flex flex-col items-center px-2 py-1 bg-background border rounded min-w-[30px]">
                <span className="text-xs font-bold">{char}</span>
                <span className="text-[10px] text-primary">{count}</span>
            </div>
        ))}
    </div>
);

const LPSTable = ({ lps, characters }) => (
    <div className="flex flex-col items-center gap-2 mt-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase">LPS Table (Longest Prefix Suffix)</span>
        <div className="flex gap-1">
            {lps.map((val, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center border bg-muted/20 text-xs font-bold rounded-t">
                        {characters[i]}
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center border-x border-b border-primary/30 bg-primary/5 text-xs font-mono font-bold rounded-b text-primary">
                        {val}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const HashVisualization = ({ textHash, patternHash, isMatch }) => (
    <div className="flex gap-8 items-center mt-4 p-3 bg-muted/30 rounded-lg border">
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Pattern Hash</span>
            <span className="text-sm font-mono font-bold text-blue-600">{patternHash}</span>
        </div>
        <div className="text-lg font-bold text-muted-foreground">vs</div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Window Hash</span>
            <span className={`text-sm font-mono font-bold ${isMatch ? 'text-green-600' : 'text-red-600'}`}>
                {textHash}
            </span>
        </div>
    </div>
);

export const StringVisualizer = ({ stepData }) => {
    const {
        type,
        text = [],
        pattern = [],
        textPointers = [], // indices
        patternPointers = [],
        indices = {}, // { index: status }
        patternIndices = {},
        lps = null,
        freqMap = null,
        hashData = null,
        shift = 0,
    } = stepData;

    const renderString = (arr, statusMap, pointers, offset = 0) => (
        <div className="flex gap-1 items-start relative pb-6">
            {arr.map((char, i) => (
                <div key={i} className="relative">
                    <CharBlock
                        char={char}
                        index={i + offset}
                        status={statusMap[i] || 'unchecked'}
                        highlight={pointers.includes(i)}
                    />
                    {pointers.includes(i) && (
                        <motion.div
                            layoutId="pointer-text"
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-primary"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </motion.div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center justify-center gap-8 py-8 h-full overflow-auto">
            {/* Primary String (Text or Main String) */}
            <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {type.includes('matching') ? 'Text String' : 'String'}
                </span>
                {renderString(text, indices, textPointers)}
            </div>

            {/* Pattern String (for search algorithms) */}
            {pattern && pattern.length > 0 && (
                <div
                    className="flex flex-col items-center gap-4 transition-all duration-300"
                    style={{ marginLeft: `${shift * 48}px` }} // Approximate width of blocks + gap
                >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pattern</span>
                    {renderString(pattern, patternIndices, patternPointers, shift)}
                </div>
            )}

            {/* Supporting Structures */}
            <div className="mt-4 w-full max-w-2xl px-4">
                <AnimatePresence mode="wait">
                    {freqMap && (
                        <motion.div
                            key="freq"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <span className="text-xs font-semibold text-muted-foreground uppercase block text-center mb-2">Character Frequency Map</span>
                            <FrequencyMap data={freqMap} />
                        </motion.div>
                    )}

                    {lps && (
                        <motion.div
                            key="lps"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <LPSTable lps={lps} characters={pattern} />
                        </motion.div>
                    )}

                    {hashData && (
                        <motion.div
                            key="hash"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-center"
                        >
                            <HashVisualization
                                textHash={hashData.textHash}
                                patternHash={hashData.patternHash}
                                isMatch={hashData.isMatch}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" /> Unchecked</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-500" /> Comparing</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-100 border border-green-500" /> Match</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-100 border border-red-500" /> Mismatch</div>
            </div>
        </div>
    );
};
