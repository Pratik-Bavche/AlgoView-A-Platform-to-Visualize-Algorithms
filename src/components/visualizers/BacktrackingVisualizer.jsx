import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Crown, Rat, Ban } from 'lucide-react';

const COLORS = {
    VALID: "#22c55e",    // Green
    TRYING: "#eab308",   // Yellow
    CONFLICT: "#ef4444", // Red
    BACKTRACK: "#94a3b8", // Gray
    DEFAULT_LIGHT: "#f8fafc",
    DEFAULT_DARK: "#1e293b",
    BLACK_SQUARE: "#475569", // Slate-600
    WHITE_SQUARE: "#cbd5e1", // Slate-300
};

// --- N-Queens Component ---
const NQueensBoard = ({ grid, n }) => {
    return (
        <div
            className="grid gap-0.5 border-4 border-slate-700 bg-slate-700 mx-auto rounded-lg overflow-hidden lg:shadow-2xl"
            style={{
                gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: 'min(90vw, 400px)',
                aspectRatio: '1/1'
            }}
        >
            {
                grid.map((row, r) => (
                    row.map((cell, c) => {
                        const isBlack = (r + c) % 2 === 1;
                        const bg = isBlack ? COLORS.BLACK_SQUARE : COLORS.WHITE_SQUARE;

                        // Overlay color if active
                        let overlay = null;
                        if (cell.status === 'trying') overlay = COLORS.TRYING;
                        if (cell.status === 'safe') overlay = COLORS.VALID;
                        if (cell.status === 'conflict') overlay = COLORS.CONFLICT;
                        if (cell.status === 'backtrack') overlay = COLORS.BACKTRACK;

                        return (
                            <div
                                key={`${r}-${c}`}
                                className="relative flex items-center justify-center text-xs sm:text-lg"
                                style={{ backgroundColor: overlay || bg }}
                            >
                                {cell.value === 'Q' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-primary-foreground drop-shadow-md"
                                    >
                                        <Crown className="w-4 h-4 sm:w-8 sm:h-8 fill-current" />
                                    </motion.div>
                                )}
                                {cell.status === 'conflict' && (
                                    <div className="absolute inset-0 bg-red-500/40" />
                                )}
                            </div>
                        );
                    })
                ))
            }
        </div >
    );
};

// --- Sudoku Component ---
const SudokuBoard = ({ grid }) => {
    return (
        <div className="grid grid-cols-9 gap-0 border-4 border-slate-900 bg-slate-400 mx-auto w-full max-w-[min(90vw,400px)] aspect-square shadow-2xl">
            {grid.map((row, r) => (
                row.map((cell, c) => {
                    // Borders for 3x3 boxes
                    const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-slate-800' : 'border-r border-r-slate-300';
                    const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-slate-800' : 'border-b border-b-slate-300';

                    let bg = "bg-white dark:bg-slate-800";
                    if (cell.status === 'trying') bg = "bg-yellow-200 dark:bg-yellow-900";
                    if (cell.status === 'valid') bg = "bg-green-200 dark:bg-green-900";
                    if (cell.status === 'conflict') bg = "bg-red-200 dark:bg-red-900";
                    if (cell.fixed) bg = "bg-slate-100 dark:bg-slate-700";

                    return (
                        <div
                            key={`${r}-${c}`}
                            className={`
                                ${borderRight} ${borderBottom} 
                                ${bg}
                                flex items-center justify-center text-sm sm:text-xl font-mono
                                transition-colors duration-200
                            `}
                        >
                            <span className={cell.fixed ? "font-bold text-slate-900 dark:text-slate-100" : "text-blue-600 dark:text-blue-400"}>
                                {cell.value !== 0 ? cell.value : ''}
                            </span>
                        </div>
                    );
                })
            ))}
        </div>
    );
};

// --- Rat in Maze Component ---
const MazeBoard = ({ grid }) => {
    if (!grid || !grid.length) return null;
    const rows = grid.length;
    const cols = grid[0].length;

    return (
        <div
            className="grid gap-1 mx-auto bg-slate-200 p-1 rounded"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: 'min(90vw, 400px)',
                aspectRatio: `${cols}/${rows}`
            }}
        >
            {grid.map((row, r) => (
                row.map((cell, c) => {
                    let bg = "bg-white";
                    let icon = null;

                    if (cell.value === 1) bg = "bg-slate-800"; // Wall
                    if (cell.status === 'path') bg = "bg-green-400";
                    if (cell.status === 'trying') bg = "bg-yellow-400";
                    if (cell.status === 'dead') bg = "bg-red-400";
                    if (cell.status === 'backtrack') bg = "bg-gray-300";

                    // Rat Icon
                    if (cell.isRat) icon = <Rat className="w-4 h-4 sm:w-6 sm:h-6 text-slate-800 animate-bounce" />;
                    if (cell.isDest) icon = <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />;
                    // Wall Icon
                    if (cell.value === 1) icon = <Ban className="w-4 h-4 text-slate-600 opacity-50" />;

                    return (
                        <div
                            key={`${r}-${c}`}
                            className={`${bg} rounded flex items-center justify-center shadow-sm transition-colors duration-200`}
                        >
                            {icon}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

// --- Permutations / Subsets Stack ---
const ListRecursion = ({ currentPath, options, problemType, history }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 justify-center items-center min-h-[60px] p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300">
                {currentPath.length === 0 && <span className="text-muted-foreground text-sm italic">Empty Set / Start</span>}
                {currentPath.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold shadow-sm"
                    >
                        {item}
                    </motion.div>
                ))}
            </div>

            {/* Decision / Options */}
            <div className="flex flex-col items-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Available Options</div>
                <div className="flex gap-2">
                    {options.map((opt, idx) => (
                        <div
                            key={idx}
                            className={`
                                w-8 h-8 flex items-center justify-center rounded border text-sm font-bold transition-all
                                ${opt.status === 'selected' ? 'bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200' : ''}
                                ${opt.status === 'rejected' ? 'bg-gray-100 text-gray-400 decoration-line-through' : ''}
                                ${opt.status === 'available' ? 'bg-white border-slate-300 hover:border-blue-400' : ''}
                            `}
                        >
                            {opt.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Word Search Grid ---
const WordSearchBoard = ({ grid }) => {
    if (!grid) return null;
    return (
        <div className="grid gap-1 mx-auto bg-slate-200 p-2 rounded-lg"
            style={{
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: 'min(90vw, 400px)'
            }}>
            {grid.map((row, r) => (
                row.map((cell, c) => {
                    let bg = "bg-white";
                    let text = "text-slate-700";

                    if (cell.status === 'trying') { bg = "bg-yellow-200"; text = "text-yellow-700 font-bold"; }
                    if (cell.status === 'found') { bg = "bg-green-500 scale-105"; text = "text-white font-bold"; }
                    if (cell.status === 'backtrack') { bg = "bg-red-200"; text = "text-red-700"; }

                    return (
                        <div key={`${r}-${c}`} className={`${bg} ${text} w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded shadow-sm text-lg sm:text-xl transition-all duration-300`}>
                            {cell.value}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export const BacktrackingVisualizer = ({ stepData }) => {
    const { type, grid, n, currentPath, options } = stepData;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-auto">
            {type === 'n-queens' && <NQueensBoard grid={grid} n={n} />}
            {type === 'sudoku' && <SudokuBoard grid={grid} />}
            {type === 'rat-maze' && <MazeBoard grid={grid} />}
            {type === 'word-search' && <WordSearchBoard grid={grid} />}

            {(type === 'permutations' || type === 'subsets' || type === 'combinations') && (
                <ListRecursion
                    currentPath={currentPath}
                    options={options}
                    problemType={type}
                />
            )}

            {/* Legend / Key Keys */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" /> Valid/Safe</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded" /> Trying</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded" /> Conflict/Dead</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded" /> Backtrack</div>
            </div>
        </div>
    );
};
