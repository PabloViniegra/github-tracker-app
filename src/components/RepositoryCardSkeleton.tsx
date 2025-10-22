"use client";

import { Card, CardBody } from "@heroui/react";

/**
 * Repository Card Skeleton
 *
 * Loading placeholder for repository cards.
 * Matches the structure of RepositoryCard with animated pulse effect.
 *
 * Usage:
 * ```tsx
 * <RepositoryCardSkeleton />
 * ```
 */
export default function RepositoryCardSkeleton() {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardBody className="p-6">
        <div className="space-y-4">
          {/* Repository Name Skeleton */}
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>

          {/* Stats and Language Row Skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              {/* Language badge skeleton */}
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              {/* Stars skeleton */}
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              {/* Forks skeleton */}
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
