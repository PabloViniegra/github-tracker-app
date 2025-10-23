/**
 * EventsTimeline Component
 * Main timeline container with infinite scroll
 */

"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useInfiniteEvents } from "@/hooks/useInfiniteEvents";
import { groupEventsByDate } from "@/lib/events/event-utils";
import EventCard from "./EventCard";
import DateSeparator from "./DateSeparator";
import { EventSkeletonList } from "./EventSkeleton";
import EmptyState from "./EmptyState";
import { motion } from "framer-motion";

/**
 * EventsTimeline Component
 *
 * Main timeline view with infinite scroll functionality.
 *
 * Features:
 * - Groups events by date
 * - Infinite scroll using Intersection Observer
 * - Loading states
 * - Error handling
 * - Empty state
 *
 * Usage:
 * ```tsx
 * <EventsTimeline />
 * ```
 */
export default function EventsTimeline() {
  const {
    events,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useInfiniteEvents();

  // Ref for intersection observer
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  /**
   * Intersection Observer for infinite scroll
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, isLoading, loadMore]
  );

  /**
   * Setup Intersection Observer
   * Properly cleans up to prevent memory leaks
   */
  useEffect(() => {
    const target = loadMoreTriggerRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "300px", // Trigger 300px before reaching the bottom
      threshold: 0.1,
    });

    observer.observe(target);

    return () => {
      // Unobserve specific target before disconnecting
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [handleIntersection]);

  /**
   * Group events by date (memoized for performance)
   */
  const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <EventSkeletonList count={5} />
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="border border-red-500/20 bg-red-500/5 rounded-lg p-8 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground font-sans">
                Failed to Load Events
              </h3>
              <p className="text-sm text-muted-foreground font-serif max-w-md">
                {error}
              </p>
            </div>
            <Button
              variant="flat"
              size="sm"
              onPress={refresh}
              startContent={<RefreshCw className="w-4 h-4" />}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /**
   * Empty state
   */
  if (events.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState onRetry={refresh} />
      </div>
    );
  }

  /**
   * Timeline view
   */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {Array.from(groupedEvents.entries()).map(([dateLabel, dateEvents]) => (
          <div key={dateLabel}>
            {/* Date Separator */}
            <DateSeparator label={dateLabel} />

            {/* Events for this date */}
            <div className="space-y-4">
              {dateEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        ))}

        {/* Load more trigger */}
        <div ref={loadMoreTriggerRef} className="h-20 flex items-center justify-center">
          {isLoadingMore && (
            <div className="space-y-4 w-full">
              <EventSkeletonList count={2} />
            </div>
          )}

          {!hasMore && events.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <p className="text-sm text-muted-foreground font-sans">
                You&apos;ve reached the end of your activity timeline
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
