/**
 * AnalyticsErrorState Component
 * Error state display for analytics page
 */

"use client";

import React from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

interface AnalyticsErrorStateProps {
  error: string;
  onRetry: () => void;
}

const AnalyticsErrorState = React.memo(function AnalyticsErrorState({
  error,
  onRetry,
}: AnalyticsErrorStateProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="border border-red-500/20 bg-red-500/5 rounded-lg p-6 text-center mb-6"
    >
      <p className="text-red-500 font-sans">{error}</p>
      <Button
        variant="flat"
        size="sm"
        onPress={onRetry}
        className="mt-3"
      >
        Try Again
      </Button>
    </motion.div>
  );
});

export default AnalyticsErrorState;
