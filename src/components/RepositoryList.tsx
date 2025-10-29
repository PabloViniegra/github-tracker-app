"use client";

import React from "react";
import RepositoryCard from "./RepositoryCard";
import RepositoryCardSkeleton from "./RepositoryCardSkeleton";
import { LoadingSpinner } from "./Loading";
import { AlertCircle, Search } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useRepositories } from "@/hooks/useRepositories";
import { useRepositorySearch } from "@/hooks/useRepositorySearch";
import { usePaginatedRepositories } from "@/hooks/usePaginatedRepositories";

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
const RepositoryList = React.memo(function RepositoryList() {
  // Custom hooks for separation of concerns
  const { repositories, isLoading, error, refetch } = useRepositories();
  const { searchQuery, setSearchQuery, filteredRepositories } = useRepositorySearch({
    repositories,
    debounceMs: 500,
  });
  const { displayedRepositories, hasMore, observerTarget } = usePaginatedRepositories({
    repositories: filteredRepositories,
    itemsPerPage: 30,
  });

  // Loading state - show skeletons
  if (isLoading && repositories.length === 0) {
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
            onPress={refetch}
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
});

export default RepositoryList;
