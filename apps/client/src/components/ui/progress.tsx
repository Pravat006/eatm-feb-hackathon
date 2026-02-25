"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
}

export const Progress = ({
    className,
    value = 0,
    ...props
}: ProgressProps) => {
    return (
        <div
            className={cn(
                "bg-white border-2 border-black relative h-6 w-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                className
            )}
            {...props}
        >
            <div
                className="bg-primary h-full transition-all border-r-2 border-black"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    )
}
