"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import RepositoryList from "@/components/RepositoryList";
import RepositoryCardSkeleton from "@/components/RepositoryCardSkeleton";

/**
 * Repositories Page
 *
 * Protected page for viewing and managing GitHub repositories.
 * Requires authentication.
 *
 * Features:
 * - Repository list with search
 * - Infinite scroll
 * - Loading states with skeletons
 * - Responsive grid layout
 *
 * Route: /repositories
 */
export default function RepositoriesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting to login
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground font-sans">
              Repositories
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Browse and search your GitHub repositories
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={<RepositoriesLoadingSkeleton />}>
          <RepositoryList />
        </Suspense>
      </main>
    </div>
  );
}

/**
 * Loading Skeleton for Repositories Page
 *
 * Shown while RepositoryList is loading initially.
 */
function RepositoriesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Skeleton */}
      <div className="max-w-md">
        <div className="h-12 w-full bg-muted rounded animate-pulse" />
      </div>

      {/* Count Skeleton */}
      <div className="h-5 w-48 bg-muted rounded animate-pulse" />

      {/* Grid of skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <RepositoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
