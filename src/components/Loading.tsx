"use client";

import { Card, CardBody } from "@heroui/react";

/**
 * Loading Spinner Component
 *
 * Simple, reusable loading spinner following Vercel design system.
 * Can be used standalone or as Suspense fallback.
 */
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-2",
    lg: "w-16 h-16 border-3",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-muted border-t-foreground rounded-full animate-spin`}
    />
  );
}

/**
 * Loading Card Component
 *
 * Full-screen centered loading state with card.
 * Used for page-level loading states.
 */
export function LoadingCard({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="border border-border bg-card shadow-sm max-w-md mx-auto">
        <CardBody className="p-10">
          <div className="flex flex-col items-center gap-6">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground font-sans text-center">
              {message}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Loading Inline Component
 *
 * Inline loading state for smaller components.
 * Used within sections or cards.
 */
export function LoadingInline({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <LoadingSpinner size="md" />
      {message && (
        <p className="text-sm text-muted-foreground font-sans">{message}</p>
      )}
    </div>
  );
}

/**
 * Loading Skeleton Component
 *
 * Skeleton placeholder for loading content.
 * More sophisticated loading state that shows content structure.
 */
export function LoadingSkeleton({
  className = "",
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-muted rounded ${className}`}
        />
      ))}
    </>
  );
}

/**
 * Loading Dashboard Skeleton
 *
 * Specific skeleton for dashboard page.
 * Shows the structure of the dashboard while loading.
 */
export function LoadingDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-9 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Card Skeleton */}
        <Card className="border border-border bg-card shadow-sm mb-8">
          <CardBody className="p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-muted animate-pulse" />

              <div className="flex-1 space-y-4">
                {/* Name */}
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                {/* Username */}
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />

                {/* Stats */}
                <div className="flex gap-6 pt-4 border-t border-border">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-border bg-card p-6 rounded-lg"
            >
              <div className="space-y-3">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
