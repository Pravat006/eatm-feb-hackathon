"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
    const itemVariants = {
        hidden: { opacity: 0, y: 30 }, // Changed from scale: 0.95 to y: 30 to match original initial state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } } // Changed from scale: 1 to y: 0
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6 bg-white selection:bg-black selection:text-white">
            <div className="max-w-4xl w-full flex flex-col items-center text-center">
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center gap-12"
                >
                    <div className="relative w-24 h-24 border border-border flex items-center justify-center">
                        <Icon className="w-8 h-8 opacity-40" />
                        <div className="absolute -top-1 -right-1 badge">Active_Sensing</div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-7xl md:text-9xl font-sans font-bold uppercase leading-[0.85] tracking-tighter">
                            {title}
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">
                            Modular Synchronization v0.4
                        </p>
                    </div>

                    <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl border-y border-border py-8">
                        {description} We are currently establishing secure peering with global intelligence nodes. Deployment sequence initiated for Q4 2026.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <Button asChild className="premium-button h-14 px-12">
                            <Link href="/">
                                Return to Navigation
                            </Link>
                        </Button>
                        <Button variant="outline" className="rounded-none border-border h-14 px-12 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all">
                            Request Early Access
                        </Button>
                    </div>

                    <div className="pt-24 grid grid-cols-3 gap-x-24 text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic">
                        <div>Loc: Zurich_Nexus</div>
                        <div>Access: Restricted</div>
                        <div>Ping: 14ms</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
