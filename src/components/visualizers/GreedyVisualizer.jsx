import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

// Color Constants
const COLORS = {
    AVAILABLE: "bg-blue-500", // Blue
    EVALUATING: "bg-yellow-500", // Yellow
    SELECTED: "bg-green-500", // Green
    REJECTED: "bg-gray-400", // Gray
    DEFAULT: "bg-slate-200 dark:bg-slate-700"
};

const ActivityItem = ({ start, end, id, status, value }) => {
    // scale for visualization width
    const scale = 20;

    let colorClass = COLORS.DEFAULT;
    if (status === 'available') colorClass = COLORS.AVAILABLE;
    if (status === 'evaluating') colorClass = COLORS.EVALUATING;
    if (status === 'selected') colorClass = COLORS.SELECTED;
    if (status === 'rejected') colorClass = COLORS.REJECTED;

    return (
        <div className="flex items-center gap-2 mb-2 h-8 relative">
            <div className="w-8 text-xs font-mono text-muted-foreground z-10">#{id}</div>
            <div className="flex-1 relative h-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                <div
                    className={`absolute top-1 bottom-1 rounded-md flex items-center justify-center text-[10px] text-white font-bold shadow-sm transition-all duration-300 ${colorClass}`}
                    style={{
                        left: `${start * scale}px`,
                        width: `${(end - start) * scale}px`
                    }}
                >
                    {status === 'selected' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {start}-{end}
                </div>
            </div>
        </div>
    );
};

const CoinItem = ({ value, status, count }) => {
    let colorClass = "bg-blue-100 border-blue-300 text-blue-800";
    if (status === 'evaluating') colorClass = "bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse";
    if (status === 'selected') colorClass = "bg-green-100 border-green-300 text-green-800";
    if (status === 'rejected') colorClass = "bg-gray-100 border-gray-300 text-gray-500";

    return (
        <div className={`
            flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 
            transition-all duration-300 shadow-sm ${colorClass}
        `}>
            <span className="text-lg font-bold">{value}</span>
            {count > 0 && <span className="text-xs">x{count}</span>}
        </div>
    );
};

const KnapsackItem = ({ weight, value, ratio, status, fraction }) => {
    let colorClass = "bg-slate-100 border-slate-300";
    if (status === 'available') colorClass = "bg-blue-50 border-blue-200";
    if (status === 'evaluating') colorClass = "bg-yellow-50 border-yellow-200 shadow-md ring-2 ring-yellow-400";
    if (status === 'selected') colorClass = "bg-green-50 border-green-200 ring-2 ring-green-500";
    if (status === 'rejected') colorClass = "bg-gray-100 border-gray-200 opacity-50";

    return (
        <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${colorClass} flex flex-col gap-1 relative overflow-hidden`}>
            {fraction < 1 && fraction > 0 && (
                <div
                    className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500"
                    style={{ width: `${fraction * 100}%` }}
                />
            )}
            <div className="flex justify-between items-center">
                <span className="font-bold text-sm">Item</span>
                <Badge variant={status === 'selected' ? 'success' : 'outline'}>{status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                <div>Weight: {weight}</div>
                <div>Value: {value}</div>
            </div>
            <div className="text-xs font-mono text-center mt-1 bg-black/5 rounded py-0.5">
                Ratio: {ratio.toFixed(2)}
            </div>
        </div>
    );
};

export const GreedyVisualizer = ({ stepData }) => {
    const {
        type, 
        huffmanNodes,
        schedule,
        activeJob,
        profit,
        jobs = [],
        items = [],
        coins = [],
        activities = [],
        currentCapacity,
        maxCapacity,
        totalValue,
        remainingAmount,
        result: coinResult
    } = stepData;

    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            {type === 'activity' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-2 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${COLORS.AVAILABLE}`}></div><span className="text-xs">Available</span></div>
                        <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${COLORS.EVALUATING}`}></div><span className="text-xs">Evaluating</span></div>
                        <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${COLORS.SELECTED}`}></div><span className="text-xs">Selected</span></div>
                        <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${COLORS.REJECTED}`}></div><span className="text-xs">Rejected</span></div>
                    </div>
                    <div className="relative border-l-2 border-slate-300 pl-4 space-y-2">
                        {activities.map((act, idx) => (
                            <ActivityItem key={idx} {...act} />
                        ))}
                    </div>
                </div>
            )}

            {(type === 'huffman' || huffmanNodes) && (
                <div className="flex flex-col gap-8 items-center py-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase">Huffman Frequency Nodes</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                        {huffmanNodes?.map((node, idx) => (
                            <motion.div
                                key={idx}
                                layout
                                className={`
                                    min-w-[60px] p-3 rounded-xl border-2 flex flex-col items-center 
                                    ${node.char ? 'bg-green-500/10 border-green-500 text-green-700' : 'bg-blue-500/10 border-blue-500 text-blue-700'}
                                `}
                            >
                                <span className="text-xl font-bold">{node.freq}</span>
                                <span className="text-xs font-mono">{node.char || 'node'}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {type === 'coin' && (
                <div className="flex flex-col items-center gap-8 py-8">
                    <div className="text-2xl font-bold font-mono">
                        Remaining Amount: <span className="text-primary">{remainingAmount}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {coins.map((coin, idx) => (
                            <CoinItem key={idx} {...coin} />
                        ))}
                    </div>
                    {coinResult && (
                        <div className="w-full max-w-md p-4 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-semibold mb-2">Collected Coins</h4>
                            <div className="flex flex-wrap gap-2">
                                {coinResult.map((c, i) => (
                                    <Badge key={i} variant="secondary" className="text-lg px-3 py-1">{c}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {type === 'knapsack' && (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Capacity</span>
                            <span className="text-2xl font-bold">{currentCapacity} / {maxCapacity}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-sm text-muted-foreground">Total Value</span>
                            <span className="text-2xl font-bold text-green-600">{totalValue?.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {items.map((item, idx) => (
                            <KnapsackItem key={idx} {...item} />
                        ))}
                    </div>
                </div>
            )}

            {(type === 'greedy' || schedule) && schedule && (
                <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border">
                        <span className="text-sm font-medium">Accumulated Profit</span>
                        <span className="text-2xl font-bold text-green-600">${profit}</span>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Schedule Timeline</h4>
                        <div className="flex gap-2">
                            {schedule.map((jobId, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    className={`
                                        flex-1 h-11 rounded-lg border-2 flex flex-col items-center justify-center
                                        ${jobId ? 'bg-green-500/20 border-green-500 text-green-700 shadow-sm' : 'bg-muted/10 border-dashed border-muted-foreground/30 text-muted-foreground/30'}
                                    `}
                                >
                                    <span className="text-xs font-bold">{jobId || '-'}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between px-2 text-[10px] text-muted-foreground font-mono">
                            {schedule.map((_, i) => <span key={i}>T{i+1}</span>)}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Jobs</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {jobs?.map((job, idx) => (
                                <div 
                                    key={idx} 
                                    className={`
                                        p-2 rounded-lg border text-xs flex flex-col gap-0.5
                                        ${activeJob === job.id ? 'ring-2 ring-yellow-400 bg-yellow-400/10' : 'bg-muted/5'}
                                    `}
                                >
                                    <div className="flex justify-between font-bold">
                                        <span>{job.id}</span>
                                        <span className="text-green-600">${job.profit}</span>
                                    </div>
                                    <div className="text-muted-foreground">Deadline: {job.deadline}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {(!type || (type !== 'activity' && type !== 'coin' && type !== 'knapsack' && type !== 'huffman' && !huffmanNodes && !schedule)) && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a Greedy Algorithm to visualize.
                </div>
            )}
        </div>
    );
};
