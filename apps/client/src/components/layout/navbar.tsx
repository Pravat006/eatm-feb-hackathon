"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const { isAuthenticated } = useAuthStore();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-24">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <Link href="/" className="font-sans text-xl font-bold tracking-tight">
                        SUPPLYCHAIN<span className="text-secondary font-medium">360</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10">
                        {[
                            { name: "Solutions", href: "/solutions" },
                            { name: "Intelligence", href: "/intelligence" },
                            { name: "Regional", href: "/global" },
                            { name: "Eco", href: "/sustainability" }
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="nav-link text-base"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <span className="cursor-pointer hover:text-foreground">EN</span>
                        <span className="w-px h-4 bg-border" />
                        <span className="cursor-pointer hover:text-foreground">Search</span>
                    </div>
                    {isAuthenticated ? (
                        <Button asChild className="premium-button">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="nav-link font-medium">
                                Log In
                            </Link>
                            <Button asChild className="premium-button">
                                <Link href="/register">Start Journey</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
