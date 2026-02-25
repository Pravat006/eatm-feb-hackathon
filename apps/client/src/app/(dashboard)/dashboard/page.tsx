"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ticketService, Ticket } from "@/services/ticket.service";
import { assetService } from "@/services/asset.service";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    ShieldCheck,
    Wrench,
    Zap
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";

// ── Mock / derived data ──────────────────────────────────────────────────────

const weeklyTrend = [
    { day: "Mon", open: 4, resolved: 3, inProgress: 1 },
    { day: "Tue", open: 7, resolved: 5, inProgress: 3 },
    { day: "Wed", open: 5, resolved: 6, inProgress: 2 },
    { day: "Thu", open: 12, resolved: 8, inProgress: 5 },
    { day: "Fri", open: 8, resolved: 10, inProgress: 4 },
    { day: "Sat", open: 3, resolved: 4, inProgress: 1 },
    { day: "Sun", open: 2, resolved: 3, inProgress: 0 },
];

const monthlyResolution = [
    { month: "Sep", rate: 72 },
    { month: "Oct", rate: 78 },
    { month: "Nov", rate: 81 },
    { month: "Dec", rate: 85 },
    { month: "Jan", rate: 80 },
    { month: "Feb", rate: 88 },
];

const categoryRisk = [
    { subject: "Electrical", A: 80 },
    { subject: "Plumbing", A: 55 },
    { subject: "Structural", A: 70 },
    { subject: "IT/Network", A: 40 },
    { subject: "HVAC", A: 65 },
    { subject: "Safety", A: 90 },
];

const DONUT_COLORS = ["#000000", "#ef4444", "#f59e0b", "#10b981"];
const DONUT_DATA = [
    { name: "Electrical", value: 32 },
    { name: "Plumbing", value: 24 },
    { name: "Structural", value: 27 },
    { name: "IT Infra", value: 17 },
];

const tooltipStyle = {
    border: "3px solid black",
    borderRadius: 0,
    fontWeight: 900,
    textTransform: "uppercase" as const,
    fontSize: 10,
    boxShadow: "4px 4px 0 black",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [healthData, setHealthData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [health, ticketData] = await Promise.all([
                    assetService.getHealthScore(),
                    ticketService.getAll(),
                ]);
                setHealthData(health);
                setTickets(ticketData);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const score = healthData?.score ?? 92;
    const statusLabel = healthData?.status ?? "OPTIMAL";
    const isCritical = statusLabel === "CRITICAL";

    const stats = [
        {
            label: "Active Reports",
            value: tickets.length || 24,
            icon: Activity,
            color: "bg-white border-black",
            accent: "",
        },
        {
            label: "Critical Risks",
            value: tickets.filter((t) => t.priority === "CRITICAL").length || 3,
            icon: AlertTriangle,
            color: "bg-red-500 text-white border-black",
            accent: "text-white",
        },
        {
            label: "Resolution Rate",
            value: "88%",
            icon: CheckCircle2,
            color: "bg-yellow-400 border-black",
            accent: "",
        },
        {
            label: "Avg. Response",
            value: "2.4h",
            icon: Clock,
            color: "bg-white border-black",
            accent: "",
        },
        {
            label: "Assets Tracked",
            value: 48,
            icon: Wrench,
            color: "bg-black text-white border-black",
            accent: "text-white",
        },
        {
            label: "AI Detections",
            value: 12,
            icon: Zap,
            color: "bg-white border-black",
            accent: "",
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-44 bg-muted/20 border-4 border-black border-dashed" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-28 bg-muted/20 border-2 border-black" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-72 bg-muted/20 border-2 border-black" />
                    <div className="h-72 bg-muted/20 border-2 border-black" />
                </div>
            </div>
        );
    }

    if (user?.role === "SUPER_ADMIN") {
        return (
            <div className="space-y-10">
                <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 flex flex-col items-center justify-center gap-8 text-center min-h-[400px]">
                    <ShieldCheck className="w-24 h-24 text-black" />
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                            Platform Control Dashboard
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                            Welcome back, Admin. Your primary responsibility is overseeing organization access requests and managing high-level multi-tenant settings. Because of your role level, you do not manage on-site tickets or campus-level messages.
                        </p>
                        <button onClick={() => router.push('/super-admin')} className="h-14 px-8 bg-black hover:bg-black/90 text-white border-2 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                            Manage Organizations
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isStaffOrAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

    if (!isStaffOrAdmin) {
        return (
            <div className="space-y-10">
                <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                            Welcome to Campus Care, {user?.name?.split(" ")[0] || "Student"}
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground max-w-lg leading-relaxed">
                            Report issues, track your tickets, and help us maintain a safe and optimal environment. Your quick feedback helps resolve issues faster!
                        </p>
                    </div>
                    <div className="w-32 h-32 bg-[#22c55e] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-16 h-16 text-black" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={() => router.push('/reports')}
                        className="p-8 border-4 border-black bg-[#f59e0b] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                        <AlertTriangle className="w-8 h-8" />
                        <div>
                            <h3 className="font-black uppercase tracking-widest">Report Issue</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Log a new ticket</p>
                        </div>
                    </div>
                    <div
                        onClick={() => router.push('/reports')}
                        className="p-8 border-4 border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                        <Activity className="w-8 h-8" />
                        <div>
                            <h3 className="font-black uppercase tracking-widest">My Tickets</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{tickets.length > 0 ? `${tickets.length} Active` : 'No active tickets'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">

            {/* ── Hero Health Score Card ── */}
            <div className="border-4 border-black bg-black text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">
                        AI-Driven Infrastructure Analysis
                    </p>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        Campus Health<br />Score
                    </h1>
                    <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1 border-2 border-white text-[10px] font-black uppercase tracking-widest",
                        isCritical ? "bg-red-600" : "bg-green-600"
                    )}>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        {statusLabel}
                    </div>
                </div>

                {/* Score Ring approximation using recharts RadialBar */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <ResponsiveContainer width={180} height={180}>
                            <PieChart>
                                <Pie
                                    data={[{ value: score }, { value: 100 - score }]}
                                    innerRadius={55}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    <Cell fill={isCritical ? "#ef4444" : "#22c55e"} />
                                    <Cell fill="rgba(255,255,255,0.1)" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black">{score}%</span>
                        </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Overall Score</p>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={cn(
                            "p-5 border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all",
                            stat.color
                        )}
                    >
                        <stat.icon className={cn("w-6 h-6", stat.accent)} />
                        <div>
                            <p className={cn("text-[9px] font-black uppercase tracking-widest opacity-60", stat.accent)}>
                                {stat.label}
                            </p>
                            <p className={cn("text-2xl font-black tracking-tighter", stat.accent)}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Row 1: Weekly Trend + Category Donut ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Weekly Complaint Volume — stacked bar */}
                <div className="lg:col-span-2 p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5" /> Weekly Report Volume
                    </h3>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyTrend} barGap={3}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend
                                    wrapperStyle={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase" }}
                                />
                                <Bar dataKey="open" name="Open" fill="#000" stackId="a" />
                                <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" stackId="a" />
                                <Bar dataKey="resolved" name="Resolved" fill="#22c55e" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown Donut */}
                <div className="p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5" /> Issue Categories
                    </h3>
                    <div className="flex-1 min-h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={DONUT_DATA}
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={3}
                                    stroke="#fff"
                                >
                                    {DONUT_DATA.map((_, i) => (
                                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {DONUT_DATA.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-3 h-3 border border-black shrink-0" style={{ background: DONUT_COLORS[i] }} />
                                <span className="text-[9px] font-black uppercase">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Row 2: Resolution Rate Trend + Radar ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Monthly Resolution Rate — line chart */}
                <div className="p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" /> Resolution Rate (6 Months)
                    </h3>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyResolution}>
                                <defs>
                                    <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} unit="%" />
                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v ?? 0}%`, "Rate"]} />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#000"
                                    strokeWidth={3}
                                    fill="url(#resGrad)"
                                    dot={{ fill: "#000", strokeWidth: 0, r: 5 }}
                                    activeDot={{ r: 7, fill: "#f59e0b", stroke: "#000", strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Radar */}
                <div className="p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <Zap className="w-5 h-5" /> Risk Radar by Category
                    </h3>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={categoryRisk}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fontSize: 9, fontWeight: 900, textAnchor: "middle" }}
                                />
                                <Radar
                                    name="Risk Level"
                                    dataKey="A"
                                    stroke="#000"
                                    fill="#000"
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                                <Tooltip contentStyle={tooltipStyle} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
