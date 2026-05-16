"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  neon?: boolean;
}

const VelocityButton = React.forwardRef<HTMLButtonElement, VelocityButtonProps>(
  ({ className, variant = "primary", size = "md", neon = true, ...props }, ref) => {
    const variants = {
      primary: "bg-velocity-blue text-black hover:bg-white",
      secondary: "bg-velocity-lime text-black hover:bg-white",
      outline: "border-2 border-velocity-blue text-velocity-blue hover:bg-velocity-blue hover:text-black",
      ghost: "text-white hover:bg-white/10",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg font-bebas tracking-wider",
    };

    const neonEffects = {
      primary: "neon-glow-blue",
      secondary: "neon-glow-lime",
      outline: "neon-glow-blue",
      ghost: "",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative font-bebas uppercase transition-all duration-300 rounded-none overflow-hidden",
          variants[variant],
          sizes[size],
          neon && neonEffects[variant as keyof typeof neonEffects],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{props.children}</span>
        {/* Futuristic accent line */}
        <div className="absolute top-0 left-0 w-1 h-1 bg-white" />
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white" />
      </motion.button>
    );
  }
);

VelocityButton.displayName = "VelocityButton";

export { VelocityButton };
