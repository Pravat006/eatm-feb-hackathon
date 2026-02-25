"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { campusService } from "@/services/campus.service";
import { format } from "date-fns";

export function TeamManagement() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [members, setMembers] = useState<any[]>([]); // Using any since UserDto might not be fully available
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const data = await campusService.getMembers();
            setMembers(data);
        } catch (err) {
            console.error("Failed to load members", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsInviting(true);
        setError(null);
        try {
            await campusService.inviteStaff(inviteEmail);
            setInviteEmail("");
            fetchMembers(); // refresh
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
            setError(errorObj.response?.data?.message || errorObj.message || "Failed to invite staff");
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <Card className="rounded-none border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white mt-12">
            <CardHeader className="p-8 border-b-4 border-black bg-muted/20">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                            <Users className="w-8 h-8" /> Team Management
                        </h2>
                        <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                            Invite and manage your organization&apos;s staff members
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
                {/* Invite Form */}
                <form onSubmit={handleInvite} className="bg-black text-white p-6 border-2 border-black">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> Invite New Staff
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            type="email"
                            placeholder="staff@organization.com"
                            className="h-12 border-2 border-white/20 bg-white/10 text-white placeholder:text-white/40 rounded-none focus-visible:border-primary focus-visible:ring-0"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            disabled={isInviting}
                            required
                        />
                        <Button
                            type="submit"
                            className="h-12 px-8 uppercase font-black tracking-widest rounded-none bg-primary text-white border-2 border-transparent hover:border-white hover:bg-primary transition-all shrink-0"
                            disabled={isInviting || !inviteEmail}
                        >
                            {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Invite"}
                        </Button>
                    </div>
                    {error && (
                        <p className="text-secondary text-xs font-bold mt-4 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> {error}
                        </p>
                    )}
                </form>

                {/* Members List */}
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">
                        Current Members ({members.length})
                    </h3>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-black" />
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {members.map((member) => (
                                <div key={member.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-2 border-black hover:bg-muted/10 transition-colors gap-4">
                                    <div>
                                        <p className="font-black uppercase tracking-tighter text-lg">{member.name}</p>
                                        <p className="font-bold text-xs text-muted-foreground uppercase opacity-80">{member.email}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Joined</p>
                                            <p className="text-xs font-bold uppercase">{format(new Date(member.createdAt), "MMM d, yyyy")}</p>
                                        </div>
                                        <Badge variant="outline" className={`rounded-none border-2 px-3 py-1 font-black uppercase tracking-widest text-[10px] ${member.role === 'ADMIN' ? 'border-primary text-primary bg-primary/10' :
                                            member.role === 'MANAGER' ? 'border-blue-500 text-blue-500 bg-blue-500/10' :
                                                'border-black text-black'
                                            }`}>
                                            {member.role === 'MANAGER' ? 'STAFF' : member.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
