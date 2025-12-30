import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Clock, Database, Network, ShoppingBag, Users, Zap, AlertCircle, MapPin, Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const GanttChart = ({ tasks = [] }) => (
    <div className="w-full flex flex-col gap-6">
        {tasks.map((task, idx) => (
            <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 truncate">{task.name}</span>
                    <span className="text-[8px] font-mono opacity-40">{task.start}h - {task.start + task.duration}h</span>
                </div>
                <div className="flex-1 h-10 bg-muted/20 rounded-2xl relative overflow-hidden border border-border/50 p-1">
                    <motion.div
                        initial={{ width: 0, x: task.start * 10 }}
                        animate={{ width: `${task.duration * 10}%`, x: `${task.start * 10}%` }}
                        className={`h-full rounded-xl border-2 flex items-center px-3 ${task.status === 'conflict' ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'}`}
                    >
                        {task.status === 'conflict' && <AlertCircle size={12} className="text-red-500 mr-2 shrink-0" />}
                        <span className="text-[10px] font-bold truncate">{task.status === 'conflict' ? 'BUSY' : 'SCHEDULED'}</span>
                    </motion.div>
                </div>
            </div>
        ))}
    </div>
);

const RoutingVisualizer = ({ highlights = [] }) => {
    // Fake city map nodes
    const nodes = [
        { x: 10, y: 10, name: 'Home', icon: '🏠' },
        { x: 50, y: 20, name: 'Main St', icon: '🛣️' },
        { x: 90, y: 10, name: 'Mall', icon: '🛒' },
        { x: 30, y: 60, name: 'Bridge', icon: '🌉' },
        { x: 70, y: 80, name: 'Office', icon: '🏢' },
        { x: 10, y: 90, name: 'Park', icon: '🌳' },
    ];

    return (
        <div className="relative w-full aspect-video bg-muted/5 rounded-3xl border border-dashed border-border/50 overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

            {/* Draw Roads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="10%" y1="10%" x2="50%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                <line x1="50%" y1="20%" x2="90%" y2="10%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                <line x1="10%" y1="10%" x2="30%" y2="60%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                <line x1="30%" y1="60%" x2="70%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                <line x1="50%" y1="20%" x2="70%" y2="80%" stroke="currentColor" strokeWidth="3" className="text-primary opacity-60" />
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                >
                    <div className="p-2 bg-background border border-border/50 rounded-xl shadow-lg ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all">
                        <span className="text-sm">{node.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{node.name}</span>
                </motion.div>
            ))}

            {/* Path Animation */}
            <motion.div
                initial={{ left: "10%", top: "10%" }}
                animate={{ left: ["10%", "50%", "70%"], top: ["10%", "20%", "80%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
                <div className="p-2 bg-primary rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <Truck size={14} className="text-white" />
                </div>
            </motion.div>

            <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/20 text-primary">Live Traffic Active</Badge>
            </div>
        </div>
    );
}

const AllocationGrid = ({ resources = [] }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {resources.map((res, idx) => (
            <div key={idx} className="p-5 bg-muted/10 border border-border/50 rounded-3xl flex flex-col gap-4 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-center">
                    <div className={`p-2 rounded-xl ${res.load > 90 ? 'bg-red-500/10' : 'bg-primary/10'}`}>
                        <Database size={16} className={res.load > 90 ? 'text-red-400' : 'text-primary'} />
                    </div>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{res.name}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className={res.load > 90 ? 'text-red-500' : 'text-muted-foreground'}>{res.load}% Stress</span>
                        <span className="opacity-40">{res.tasks} Active</span>
                    </div>
                    <Progress value={res.load} className={`h-2 ${res.load > 90 ? 'bg-red-500/20' : ''}`} />
                </div>
            </div>
        ))}
    </div>
);

const KnapsackPacking = ({ items = [], capacity = 100, currentWeight = 0 }) => (
    <div className="w-full flex flex-col gap-10">
        <div className="relative w-full h-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50 flex items-center justify-between px-8 overflow-hidden">
            <motion.div
                className="absolute left-0 top-0 h-full bg-primary/20"
                animate={{ width: `${(currentWeight / capacity) * 100}%` }}
            />
            <div className="relative flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl">
                    <ShoppingBag size={24} className="text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Container Load</span>
                    <span className="text-2xl font-black font-mono tracking-tighter">{currentWeight.toFixed(1)} / {capacity} kg</span>
                </div>
            </div>
            <Badge className="relative">{Math.round((currentWeight / capacity) * 100)}% Full</Badge>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
            {items.map((item, idx) => (
                <motion.div
                    key={idx}
                    layout
                    className={`p-6 aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center gap-3 transition-all duration-500 relative ${item.selected ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-105' : 'bg-muted/5 border-border/10 opacity-30 grayscale'}`}
                >
                    {item.selected && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    )}
                    <div className="p-3 bg-background/50 rounded-2xl">
                        <ShoppingBag size={18} />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter truncate w-full text-center">{item.name}</span>
                        <span className="text-sm font-black text-primary">${item.value}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export const RealWorldVisualizer = ({ stepData }) => {
    // Safety check
    if (!stepData) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-20">
                <Zap size={64} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Simulation Offline</span>
            </div>
        );
    }

    const {
        type_special: type = 'scheduling',
        tasks = [],
        resources = [],
        items = [],
        capacity = 100,
        currentWeight = 0,
        description = '',
        status = 'neutral'
    } = stepData;

    const getIcon = () => {
        switch (type) {
            case 'scheduling': return <Clock className="text-blue-500" />;
            case 'allocation': return <Database className="text-purple-500" />;
            case 'packing': return <ShoppingBag className="text-green-500" />;
            case 'routing': return <Truck className="text-orange-500" />;
            case 'matching': return <Users className="text-pink-500" />;
            default: return <Activity className="text-primary" />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 lg:p-12 gap-8 lg:gap-12 overflow-hidden bg-gradient-to-b from-background to-background/50">

            {/* Simulation Header */}
            <div className="flex flex-col items-center gap-4 text-center mt-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 bg-muted/20 rounded-[2rem] border border-border/50 shadow-inner"
                >
                    {getIcon()}
                </motion.div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black capitalize tracking-tight">{type.replace('-', ' ')} Simulation</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Real-Time Algorithmic Analysis</p>
                </div>
            </div>

            {/* Specialized View Container */}
            <div className="w-full max-w-5xl flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={type}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full"
                    >
                        {type === 'scheduling' && <GanttChart tasks={tasks} />}
                        {type === 'allocation' && <AllocationGrid resources={resources} />}
                        {type === 'packing' && <KnapsackPacking items={items} capacity={capacity} currentWeight={currentWeight} />}
                        {(type === 'routing' || type === 'matching') && <RoutingVisualizer />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* AI Narrative Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={description}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="flex items-start gap-5 p-8 bg-muted/20 backdrop-blur-md rounded-[2.5rem] border border-border/50 max-w-3xl shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                    <div className="p-3 bg-primary/10 rounded-2xl shrink-0 group-hover:rotate-12 transition-transform">
                        <AlertCircle className="text-primary" size={24} />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Decision Insight</span>
                        <p className="text-sm font-medium leading-relaxed opacity-80">{description || "System is calculating optimal decision path..."}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Decision Status Bar */}
            <div className="flex flex-wrap justify-center gap-10 bg-muted/10 px-12 py-4 rounded-full border border-border/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground group">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500/30 border border-blue-500 group-hover:scale-125 transition-transform" />
                    Pending
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground group">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse" />
                    Evaluating
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground group">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    Optimized
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground group">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    Conflict
                </div>
            </div>
        </div>
    );
};
