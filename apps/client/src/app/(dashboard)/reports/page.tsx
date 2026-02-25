"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import SmartComplaintForm from "@/components/forms/complaint-form";
import { toast } from "sonner";
import { useWebSocketStore } from "@/lib/stores/websocket.store";
import { ticketService, Ticket } from "@/services/ticket.service"; // Added import

export default function ComplaintsPage() {
    const { user } = useAuthStore();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [_selectedTicket, _setSelectedTicket] = useState<Ticket | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

    const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            // The ticketService.getAll() should handle the isAdmin logic internally or be adapted
            const data = await ticketService.getAll();
            setTickets(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to sync centralized reports.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [isAdmin]);

    // Handle WebSocket updates
    const { socket } = useWebSocketStore();
    useEffect(() => {
        if (!socket) return;
        socket.on("notification", (msg: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (msg.type === "TICKET_CREATED" || msg.type === "TICKET_UPDATED") {
                fetchTickets();
            }
        });
        return () => {
            socket.off("notification");
        };
    }, [socket]);

    const handleUpdateStatus = async (id: string, newStatus: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        try {
            await ticketService.updateStatus(id, newStatus);
            toast.success(`Ticket marked as ${newStatus}`);
            fetchTickets();
        } catch {
            toast.error("Status update failed.");
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case "CRITICAL": return "bg-red-500 text-white";
            case "HIGH": return "bg-orange-500 text-white";
            case "MEDIUM": return "bg-yellow-400 text-black";
            default: return "bg-black text-white";
        }
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case "RESOLVED": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "IN_PROGRESS": return <Clock className="w-4 h-4 text-yellow-500" />;
            case "CLOSED": return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        {isAdmin ? "Admin Vision" : "My Reports"}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                        {isAdmin ? "Global Campus Maintenance Logistics" : "Your Infrastructure Documentation"}
                    </p>
                </div>

                {!isAdmin && (
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="h-14 px-8 bg-black text-white hover:bg-neutral-800 rounded-none font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                <Plus className="mr-2 h-4 w-4" /> New Report
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-[450px] border-l-4 border-black p-0">
                            <div className="h-full flex flex-col">
                                <SheetHeader className="p-8 border-b-2 border-black bg-yellow-400">
                                    <SheetTitle className="text-3xl font-black uppercase tracking-tight">File Complaint</SheetTitle>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">AI Verification Engine Enabled</p>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-8 bg-white">
                                    <SmartComplaintForm onSuccess={() => setIsSheetOpen(false)} />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            <div className="border-4 border-black p-1 bg-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="bg-white overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-[#fafafa] border-b-2 border-black">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Subject</TableHead>
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Location</TableHead>
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Category</TableHead>
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Level</TableHead>
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Status</TableHead>
                                {isAdmin && <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Action</TableHead>}
                                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-right whitespace-nowrap">Raised On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 7 : 6} className="h-64 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto opacity-20" />
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Syncing database...</p>
                                    </TableCell>
                                </TableRow>
                            ) : tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 7 : 6} className="h-64 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Null Records Found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((t: Ticket) => (
                                    <TableRow key={t.id} className="border-b border-black/5 hover:bg-muted/5 transition-colors">
                                        <TableCell className="font-sans font-bold text-sm max-w-[200px] truncate">{t.title}</TableCell>
                                        <TableCell className="text-[10px] font-black uppercase text-muted-foreground">{t.location}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-2 border-black rounded-none font-black text-[8px] uppercase">{t.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn("rounded-none font-black text-[8px] uppercase", getPriorityColor(t.priority))}>
                                                {t.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(t.status)}
                                                <span className="text-[10px] font-black uppercase">{t.status.replace('_', ' ')}</span>
                                            </div>
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {t.status === "OPEN" && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-black text-white text-[8px] font-black uppercase rounded-none"
                                                            onClick={() => handleUpdateStatus(t.id, "IN_PROGRESS")}
                                                        >
                                                            Take Action
                                                        </Button>
                                                    )}
                                                    {t.status === "IN_PROGRESS" && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-green-500 text-white text-[8px] font-black uppercase rounded-none"
                                                            onClick={() => handleUpdateStatus(t.id, "RESOLVED")}
                                                        >
                                                            Resolve
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right text-[10px] font-black opacity-40 uppercase tabular-nums">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return inputs.filter(Boolean).join(" ");
}
