/**
 * Events Loading State
 * Next.js 15 loading fallback for events page
 */

import { EventSkeletonList } from "@/components/events/EventSkeleton";

/**
 * Loading Component
 *
 * Displayed while the events page is loading.
 * Uses Next.js 15 App Router loading.tsx convention.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <EventSkeletonList count={5} />
        </div>
      </main>
    </div>
  );
}
