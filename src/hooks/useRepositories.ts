/**
 * useRepositories Hook
 * Handles repository data fetching and error states
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { activityApi, Repository } from "@/lib/api";

interface UseRepositoriesReturn {
  repositories: Repository[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing repository data
 *
 * @returns {UseRepositoriesReturn} Repository data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { repositories, isLoading, error, refetch } = useRepositories();
 * ```
 */
export function useRepositories(): UseRepositoriesReturn {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await activityApi.getRepositories();
      setRepositories(response.repositories);
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
      setError(err instanceof Error ? err.message : "Failed to load repositories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return {
    repositories,
    isLoading,
    error,
    refetch: fetchRepositories,
  };
}
