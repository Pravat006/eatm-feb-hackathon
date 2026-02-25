"use client";

import { Sidebar } from "@/components/layout/sidebar";

import { useCampusAuth } from "@/lib/hooks/use-campus-auth";
import { useEffect } from "react";
import { Search, Wifi, WifiOff, Loader2, ShieldAlert } from "lucide-react";
import { useWebSocketStore } from "@/lib/stores/websocket.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user } = useCampusAuth();

    const { connect, disconnect, isConnected } = useWebSocketStore();

    useEffect(() => {
        if (isAuthenticated && user?.campusId) {
            connect();
        }
    }, [isAuthenticated, user?.campusId, connect]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 flex flex-col transition-all duration-300 ml-20 md:ml-64 relative">
                {/* Top Header */}
                <header className="h-24 flex items-center justify-between px-8 bg-white border-b border-border sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search reports, assets, or status..."
                                className="w-full h-12 bg-background border border-border pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary transition-colors hover:border-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button variant="outline" size="icon" className="relative group border-border hover:border-foreground rounded-none w-12 h-12 shrink-0">
                            {isConnected ? (
                                <Wifi className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" />
                            ) : (
                                <WifiOff className="w-5 h-5 text-muted-foreground transition-colors" />
                            )}
                            <span className={cn(
                                "absolute top-3 right-3 w-1.5 h-1.5",
                                isConnected ? "bg-green-500 shadow-[0_0_10px_var(--color-green-500)] animate-pulse" : "bg-muted-foreground"
                            )} />
                        </Button>



                        <div className="h-12 w-px bg-border mx-2" />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-foreground">{user?.name}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">User Details</p>
                            </div>
                            <div className="w-12 h-12 bg-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
                    {!user?.campusId && user?.role !== "SUPER_ADMIN" && (
                        <div className="mb-8 w-full border-4 border-black bg-yellow-400 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldAlert className="w-6 h-6" /> Organization Required
                                </h3>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-tight mt-1">
                                    You must be linked to an active campus organization to fully utilize dashboard tracking and reporting tools.
                                </p>
                            </div>
                            <Button
                                onClick={() => window.location.href = '/onboarding'}
                                className="h-12 border-2 border-black bg-black text-white rounded-none uppercase font-black tracking-widest shrink-0"
                            >
                                Link Organization
                            </Button>
                        </div>
                    )}

                    {user?.campus?.status === "PENDING" && user.role !== "SUPER_ADMIN" ? (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md w-full border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white p-10 text-center flex flex-col items-center gap-6"
                            >
                                <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-black animate-spin" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Under Review</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                                        Your organization ({user.campus.name}) is currently pending approval from the Super Admin. You will gain full dashboard access once verified.
                                    </p>
                                </div>
                                <Button className="w-full h-12 rounded-none border-2 border-black font-black uppercase tracking-widest bg-black text-white" disabled>
                                    Awaiting Activation...
                                </Button>
                            </motion.div>
                        </div>
                    ) : null}

                    <div className={cn(user?.campus?.status === "PENDING" && user.role !== "SUPER_ADMIN" ? "opacity-20 pointer-events-none select-none blur-sm" : "")}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
