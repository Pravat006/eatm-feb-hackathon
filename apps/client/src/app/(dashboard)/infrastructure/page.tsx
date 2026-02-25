"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { assetService } from "@/services/asset.service";
import { Progress } from "@/components/ui/progress";
import { MapPin, History as HistoryIcon, Loader2, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function AssetsPage() {
    const [assets, setAssets] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [isLoading, setIsLoading] = useState(true);

    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const data = await assetService.getAll();
            setAssets(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to sync infrastructure assets.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const getRiskColor = (risk: number) => {
        if (risk > 0.7) return "bg-red-500";
        if (risk > 0.4) return "bg-yellow-400";
        return "bg-green-500";
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        Asset Control
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                        Mission-Critical Campus Infrastructure Tracking
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase opacity-60">Fleet Health</p>
                        <p className="text-xl font-black tabular-nums">{assets.filter(a => a.failureRisk < 0.5).length}/{assets.length}</p>
                    </div>
                    <Wrench className="w-8 h-8 opacity-40" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center border-4 border-black border-dashed">
                        <Loader2 className="w-10 h-10 animate-spin opacity-20" />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Mapping Grid...</p>
                    </div>
                ) : assets.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center border-4 border-black border-dashed">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No Assets Registered</p>
                    </div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="premium-card flex flex-col group hover:translate-x-1 hover:translate-y-1 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{asset.name}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{asset.type}</p>
                                </div>
                                <div className={cn("w-3 h-3 rounded-full border border-black", getRiskColor(asset.failureRisk))} />
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{asset.location}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                        <span>Failure Probability</span>
                                        <span className="tabular-nums">{(asset.failureRisk * 100).toFixed(1)}%</span>
                                    </div>
                                    <Progress value={asset.failureRisk * 100} className="h-2 rounded-none bg-muted border border-black overflow-hidden" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2">
                                        <HistoryIcon className="w-3 h-3 opacity-40" />
                                        <span className="text-[8px] font-black uppercase opacity-60">Last Maint: {new Date(asset.lastMaintenance).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 w-full h-12 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                                View Telemetry
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return inputs.filter(Boolean).join(" ");
}
