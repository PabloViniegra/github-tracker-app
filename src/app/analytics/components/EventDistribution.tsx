/**
 * EventDistribution Component
 * Pie chart showing distribution of event types
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  EventDistribution as EventDistributionType,
  CHART_COLORS,
} from "../types/analytics";
import { formatPercentage } from "../utils/processAnalyticsData";

interface EventDistributionProps {
  data: EventDistributionType[];
}

const COLORS = [
  CHART_COLORS.chart1,
  CHART_COLORS.chart2,
  CHART_COLORS.chart3,
  CHART_COLORS.chart4,
  CHART_COLORS.chart5,
];

const EventDistribution = React.memo(function EventDistribution({ data }: EventDistributionProps) {
  // Custom tooltip with animation
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: EventDistributionType }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-card border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="text-sm font-semibold text-foreground font-sans">
            {item.displayName}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-xs text-muted-foreground font-mono"
          >
            {item.count} events ({formatPercentage(item.percentage)})
          </motion.p>
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
        No event data available
      </motion.div>
    );
  }

  // Calculate total for center display
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const eventSummary = data.map(d => `${d.displayName}: ${d.count}`).join(', ');

  return (
    <motion.div
      key={`events-${data.length}-${total}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-[350px]"
      role="img"
      aria-label={`Event distribution pie chart showing ${total} total events. ${eventSummary}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
            nameKey="displayName"
            label
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center total with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <motion.p
          key={total}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-foreground font-mono"
        >
          {total}
        </motion.p>
        <p className="text-xs text-muted-foreground font-sans">events</p>
      </motion.div>
    </motion.div>
  );
});

export default EventDistribution;
