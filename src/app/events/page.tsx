/**
 * Events Page
 * GitHub activity timeline with infinite scroll
 */

"use client";

import { useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import ScrollToTop from "@/components/ScrollToTop";
import { EventSkeletonList } from "@/components/events/EventSkeleton";
import EventsErrorBoundary from "./components/EventsErrorBoundary";

// Lazy load heavy timeline component
const EventsTimeline = lazy(() => import("@/components/events/EventsTimeline"));

/**
 * Events Page
 *
 * Main page for viewing GitHub activity timeline.
 *
 * Features:
 * - Auth protection (redirects to /login if not authenticated)
 * - Header with navigation
 * - Infinite scroll timeline
 *
 * Route: /events
 */
export default function EventsPage() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
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

  /**
   * Loading state while checking auth
   */
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

  /**
   * Redirect in progress (don't show content)
   */
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title="Activity Timeline"
        username={user?.username}
        showBackButton
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="px-6 py-8">
        <EventsErrorBoundary>
          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto">
                <EventSkeletonList count={5} />
              </div>
            }
          >
            <EventsTimeline />
          </Suspense>
        </EventsErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-muted-foreground text-center font-sans">
            GitHub Activity Tracker - Your recent activity across all
            repositories
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
