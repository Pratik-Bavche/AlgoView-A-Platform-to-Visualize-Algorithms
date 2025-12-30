import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GraphVisualizer = ({ stepData }) => {
    // Expect stepData to have nodes and edges.
    const nodes = stepData.nodes || [];
    const edges = stepData.edges || [];
    const stack = stepData.stack || []; // For Recursion Stack Visualization

    // Helper to get color based on state
    const getNodeColor = (status) => {
        switch (status) {
            case 'visited': return '#22c55e'; // Green (Visited)
            case 'current': return '#eab308'; // Yellow (Current)
            case 'queued': return '#a855f7'; // Purple (Queued) - distinct from unvisited
            case 'cycle': return '#ef4444'; // Red (Cycle/Conflict)
            case 'default': default: return '#3b82f6'; // Blue (Unvisited)
        }
    };

    const getEdgeColor = (status) => {
        switch (status) {
            case 'visited': return '#22c55e'; // Green
            case 'current': return '#f97316'; // Orange (Exploring)
            case 'cycle': return '#ef4444'; // Red (Cycle)
            default: return '#cbd5e1'; // Slate-300 (Gray/Default)
        }
    };

    if (nodes.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Tree/Graph data not available.
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row w-full h-full gap-4">
            {/* Main Graph/Tree Canvas */}
            <div className="relative flex-1 border border-dashed border-border/50 rounded-2xl bg-background/50 overflow-hidden min-h-[300px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        {/* Standard Arrow Marker */}
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                        </marker>
                        {/* Colored Markers */}
                        <marker id="arrow-visited" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                        </marker>
                        <marker id="arrow-current" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                        </marker>
                        <marker id="arrow-cycle" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                        </marker>
                    </defs>

                    {edges.map((edge, idx) => {
                        const src = nodes.find(n => n.id === edge.source);
                        const tgt = nodes.find(n => n.id === edge.target);
                        if (!src || !tgt) return null;

                        const isDirected = edge.type === 'directed';
                        let markerUrl = isDirected ? "url(#arrow)" : undefined;
                        if (isDirected) {
                            if (edge.status === 'visited') markerUrl = "url(#arrow-visited)";
                            if (edge.status === 'current') markerUrl = "url(#arrow-current)";
                            if (edge.status === 'cycle') markerUrl = "url(#arrow-cycle)";
                        }

                        return (
                            <g key={`edge-group-${idx}`}>
                                <motion.line
                                    key={`edge-${idx}`}
                                    initial={{ pathLength: 0, opacity: 0, strokeWidth: 2 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: 1,
                                        stroke: getEdgeColor(edge.status),
                                        strokeWidth: edge.status === 'visited' || edge.status === 'current' ? 3 : 2
                                    }}
                                    x1={`${src.x}%`}
                                    y1={`${src.y}%`}
                                    x2={`${tgt.x}%`}
                                    y2={`${tgt.y}%`}
                                    markerEnd={markerUrl}
                                />
                                {/* Edge Weight Label */}
                                {edge.weight !== undefined && (
                                    <foreignObject
                                        x={(src.x + tgt.x) / 2 + '%'}
                                        y={(src.y + tgt.y) / 2 + '%'}
                                        width="30"
                                        height="20"
                                        style={{ overflow: 'visible' }}
                                    >
                                        <div className="bg-background/80 text-[10px] font-bold px-1 rounded border shadow-sm -translate-x-1/2 -translate-y-1/2">
                                            {edge.weight}
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            backgroundColor: getNodeColor(node.status),
                            borderColor: node.status === 'default' ? '#3b82f6' : getNodeColor(node.status)
                        }}
                        className={`
                            absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center border-2 shadow-sm font-bold text-[10px] sm:text-xs z-10 transition-colors duration-300
                            ${(node.status === 'default') ? 'text-white' : 'text-white'}
                        `}
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {node.value}
                        {/* In-Degree Label (Optional for Topo Sort) */}
                        {node.inDegree !== undefined && (
                            <span className="absolute -top-6 text-[10px] text-muted-foreground bg-muted/90 border px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20">
                                In: {node.inDegree}
                            </span>
                        )}
                        {/* Distance Label (For Shortest Path) */}
                        {node.distance !== undefined && (
                            <span className="absolute -bottom-7 text-[10px] font-bold text-primary bg-background/90 border px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-20">
                                d: {node.distance === Infinity ? '∞' : node.distance}
                            </span>
                        )}
                    </motion.div>
                ))}

                {/* MST Stats Panel (Prim's / Kruskal's) */}
                {stepData.mstStats && (
                    <div className="absolute top-4 left-4 bg-background/95 border shadow-lg p-3 rounded-lg z-30 min-w-[150px]">
                        <div className="text-xs font-bold mb-2 border-b pb-1">MST Progress</div>
                        <div className="flex flex-col gap-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Edges:</span>
                                <span className="font-mono font-bold">{stepData.mstStats.selected}/{stepData.mstStats.totalNeeds}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cost:</span>
                                <span className="font-mono font-bold text-green-600">{stepData.mstStats.cost}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Matrix View (Floyd-Warshall) */}
                {stepData.matrix && (
                    <div className="absolute top-4 left-4 bg-background/95 border shadow-lg p-3 rounded-lg z-30 max-w-[200px] sm:max-w-none overflow-x-auto">
                        <div className="text-xs font-bold mb-2 text-center">Distance Matrix</div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${stepData.matrix.length}, minmax(30px, 1fr))` }}>
                            {stepData.matrix.flat().map((cell, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        scale: 1,
                                        backgroundColor: cell.highlight ? '#eab308' : ((cell.val === Infinity || cell.val === '∞') ? '#f1f5f9' : '#dcfce7')
                                    }}
                                    className="h-8 flex items-center justify-center text-[10px] border rounded"
                                >
                                    {cell.val === Infinity ? '∞' : cell.val}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Traversal Count / Root Indicator */}
                <div className="absolute top-4 right-4 bg-background/90 border shadow-sm px-3 py-1.5 rounded-md text-xs font-medium z-20 backdrop-blur">
                    {stepData.description || "Visualizing..."}
                </div>
            </div>

            {/* Recursion Stack / Queue Panel */}
            <div className="h-16 sm:h-auto sm:w-24 border-t sm:border-t-0 sm:border-l bg-muted/10 flex sm:flex-col items-center justify-center sm:justify-start py-2 sm:py-4 gap-2 overflow-x-auto sm:overflow-x-visible">
                <span className="hidden sm:block text-[10px] uppercase font-bold text-muted-foreground mb-2">Stack / Q</span>
                <AnimatePresence mode="popLayout">
                    {stack.map((item, i) => (
                        <motion.div
                            key={`${i}-${item}`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0, scale: 0.8 }}
                            className="bg-card border shadow-sm w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold shrink-0"
                        >
                            {item}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {stack.length === 0 && <span className="sm:hidden text-[8px] uppercase font-bold opacity-30">Stack Empty</span>}
            </div>
        </div>
    );
};
