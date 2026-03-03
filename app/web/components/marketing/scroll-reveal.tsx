"use client";

import { m } from "framer-motion";
import { scrollReveal } from "@/lib/animation";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <m.div
      className={className}
      initial={scrollReveal.initial}
      whileInView={scrollReveal.whileInView}
      viewport={scrollReveal.viewport}
      transition={{ ...scrollReveal.transition, delay }}
    >
      {children}
    </m.div>
  );
}
