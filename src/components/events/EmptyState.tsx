/**
 * EmptyState Component
 * Displayed when no events are available
 */

"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { Calendar, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onRetry?: () => void;
}

/**
 * EmptyState Component
 *
 * Friendly empty state when no events are found.
 * Includes optional retry functionality.
 *
 * Usage:
 * ```tsx
 * <EmptyState onRetry={handleRetry} />
 * ```
 */
export default function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-border bg-card shadow-sm">
        <CardBody className="p-12">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground font-sans">
                No Activity Yet
              </h3>
              <p className="text-sm text-muted-foreground font-serif max-w-md">
                Your GitHub activity timeline is empty. Start creating commits,
                opening issues, or submitting pull requests to see them here.
              </p>
            </div>

            {/* Actions */}
            {onRetry && (
              <Button
                variant="flat"
                size="sm"
                onPress={onRetry}
                startContent={<RefreshCw className="w-4 h-4" />}
                className="mt-2"
              >
                Refresh
              </Button>
            )}

            {/* Suggestions */}
            <div className="pt-6 border-t border-border max-w-md">
              <p className="text-xs text-muted-foreground font-sans">
                <span className="font-semibold text-foreground">Tip:</span> This
                page shows your recent GitHub activity including commits, pull
                requests, issues, and more.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
