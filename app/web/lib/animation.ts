import { useState, useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "tween" as const, duration: 0.25, ease: "easeOut" },
  },
} as const;

export const scrollReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

interface CountUpOptions {
  duration?: number; // default: 1.5
  delay?: number; // stagger offset in seconds, default: 0
  ease?: string; // default: "easeOut"
}

/**
 * Animates a numeric value from 0 to `target` on first mount.
 * Subsequent calls with updated `target` update immediately (no re-animation).
 * Calls `format(currentValue)` each frame to produce the display string.
 *
 * @param target - Final numeric value (pass null while loading)
 * @param format - Formatter: receives interpolated number, returns display string
 * @param options - Animation configuration (duration, delay, ease)
 * @returns Formatted display string that animates from format(0) to format(target)
 */
export function useCountUp(
  target: number | null,
  format: (value: number) => string,
  options: CountUpOptions = {}
): string {
  const { duration = 1.5, delay = 0, ease = "easeOut" } = options;
  const motionValue = useMotionValue(0);
  const hasAnimated = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const [displayValue, setDisplayValue] = useState(() => format(0));

  // Subscribe to motionValue changes — each frame updates the formatted string
  useEffect(() => {
    return motionValue.on("change", (v) => setDisplayValue(format(v)));
  }, [format, motionValue]);

  useEffect(() => {
    if (target === null || target === undefined) return;

    if (hasAnimated.current) {
      // Refetch: jump to new value immediately, no animation
      motionValue.set(target);
      return;
    }

    hasAnimated.current = true;

    if (prefersReducedMotion) {
      motionValue.set(target);
      return;
    }

    const controls = animate(motionValue, target, { duration, delay, ease });
    return () => controls.stop();
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayValue;
}
