"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { activityApi, Repository } from "@/lib/api";
import RepositoryCard from "./RepositoryCard";
import RepositoryCardSkeleton from "./RepositoryCardSkeleton";
import { LoadingSpinner } from "./Loading";
import { AlertCircle, Search } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";

/**
 * Repository List Component
 *
 * Client component that handles repository fetching, search, and infinite scroll.
 *
 * Features:
 * - Fetch repositories on mount
 * - Debounced search (500ms)
 * - Infinite scroll with Intersection Observer
 * - Loading states with skeletons
 * - Empty states
 * - Error handling with retry
 *
 * Usage:
 * ```tsx
 * <RepositoryList />
 * ```
 */
export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
  const [displayedRepositories, setDisplayedRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const REPOS_PER_PAGE = 30;

  // Fetch all repositories on mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await activityApi.getRepositories();
      setRepositories(response.repositories);
      setFilteredRepositories(response.repositories);

      // Display first page
      setDisplayedRepositories(response.repositories.slice(0, REPOS_PER_PAGE));
      setHasMore(response.repositories.length > REPOS_PER_PAGE);
      setPage(1);
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
      setError(err instanceof Error ? err.message : "Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      // Reset to all repositories
      setFilteredRepositories(repositories);
      setDisplayedRepositories(repositories.slice(0, REPOS_PER_PAGE));
      setHasMore(repositories.length > REPOS_PER_PAGE);
      setPage(1);
      return;
    }

    // Filter repositories by name or description
    const filtered = repositories.filter((repo) => {
      const nameMatch = repo.name.toLowerCase().includes(normalizedQuery);
      const descMatch = repo.description?.toLowerCase().includes(normalizedQuery) || false;
      const languageMatch = repo.language?.toLowerCase().includes(normalizedQuery) || false;
      return nameMatch || descMatch || languageMatch;
    });

    setFilteredRepositories(filtered);
    setDisplayedRepositories(filtered.slice(0, REPOS_PER_PAGE));
    setHasMore(filtered.length > REPOS_PER_PAGE);
    setPage(1);
  }, [repositories]);

  // Debounced search handler
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, handleSearch]);

  // Load more repositories for infinite scroll
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * REPOS_PER_PAGE;

    const newDisplayed = filteredRepositories.slice(startIndex, endIndex);
    setDisplayedRepositories(newDisplayed);
    setPage(nextPage);
    setHasMore(endIndex < filteredRepositories.length);
  }, [page, hasMore, loading, filteredRepositories]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Loading state - show skeletons
  if (loading && repositories.length === 0) {
    return (
      <div className="space-y-6">
        {/* Search Skeleton */}
        <div className="h-12 w-full max-w-md bg-muted rounded animate-pulse" />

        {/* Grid of skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RepositoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
            Failed to Load Repositories
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-6">
            {error}
          </p>
          <Button
            onPress={fetchRepositories}
            variant="solid"
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - no repositories
  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
            No Repositories Found
          </h3>
          <p className="text-sm text-muted-foreground font-serif">
            You don&apos;t have any repositories yet. Create your first repository on GitHub to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-md"
      >
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="w-4 h-4 text-muted-foreground" />}
          classNames={{
            input: "font-sans",
            inputWrapper: "border border-border bg-card hover:border-foreground focus-within:border-foreground transition-colors",
          }}
        />
      </motion.div>

      {/* Repository Count */}
      <div className="text-sm text-muted-foreground font-sans">
        Showing {displayedRepositories.length} of {filteredRepositories.length} repositories
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* No search results */}
      {filteredRepositories.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
              No Repositories Found
            </h3>
            <p className="text-sm text-muted-foreground font-serif">
              No repositories match &quot;{searchQuery}&quot;. Try a different search term.
            </p>
          </div>
        </div>
      )}

      {/* Repository Grid */}
      {filteredRepositories.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedRepositories.map((repo, index) => (
              <RepositoryCard key={repo.id} repository={repo} index={index} />
            ))}
          </div>

          {/* Load More Indicator */}
          {hasMore && (
            <div
              ref={observerTarget}
              className="flex justify-center py-8"
            >
              <LoadingSpinner size="md" />
            </div>
          )}

          {/* End of Results */}
          {!hasMore && displayedRepositories.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground font-sans">
                You&apos;ve reached the end of the list
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
