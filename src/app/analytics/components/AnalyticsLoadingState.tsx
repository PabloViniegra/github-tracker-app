/**
 * AnalyticsLoadingState Component
 * Loading skeletons for analytics page
 */

"use client";

import React from "react";
import { Skeleton } from "@heroui/react";
import { motion } from "framer-motion";

interface AnalyticsLoadingStateProps {
  prefersReducedMotion: boolean;
}

const AnalyticsLoadingState = React.memo(function AnalyticsLoadingState({
  prefersReducedMotion,
}: AnalyticsLoadingStateProps) {
  return (
    <motion.div
      key="loading"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="space-y-6"
    >
      {/* Skeleton stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton for activity timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-6 w-48 rounded mb-2" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
          </div>
          <Skeleton className="h-[400px] w-full rounded" />
        </div>
      </div>

      {/* Skeleton for charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-40 rounded mb-2" />
              <Skeleton className="h-4 w-full max-w-xs rounded" />
            </div>
            <Skeleton className="h-[350px] w-full rounded" />
          </div>
        </div>

        {/* Top repositories */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-52 rounded mb-2" />
              <Skeleton className="h-4 w-full max-w-sm rounded" />
            </div>
            <Skeleton className="h-[350px] w-full rounded" />
          </div>
        </div>
      </div>

      {/* Skeleton for collaboration metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-6 w-48 rounded mb-2" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default AnalyticsLoadingState;
