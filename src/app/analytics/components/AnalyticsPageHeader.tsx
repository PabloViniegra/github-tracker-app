/**
 * AnalyticsPageHeader Component
 * Header with navigation, time range selector, and actions
 */

"use client";

import React from "react";
import { Button, ButtonGroup } from "@heroui/react";
import { ArrowLeft, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AnalyticsPageHeaderProps {
  username?: string;
  preset: '7d' | '30d' | '90d' | '1y';
  onPresetChange: (preset: '7d' | '30d' | '90d' | '1y') => void;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
  prefersReducedMotion: boolean;
}

const TIME_RANGE_OPTIONS = [
  { value: '7d' as const, label: '7D' },
  { value: '30d' as const, label: '30D' },
  { value: '90d' as const, label: '90D' },
  { value: '1y' as const, label: '1Y' },
];

const AnalyticsPageHeader = React.memo(function AnalyticsPageHeader({
  username,
  preset,
  onPresetChange,
  onRefresh,
  onLogout,
  isRefreshing,
  prefersReducedMotion,
}: AnalyticsPageHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/80"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back button */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Link href="/">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back
                </Button>
              </Link>
            </motion.div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">
                Analytics
              </h1>
              {username && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  @{username}
                </p>
              )}
            </div>
          </div>

          {/* Right: Time range + Refresh + Logout */}
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <ButtonGroup size="sm" variant="flat">
              {TIME_RANGE_OPTIONS.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <Button
                    onPress={() => onPresetChange(option.value)}
                    className={preset === option.value ? 'bg-accent text-foreground' : 'text-muted-foreground'}
                    aria-label={`Show analytics for last ${option.label.toLowerCase()}`}
                    aria-pressed={preset === option.value}
                  >
                    {option.label}
                  </Button>
                </motion.div>
              ))}
            </ButtonGroup>

            {/* Refresh Button */}
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Button
                variant="light"
                size="sm"
                isIconOnly
                onPress={onRefresh}
                isDisabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Refresh analytics data"
              >
                <motion.div
                  animate={{ rotate: isRefreshing && !prefersReducedMotion ? 360 : 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: 'easeInOut',
                    repeat: isRefreshing && !prefersReducedMotion ? Infinity : 0
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Button
                variant="light"
                size="sm"
                className="text-muted-foreground text-sm hover:text-foreground"
                onPress={onLogout}
                startContent={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

export default AnalyticsPageHeader;
