"use client";

export const dynamic = "force-dynamic";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState<"USER" | "MANAGER" | null>(null);

    // Save intention so backend can pick it up on first sync
    useEffect(() => {
        if (selectedRole) {
            localStorage.setItem("intended_role", selectedRole);
        }
    }, [selectedRole]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white selection:bg-black selection:text-white">
            <div className="w-full max-w-[450px]">
                <div className="flex items-center gap-4 justify-center mb-12">
                    <Link href="/" className="font-sans text-3xl font-black uppercase tracking-tighter">
                        Campus Care
                    </Link>
                </div>

                <div className="premium-card flex flex-col items-center">
                    <div className="mb-8 text-center w-full">
                        <h1 className="text-4xl font-sans font-black uppercase mb-2 leading-none">Authorization</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select your division to proceed</p>
                    </div>

                    {!selectedRole ? (
                        <div className="w-full flex flex-col gap-4">
                            <button
                                onClick={() => setSelectedRole("USER")}
                                className="group relative flex items-center p-6 border-4 border-black bg-white hover:bg-black hover:text-white transition-all text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                            >
                                <div className="w-12 h-12 bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center mr-6 shrink-0 border-2 border-black group-hover:border-white transition-colors">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-1">Standard User</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Students & Staff</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedRole("MANAGER")}
                                className="group relative flex items-center p-6 border-4 border-black bg-white hover:bg-black hover:text-white transition-all text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                            >
                                <div className="w-12 h-12 bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center mr-6 shrink-0 border-2 border-black group-hover:border-white transition-colors">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-1">Management</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Admins & Operators</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6 flex justify-between items-center border-b-2 border-black pb-4">
                                <span className="text-xs font-black uppercase tracking-widest">
                                    Role Selected: <span className="text-blue-600 bg-blue-100 px-2 py-1 ml-1 border border-black">{selectedRole}</span>
                                </span>
                                <button onClick={() => setSelectedRole(null)} className="text-[10px] font-bold uppercase tracking-widest hover:underline text-muted-foreground">
                                    Change
                                </button>
                            </div>

                            <SignIn
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-none border-none p-0",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "h-16 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase tracking-widest text-xs",
                                        socialButtonsBlockButtonText: "font-black tracking-widest",
                                        formButtonPrimary: "h-14 bg-black hover:bg-black/90 text-white rounded-none border-2 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all",
                                        footer: "hidden"
                                    }
                                }}
                                redirectUrl="/dashboard"
                                routing="hash"
                            />
                        </div>
                    )}

                    <div className="mt-12 text-center w-full">
                        <div className="inline-block px-4 py-2 border border-border text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic">
                            NODE_PROTOCOL: CAMPUS-V1 / SECURE_LAYER: CLERK
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Don&apos;t have an account? <Link href="/register" className="text-black hover:underline underline-offset-4">Register here</Link>
                </p>
            </div>
        </div>
    );
}
