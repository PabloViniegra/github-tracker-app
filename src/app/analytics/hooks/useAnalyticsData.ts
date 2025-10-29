/**
 * useAnalyticsData Hook
 * Fetch and process GitHub data for analytics
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { activityApi, githubApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  AnalyticsData,
  TimeRange,
  CollaborationMetrics,
} from "../types/analytics";
import {
  filterEventsByTimeRange,
  processActivityTimeline,
  processEventDistribution,
  processTopRepositories,
  processContributionCalendar,
  processLanguageBreakdown,
  calculateSummary,
} from "../utils/processAnalyticsData";

interface UseAnalyticsDataResult {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAnalyticsData(timeRange: TimeRange): UseAnalyticsDataResult {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [rawEvents, setRawEvents] = useState<Array<any>>([]);
  const [rawRepositories, setRawRepositories] = useState<Array<any>>([]);
  const [githubDetails, setGithubDetails] = useState<Record<
    string,
    any
  > | null>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [eventsResponse, reposResponse] = await Promise.all([
        activityApi.getEvents(),
        activityApi.getRepositories(),
      ]);

      setRawEvents(eventsResponse.events || []);
      setRawRepositories(reposResponse.repositories || []);

      // Fetch user details for collaboration metrics
      if (user?.username) {
        try {
          const details = await githubApi.getUserDetails(user.username);
          setGithubDetails(details);
        } catch (err) {
          console.error("Failed to fetch GitHub details:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Process data based on time range
  const data = useMemo<AnalyticsData | null>(() => {
    if (!rawEvents.length && !rawRepositories.length) {
      return null;
    }

    // Filter events by time range
    const filteredEvents = filterEventsByTimeRange(rawEvents, timeRange);

    // Calculate collaboration metrics
    const collaboration: CollaborationMetrics = {
      followers: githubDetails?.followers || 0,
      following: githubDetails?.following || 0,
      totalStars: rawRepositories.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0,
      ),
      totalForks: rawRepositories.reduce(
        (sum, repo) => sum + (repo.forks_count || 0),
        0,
      ),
      contributedRepos: rawRepositories.length,
      organizations: 0, // Would need additional API call
      publicRepos: githubDetails?.public_repos || rawRepositories.length,
    };

    return {
      timeRange,
      summary: calculateSummary(filteredEvents),
      activityTimeline: processActivityTimeline(filteredEvents),
      eventDistribution: processEventDistribution(filteredEvents),
      topRepositories: processTopRepositories(filteredEvents, rawRepositories),
      contributionCalendar: processContributionCalendar(rawEvents), // Use all events for full calendar
      languageBreakdown: processLanguageBreakdown(rawRepositories),
      collaboration,
    };
  }, [rawEvents, rawRepositories, githubDetails, timeRange]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}
