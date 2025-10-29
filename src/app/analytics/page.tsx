/**
 * Analytics Page
 * GitHub activity analytics and statistics dashboard
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import { useTimeRange } from "./hooks/useTimeRange";
import { useAnalyticsData } from "./hooks/useAnalyticsData";
import { useReducedMotion } from "./hooks/useReducedMotion";
import ChartCard from "./components/ChartCard";
import AnalyticsHeader from "./components/AnalyticsHeader";
import ActivityTimeline from "./components/ActivityTimeline";
import EventDistribution from "./components/EventDistribution";
import TopRepositories from "./components/TopRepositories";
import AnalyticsErrorBoundary from "./components/AnalyticsErrorBoundary";
import AnalyticsPageHeader from "./components/AnalyticsPageHeader";
import AnalyticsLoadingState from "./components/AnalyticsLoadingState";
import AnalyticsErrorState from "./components/AnalyticsErrorState";
import CollaborationMetrics from "./components/CollaborationMetrics";

/**
 * Analytics Page
 *
 * Main page for viewing GitHub activity analytics and statistics.
 *
 * Features:
 * - Auth protection (redirects to /login if not authenticated)
 * - Header with navigation and time range selector
 * - Key metrics display
 * - Interactive charts
 *
 * Route: /analytics
 */
export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth();
  const router = useRouter();
  const { timeRange, preset, setPreset } = useTimeRange('30d');
  const { data, isLoading, error, refresh } = useAnalyticsData(timeRange);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * Handle refresh with animation
   */
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      // Keep animation running for visual feedback
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  /**
   * Loading state while checking auth
   */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * Redirect in progress (don't show content)
   */
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <AnalyticsPageHeader
        username={user?.username}
        preset={preset}
        onPresetChange={setPreset}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" tabIndex={-1}>
        <AnimatePresence mode="wait">
          {/* Error State */}
          {error && (
            <AnalyticsErrorState error={error} onRetry={handleRefresh} />
          )}

          {/* Loading State */}
          {isLoading && (
            <AnalyticsLoadingState prefersReducedMotion={prefersReducedMotion} />
          )}

          {/* Analytics Content */}
          {!isLoading && data && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6"
            >
            <AnalyticsErrorBoundary>
            {/* Analytics Header - Stats Cards */}
            <AnalyticsHeader summary={data.summary} />

            {/* Activity Timeline - Full Width */}
            <ChartCard
              title="Activity Over Time"
              description="Track your GitHub activity across commits, pull requests, issues, and reviews"
              fullWidth
            >
              <ActivityTimeline data={data.activityTimeline} />
            </ChartCard>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event Distribution */}
              <ChartCard
                title="Event Distribution"
                description="Breakdown of your GitHub activity by event type"
              >
                <div className="relative">
                  <EventDistribution data={data.eventDistribution} />
                </div>
              </ChartCard>

              {/* Top Repositories */}
              <ChartCard
                title="Most Active Repositories"
                description="Your top 5 repositories by activity"
                className="lg:col-span-2"
              >
                <TopRepositories data={data.topRepositories} />
              </ChartCard>
            </div>

            {/* Collaboration Stats */}
            <ChartCard
              title="Collaboration Metrics"
              description="Your GitHub network and contribution statistics"
            >
              <CollaborationMetrics
                data={data.collaboration}
                prefersReducedMotion={prefersReducedMotion}
              />
            </ChartCard>
            </AnalyticsErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="border-t border-border bg-background mt-16"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs text-muted-foreground text-center font-sans">
            GitHub Activity Tracker - Visualize your development activity
          </p>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
