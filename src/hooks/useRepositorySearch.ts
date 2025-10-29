/**
 * useRepositorySearch Hook
 * Handles repository search with debouncing
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Repository } from "@/lib/api";

interface UseRepositorySearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredRepositories: Repository[];
}

interface UseRepositorySearchOptions {
  repositories: Repository[];
  debounceMs?: number;
}

/**
 * Hook for searching and filtering repositories
 *
 * @param {UseRepositorySearchOptions} options - Configuration options
 * @returns {UseRepositorySearchReturn} Search state and filtered results
 *
 * @example
 * ```tsx
 * const { searchQuery, setSearchQuery, filteredRepositories } = useRepositorySearch({
 *   repositories,
 *   debounceMs: 500
 * });
 * ```
 */
export function useRepositorySearch({
  repositories,
  debounceMs = 500,
}: UseRepositorySearchOptions): UseRepositorySearchReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>(repositories);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update filtered repos when source repositories change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRepositories(repositories);
    }
  }, [repositories, searchQuery]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, repositories, debounceMs]);

  const handleSearch = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      setFilteredRepositories(repositories);
      return;
    }

    // Filter repositories by name, description, or language
    const filtered = repositories.filter((repo) => {
      const nameMatch = repo.name.toLowerCase().includes(normalizedQuery);
      const descMatch = repo.description?.toLowerCase().includes(normalizedQuery) || false;
      const languageMatch = repo.language?.toLowerCase().includes(normalizedQuery) || false;
      return nameMatch || descMatch || languageMatch;
    });

    setFilteredRepositories(filtered);
  }, [repositories]);

  return {
    searchQuery,
    setSearchQuery,
    filteredRepositories,
  };
}
