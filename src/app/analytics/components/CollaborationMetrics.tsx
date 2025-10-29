/**
 * CollaborationMetrics Component
 * Display GitHub collaboration and network statistics
 */

"use client";

import React from "react";
import { motion } from "framer-motion";

interface CollaborationData {
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  publicRepos: number;
  contributedRepos: number;
}

interface CollaborationMetricsProps {
  data: CollaborationData;
  prefersReducedMotion: boolean;
}

interface MetricItem {
  label: string;
  value: number;
}

const METRICS: (keyof CollaborationData)[] = [
  'followers',
  'following',
  'totalStars',
  'totalForks',
  'publicRepos',
  'contributedRepos',
];

const METRIC_LABELS: Record<keyof CollaborationData, string> = {
  followers: 'Followers',
  following: 'Following',
  totalStars: 'Total Stars',
  totalForks: 'Total Forks',
  publicRepos: 'Public Repos',
  contributedRepos: 'Contributed Repos',
};

const CollaborationMetrics = React.memo(function CollaborationMetrics({
  data,
  prefersReducedMotion,
}: CollaborationMetricsProps) {
  const metrics: MetricItem[] = METRICS.map((key) => ({
    label: METRIC_LABELS[key],
    value: data[key],
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {metrics.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.4 + index * 0.1,
            ease: 'easeOut'
          }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
          className="p-4 rounded-lg bg-accent/5 border border-transparent hover:border-accent/30 transition-colors"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
            {stat.label}
          </p>
          <motion.p
            key={stat.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-foreground font-mono"
          >
            {stat.value}
          </motion.p>
        </motion.div>
      ))}
    </div>
  );
});

export default CollaborationMetrics;
