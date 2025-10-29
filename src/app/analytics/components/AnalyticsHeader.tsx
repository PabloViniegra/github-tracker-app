/**
 * AnalyticsHeader Component
 * Display key statistics in card format
 */

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, AlertCircle, FolderGit2 } from 'lucide-react';
import { AnalyticsSummary } from '../types/analytics';
import { formatNumber } from '../utils/processAnalyticsData';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  index: number;
}

const StatCard = React.memo(function StatCard({ label, value, icon, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        whileHover="hover"
        initial="rest"
        animate="rest"
      >
        <Card className="border border-border bg-card shadow-sm hover:border-accent transition-colors">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <motion.div
                className="p-2 rounded-lg bg-accent/20"
                variants={{
                  rest: { scale: 1, rotate: 0 },
                  hover: { scale: 1.1, rotate: 5 }
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                  {label}
                </p>
                <motion.p
                  className="text-4xl font-bold text-foreground font-mono"
                  key={value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {formatNumber(value)}
                </motion.p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
});

interface AnalyticsHeaderProps {
  summary: AnalyticsSummary;
}

const AnalyticsHeader = React.memo(function AnalyticsHeader({ summary }: AnalyticsHeaderProps) {
  const stats = [
    {
      label: 'Total Commits',
      value: summary.totalCommits,
      icon: <GitCommit className="w-5 h-5 text-muted-foreground" />,
    },
    {
      label: 'Pull Requests',
      value: summary.totalPullRequests,
      icon: <GitPullRequest className="w-5 h-5 text-muted-foreground" />,
    },
    {
      label: 'Issues',
      value: summary.totalIssues,
      icon: <AlertCircle className="w-5 h-5 text-muted-foreground" />,
    },
    {
      label: 'Active Repos',
      value: summary.activeRepositories,
      icon: <FolderGit2 className="w-5 h-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          index={index}
        />
      ))}
    </div>
  );
});

export default AnalyticsHeader;
