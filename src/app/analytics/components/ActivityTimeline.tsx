/**
 * ActivityTimeline Component
 * Line chart showing activity over time
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ActivityDataPoint, CHART_COLORS } from "../types/analytics";

interface ActivityTimelineProps {
  data: ActivityDataPoint[];
}

const ActivityTimeline = React.memo(function ActivityTimeline({ data }: ActivityTimelineProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Custom tooltip with animation
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-card border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="text-sm font-semibold text-foreground font-sans mb-2">
            {formatDate(label || "")}
          </p>
          {payload.map((entry, index: number) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className="text-xs text-muted-foreground font-sans"
            >
              <span style={{ color: entry.color }}>●</span> {entry.name}:{" "}
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
        className="flex items-center justify-center h-[400px] text-muted-foreground font-sans"
      >
        No activity data available
      </motion.div>
    );
  }

  const totalActivity = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <motion.div
      key={`activity-${data.length}-${totalActivity}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-[400px]"
      role="img"
      aria-label={`Activity timeline chart showing ${totalActivity} total activities across commits, pull requests, issues, and reviews`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontFamily: 'var(--font-sans)' }}
            stroke="var(--color-border)"
            tickFormatter={formatDate}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontFamily: 'var(--font-mono)' }}
            stroke="var(--color-border)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px", fontFamily: 'var(--font-sans)', fontSize: '12px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="commits"
            stroke={CHART_COLORS.chart1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Commits"
            animationDuration={800}
            animationBegin={0}
          />
          <Line
            type="monotone"
            dataKey="pullRequests"
            stroke={CHART_COLORS.chart2}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Pull Requests"
            animationDuration={800}
            animationBegin={200}
          />
          <Line
            type="monotone"
            dataKey="issues"
            stroke={CHART_COLORS.chart3}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Issues"
            animationDuration={800}
            animationBegin={400}
          />
          <Line
            type="monotone"
            dataKey="reviews"
            stroke={CHART_COLORS.chart4}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Reviews"
            animationDuration={800}
            animationBegin={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

export default ActivityTimeline;
