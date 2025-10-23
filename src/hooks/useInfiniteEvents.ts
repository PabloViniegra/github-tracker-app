/**
 * useInfiniteEvents Hook
 * Custom hook for infinite scroll GitHub events
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { activityApi } from "@/lib/api";
import { GitHubEvent } from "@/types/github";

interface UseInfiniteEventsResult {
  events: GitHubEvent[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * useInfiniteEvents Hook
 *
 * Manages infinite scroll for GitHub events.
 *
 * Features:
 * - Initial load with 30 events
 * - Load 20 more events on scroll
 * - Automatic deduplication
 * - Error handling
 * - Loading states
 * - End detection
 *
 * Usage:
 * ```tsx
 * const { events, isLoading, loadMore, hasMore } = useInfiniteEvents();
 * ```
 */
export function useInfiniteEvents(): UseInfiniteEventsResult {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Track if we're currently loading to prevent duplicate requests
  const isLoadingRef = useRef(false);

  /**
   * Load initial events
   */
  const loadInitialEvents = useCallback(async () => {
    if (isLoadingRef.current) return;

    setIsLoading(true);
    setError(null);
    isLoadingRef.current = true;

    try {
      const response = await activityApi.getEvents(1, 30);
      const newEvents = response.events || [];

      setEvents(newEvents);
      setPage(1);
      setHasMore(newEvents.length === 30);
    } catch (err) {
      console.error("[useInfiniteEvents] Failed to load events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
      setEvents([]);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  /**
   * Load more events (pagination)
   * Protected against race conditions
   */
  const loadMore = useCallback(async () => {
    // Double-check to prevent race conditions
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }

    // Atomic check-and-set to prevent overlapping requests
    if (isLoadingRef.current) {
      return;
    }

    // Set flag BEFORE async operations
    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const response = await activityApi.getEvents(nextPage, 20);
      const newEvents = response.events || [];

      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        // Deduplicate events by ID
        setEvents((prevEvents) => {
          const existingIds = new Set(prevEvents.map((e) => e.id));
          const uniqueNewEvents = newEvents.filter((e) => !existingIds.has(e.id));
          return [...prevEvents, ...uniqueNewEvents];
        });

        setPage(nextPage);
        setHasMore(newEvents.length === 20);
      }
    } catch (err) {
      console.error("[useInfiniteEvents] Failed to load more events:", err);
      // Don't set error state for pagination failures, just log
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [page, hasMore, isLoadingMore, isLoading]);

  /**
   * Refresh events (reset to page 1)
   */
  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadInitialEvents();
  }, [loadInitialEvents]);

  /**
   * Load initial events on mount
   * Only run once to avoid infinite loops
   */
  useEffect(() => {
    loadInitialEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    events,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
