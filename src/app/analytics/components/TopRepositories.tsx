/**
 * TopRepositories Component
 * Bar chart showing most active repositories
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RepositoryActivity, CHART_COLORS } from "../types/analytics";

interface TopRepositoriesProps {
  data: RepositoryActivity[];
}

const TopRepositories = React.memo(function TopRepositories({ data }: TopRepositoriesProps) {
  // Custom tooltip with animation
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; fill: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-card border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="text-sm font-semibold text-foreground font-sans mb-2">
            {label}
          </p>
          {payload.map((entry, index: number) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className="text-xs text-muted-foreground font-sans"
            >
              <span style={{ color: entry.fill }}>●</span> {entry.name}:{" "}
              <span className="font-mono text-foreground">{entry.value}</span>
            </motion.p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-[350px] text-muted-foreground font-sans"
      >
        No repository data available
      </motion.div>
    );
  }

  const totalActivity = data.reduce((sum, d) => sum + d.total, 0);
  const repoList = data.map(d => `${d.fullName}: ${d.total} activities`).join(', ');

  return (
    <motion.div
      key={`repos-${data.length}-${totalActivity}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-[350px]"
      role="img"
      aria-label={`Top repositories bar chart showing ${data.length} repositories with ${totalActivity} total activities. ${repoList}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
          <XAxis
            type="number"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontFamily: 'var(--font-mono)' }}
            stroke="var(--color-border)"
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontFamily: 'var(--font-sans)' }}
            stroke="var(--color-border)"
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "10px", fontFamily: 'var(--font-sans)', fontSize: '12px' }}
            iconType="square"
          />
          <Bar
            dataKey="commits"
            stackId="a"
            fill={CHART_COLORS.chart1}
            name="Commits"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationBegin={0}
          />
          <Bar
            dataKey="pullRequests"
            stackId="a"
            fill={CHART_COLORS.chart2}
            name="Pull Requests"
            animationDuration={800}
            animationBegin={200}
          />
          <Bar
            dataKey="issues"
            stackId="a"
            fill={CHART_COLORS.chart3}
            name="Issues"
            animationDuration={800}
            animationBegin={400}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default TopRepositories;
