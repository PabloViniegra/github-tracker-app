"use client";

import { Suspense, useEffect, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import RepositoryCardSkeleton from "@/components/RepositoryCardSkeleton";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/shared/PageHeader";
import RepositoriesErrorBoundary from "./components/RepositoriesErrorBoundary";

// Lazy load heavy repository list component
const RepositoryList = lazy(() => import("@/components/RepositoryList"));

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
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
      {/* Header */}
      <PageHeader
        title="Repositories"
        username={user?.username}
        showBackButton
        onLogout={handleLogout}
        maxWidth="7xl"
      />

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <RepositoriesErrorBoundary>
            <Suspense fallback={<RepositoriesLoadingSkeleton />}>
              <RepositoryList />
            </Suspense>
          </RepositoriesErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-muted-foreground text-center font-sans">
            GitHub Activity Tracker - Browse and manage your repositories
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
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
