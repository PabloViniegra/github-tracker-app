"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/react";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import RepositoryList from "@/components/RepositoryList";
import RepositoryCardSkeleton from "@/components/RepositoryCardSkeleton";
import { motion } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";

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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/80"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/">
                  <Button
                    variant="light"
                    size="sm"
                    startContent={<ArrowLeft className="w-4 h-4" />}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </Button>
                </Link>
              </motion.div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">
                  Repositories
                </h1>
                {user && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Logout button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="light"
                size="sm"
                className="text-muted-foreground text-sm hover:text-foreground"
                onPress={handleLogout}
                startContent={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<RepositoriesLoadingSkeleton />}>
            <RepositoryList />
          </Suspense>
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
