/**
 * EventSkeleton Component
 * Loading skeleton for event cards
 */

"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";

/**
 * EventSkeleton Component
 *
 * Loading placeholder for event cards.
 * Matches the structure of EventCard for smooth transitions.
 *
 * Usage:
 * ```tsx
 * <EventSkeleton />
 * ```
 */
export default function EventSkeleton() {
  return (
    <div className="relative">
      {/* Timeline connector dot */}
      <Skeleton className="absolute left-0 top-6 w-3 h-3 rounded-full" />

      {/* Card */}
      <div className="ml-8 pl-6 relative">
        {/* Timeline vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

        <Card className="border border-border bg-card shadow-sm">
          <CardBody className="p-5">
            <div className="flex items-start gap-4">
              {/* Icon skeleton */}
              <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                {/* Title */}
                <Skeleton className="h-5 w-3/4 rounded" />

                {/* Description */}
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/**
 * Multiple skeletons for initial load
 */
export function EventSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  );
}
