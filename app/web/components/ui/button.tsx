"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-helix-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-helix-600 text-zinc-50 shadow-card hover:bg-helix-700 hover:shadow-glow-helix",
        destructive:
          "bg-penalty-600 text-zinc-50 shadow-card hover:bg-penalty-700",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-200 shadow-sm hover:bg-zinc-800 hover:text-zinc-100",
        ghost: "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
        link: "text-helix-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2", // 44px min touch target
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8", // 48px for emphasis
        icon: "h-11 w-11", // 44px min touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const MotionButton = motion.create("button");

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
