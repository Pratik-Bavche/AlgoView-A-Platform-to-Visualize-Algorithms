import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

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
                {/* Background grid lines could go here */}
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
        type, // 'activity', 'coin', 'knapsack', 'huffman'
        items = [],
        coins = [],
        activities = [],
        currentCapacity,
        maxCapacity,
        totalValue
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

            {type === 'coin' && (
                <div className="flex flex-col items-center gap-8 py-8">
                    <div className="text-2xl font-bold font-mono">
                        Remaining Amount: <span className="text-primary">{stepData.remainingAmount}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {coins.map((coin, idx) => (
                            <CoinItem key={idx} {...coin} />
                        ))}
                    </div>
                    <div className="w-full max-w-md p-4 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">Collected Coins</h4>
                        <div className="flex flex-wrap gap-2">
                            {stepData.result && stepData.result.map((c, i) => (
                                <Badge key={i} variant="secondary" className="text-lg px-3 py-1">{c}</Badge>
                            ))}
                        </div>
                    </div>
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

            {!type && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a Greedy Algorithm to visualize.
                </div>
            )}
        </div>
    );
};
