import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 border-black text-sm font-black uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white",
        destructive:
          "bg-destructive text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black",
        outline:
          "bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary hover:text-white",
        secondary:
          "bg-secondary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black",
        ghost:
          "border-transparent hover:border-black hover:bg-primary hover:text-white",
        link: "border-transparent text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-12 px-6 py-2 has-[>svg]:px-4",
        xs: "h-8 gap-1 px-3 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 px-8 has-[>svg]:px-6 text-base",
        icon: "size-12",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
