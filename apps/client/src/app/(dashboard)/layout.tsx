"use client";

import { Sidebar } from "@/components/layout/sidebar";

import { useAuthStore } from "@/lib/stores/auth.store";
// Removed unused useRouter
import { useEffect } from "react";
import { Search, Wifi, WifiOff } from "lucide-react";
import { useWebSocketStore } from "@/lib/stores/websocket.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user } = useAuthStore();
    // ...

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
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
