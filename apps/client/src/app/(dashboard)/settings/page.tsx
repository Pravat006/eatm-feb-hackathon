"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { Settings, User, Shield, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TeamManagement } from "@/components/settings/team-management";

export default function SettingsPage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="space-y-8 pb-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-4 border-black pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter uppercase flex items-center gap-4">
                        <Settings className="w-10 h-10" />
                        Settings
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">
                        Manage your profile identity and credentials
                    </p>
                </div>
            </div>

            <Card className="rounded-none border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
                <CardHeader className="p-8 border-b-4 border-black bg-muted/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Profile Identity</h2>
                            <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">Personal operator credentials</p>
                        </div>
                        <Badge variant="outline" className="rounded-none border-2 border-primary text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary/10">
                            {user.role}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 bg-black border-4 border-black flex items-center justify-center relative text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                                {user.name ? (
                                    <span className="text-6xl font-black uppercase">{user.name.charAt(0)}</span>
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">{user.name || "Operator"}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Connected via Clerk Secure Auth</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                <Input className="rounded-none border-2 border-black h-14 text-sm font-bold" value={user.name || ""} readOnly />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Authorization Role
                                </label>
                                <Input className="rounded-none border-2 border-black h-14 text-sm font-bold font-mono" value={user.role} readOnly />
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Email Address</label>
                                <Input className="rounded-none border-2 border-black h-14 text-sm font-bold" value={user.email} readOnly />
                            </div>
                            {user.campus && (
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Assigned Organization
                                    </label>
                                    <Input className="rounded-none border-2 border-black h-14 text-sm font-bold uppercase" value={user.campus.name} readOnly />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </CardContent>
            </Card>

            <div className="mt-8 flex items-center justify-center p-6 border-2 border-dashed border-border opacity-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-center">
                    Note: To edit your core identity details, manage your account through the Clerk portal.
                </p>
            </div>

            {user.role === "ADMIN" && <TeamManagement />}
        </div>
    );
}
