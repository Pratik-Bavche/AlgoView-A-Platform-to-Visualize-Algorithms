import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const MatrixVisualizer = ({ stepData }) => {
    const {
        matrix = [[]],
        currentRow = -1,
        currentCol = -1,
        visited = [], // Array of [r, c]
        path = [], // Current traversal path [r, c]
        result = [], // Final result path [r, c]
        blocked = [], // Obstacles [r, c]
        direction = '', // 'up', 'down', 'left', 'right'
        description = '',
        highlights = {}, // Special markings { "r,c": color }
    } = stepData;

    const rowCount = matrix.length;
    const colCount = matrix[0]?.length || 0;

    const isVisited = (r, c) => visited.some(([vr, vc]) => vr === r && vc === c);
    const isPath = (r, c) => path.some(([pr, pc]) => pr === r && pc === c);
    const isResult = (r, c) => result.some(([rr, rc]) => rr === r && rc === c);
    const isBlocked = (r, c) => blocked.some(([br, bc]) => br === r && bc === c);

    const getCellStyles = (r, c) => {
        if (r === currentRow && c === currentCol) return 'bg-yellow-500 border-yellow-400 text-black shadow-lg scale-105 z-20';
        if (isPath(r, c)) return 'bg-yellow-500/30 border-yellow-500/50 text-yellow-500';
        if (isResult(r, c)) return 'bg-purple-500 border-purple-400 text-white shadow-md z-10';
        if (isVisited(r, c)) return 'bg-green-500/20 border-green-500/50 text-green-500';
        if (isBlocked(r, c)) return 'bg-red-500/20 border-red-500/50 text-red-500 grayscale opacity-50';
        if (highlights[`${r},${c}`]) return `${highlights[`${r},${c}`]} border-current`;
        return 'bg-blue-500/5 border-blue-500/20 text-blue-400/70';
    };

    const DirectionIndicator = () => {
        if (!direction) return null;
        const iconSize = 24;
        const directions = {
            'right': <ArrowRight size={iconSize} />,
            'down': <ArrowDown size={iconSize} />,
            'left': <ArrowLeft size={iconSize} />,
            'up': <ArrowUp size={iconSize} />
        };
        return (
            <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest">Direction:</span>
                {directions[direction]}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-6 overflow-auto">

            <DirectionIndicator />

            <div
                className="grid gap-2 p-4 bg-muted/10 rounded-3xl border border-border/50"
                style={{
                    gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`
                }}
            >
                {matrix.map((row, r) =>
                    row.map((val, c) => (
                        <motion.div
                            key={`${r}-${c}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center border-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 relative ${getCellStyles(r, c)}`}
                        >
                            <span className="absolute top-1 left-1.5 text-[8px] font-mono opacity-40">
                                {r},{c}
                            </span>
                            {val}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 bg-muted/20 px-8 py-3 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded bg-blue-500/10 border border-blue-500/20" />
                    Unvisited
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    Current
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
                    Visited
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="w-3 h-3 rounded bg-purple-500" />
                    Result
                </div>
            </div>
        </div>
    );
};
