"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { campusService } from "@/services/campus.service";
import { CampusDto } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, XCircle, Loader2, ShieldAlert, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SuperAdminPage() {
    const { user } = useAuthStore();
    const [pendingCampuses, setPendingCampuses] = useState<CampusDto[]>([]);
    const [activeCampuses, setActiveCampuses] = useState<CampusDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [pendingData, activeData] = await Promise.all([
                campusService.getPending(),
                campusService.getActive()
            ]);
            setPendingCampuses(pendingData);
            setActiveCampuses(activeData);
        } catch (error) {
            console.error("Failed to fetch campuses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReview = async (id: string, action: "APPROVE" | "REJECT") => {
        try {
            setActionLoading(id);
            await campusService.reviewRequest(id, action);
            if (action === "APPROVE") {
                const approved = pendingCampuses.find(c => c.id === id);
                if (approved) {
                    setActiveCampuses(prev => [...prev, { ...approved, status: "ACTIVE" } as any]);
                }
            }
            setPendingCampuses((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error(`Failed to ${action} campus:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    if (user?.role !== "SUPER_ADMIN") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
                <h2 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h2>
                <p className="text-muted-foreground uppercase tracking-widest text-xs mt-2 font-bold">
                    Super Admin privileges required
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b-4 border-black pb-8">
                    <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <ShieldAlert className="w-12 h-12" />
                        Platform Control
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Review and manage platform organizations
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="mb-8 p-1 bg-muted/20 border-2 border-black inline-flex rounded-none">
                            <TabsTrigger value="pending" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white uppercase font-black tracking-widest text-xs px-8">
                                Pending Requests ({pendingCampuses?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="active" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white uppercase font-black tracking-widest text-xs px-8">
                                Active Organizations ({activeCampuses?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                            {(!pendingCampuses || pendingCampuses.length === 0) ? (
                                <div className="border-4 border-black border-dashed p-16 text-center text-muted-foreground bg-muted/20">
                                    <h2 className="text-xl font-black uppercase tracking-widest">Zero Pending Requests</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest mt-2">All caught up. Good job, Commander.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {pendingCampuses.map((campus, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={campus.id}
                                            className="px-6 py-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col md:flex-row justify-between gap-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter">{campus.name}</h3>
                                                        <div className="flex flex-wrap gap-4 mt-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                                {campus.type}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                                                                Submitted {format(new Date(campus.createdAt), "MMM d, yyyy")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">Organization Email</span>
                                                        <span className="font-bold">{campus.contactEmail || "N/A"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">Registered By</span>
                                                        <span className="font-bold">
                                                            {campus.users?.[0] ? `${campus.users[0].name} (${campus.users[0].email})` : "Unknown — Legacy Record"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[160px] border-t-2 border-black border-dashed pt-4 md:pt-0 md:border-t-0 md:border-l-2 md:pl-6">
                                                <Button
                                                    onClick={() => handleReview(campus.id, "APPROVE")}
                                                    disabled={actionLoading === campus.id}
                                                    className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-black border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none"
                                                >
                                                    {actionLoading === campus.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleReview(campus.id, "REJECT")}
                                                    disabled={actionLoading === campus.id}
                                                    variant="outline"
                                                    className="flex-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-2 border-red-200 hover:border-red-600 font-black uppercase tracking-widest transition-all rounded-none"
                                                >
                                                    {actionLoading === campus.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                                    Reject
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="active">
                            {(!activeCampuses || activeCampuses.length === 0) ? (
                                <div className="border-4 border-black border-dashed p-16 text-center text-muted-foreground bg-muted/20">
                                    <h2 className="text-xl font-black uppercase tracking-widest">No Active Organizations</h2>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {activeCampuses.map((campus, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={campus.id}
                                            className="px-6 py-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col md:flex-row justify-between gap-6"
                                        >
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter">{campus.name}</h3>
                                                        <div className="flex flex-wrap gap-4 mt-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-200 px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                                {campus.type}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                                                                Active Since {format(new Date(campus.createdAt), "MMM d, yyyy")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">Organization Email</span>
                                                        <span className="font-bold">{campus.contactEmail || "N/A"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">Registered By</span>
                                                        <span className="font-bold">
                                                            {campus.users?.[0] ? `${campus.users[0].name} (${campus.users[0].email})` : "System / Legacy"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-t-2 border-black border-dashed pt-4 md:pt-0 md:border-t-0 md:border-l-2 md:pl-6 text-green-600">
                                                <BadgeCheck className="w-8 h-8 mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">Active<br />Tenant</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
