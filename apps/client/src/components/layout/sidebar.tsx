"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Wrench,
    ChevronLeft,
    ChevronRight,
    LogOut,
    MessageSquare,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useClerk } from "@clerk/nextjs";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["ADMIN", "MANAGER", "USER", "SUPER_ADMIN"] },
    { icon: FileText, label: "Complaints", href: "/reports", roles: ["ADMIN", "MANAGER", "USER"] },
    { icon: Wrench, label: "Infrastructure", href: "/infrastructure", roles: ["ADMIN", "MANAGER"] },
    { icon: MessageSquare, label: "Messages", href: "/chat", roles: ["ADMIN", "MANAGER", "USER"] },
    { icon: ShieldCheck, label: "Organizations", href: "/super-admin", roles: ["SUPER_ADMIN"] },
    { icon: Settings, label: "Settings", href: "/settings", roles: ["ADMIN", "MANAGER", "USER", "SUPER_ADMIN"] },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuthStore();
    const { signOut } = useClerk();

    const handleLogout = async () => {
        logout(); // Clear local zustand store
        await signOut({ redirectUrl: "/" }); // Send them back to landing page via Clerk
    };

    const filteredItems = menuItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <aside
            className={cn(
                "fixed h-screen left-0 top-0 z-40 flex flex-col bg-background border-r-2 border-black transition-all duration-300 shadow-neo",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Brand */}
            <div className="h-24 flex items-center px-6 gap-4 border-b-2 border-black bg-white">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0 font-black text-lg border-2 border-black">
                    AI
                </div>
                {!isCollapsed && (
                    <span className="font-black text-xl tracking-tighter uppercase font-sans leading-none">
                        Campus<span className="text-primary">Care</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-4">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 border-2 transition-all group relative",
                                isActive
                                    ? "bg-primary text-white border-black shadow-neo-sm"
                                    : "border-transparent hover:border-black hover:bg-white text-foreground/70 hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-foreground group-hover:text-primary")} />
                            {!isCollapsed && (
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className="absolute right-4 w-2 h-2 bg-white" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Collapse */}
            <div className="p-4 border-t-2 border-black space-y-4 bg-white">
                {!isCollapsed && (
                    <div className="px-4 py-3 bg-background border-2 border-black shadow-neo-sm hover:shadow-none transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-sm font-black text-white">
                                {user?.name?.charAt(0) || "O"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-black truncate text-foreground uppercase tracking-tight">{user?.name || "Operator"}</p>
                                <p className="text-[10px] text-primary uppercase font-black tracking-widest leading-none mt-1">{user?.role || "GUEST"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <Button
                        variant="ghost"
                        className="flex-1 justify-start gap-3 h-12 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-12 w-12 border-2 border-black bg-white hover:bg-primary hover:text-white transition-all shadow-neo-sm active:translate-x-px active:translate-y-px active:shadow-none"
                    >
                        {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
