/**
 * DateSeparator Component
 * Displays a date label to group events
 */

"use client";

import { motion } from "framer-motion";

interface DateSeparatorProps {
  label: string;
}

/**
 * DateSeparator Component
 *
 * Renders a horizontal date separator with label.
 * Used to group events by date (Today, Yesterday, etc.)
 *
 * Usage:
 * ```tsx
 * <DateSeparator label="Today" />
 * ```
 */
export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-center justify-center py-6 mb-2"
    >
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />

      {/* Label */}
      <div className="px-4">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-sans bg-background px-2">
          {label}
        </span>
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
    </motion.div>
  );
}
