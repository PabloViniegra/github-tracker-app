import RepositoryCardSkeleton from "@/components/RepositoryCardSkeleton";

/**
 * Loading State for Repositories Page
 *
 * Automatic loading UI for /repositories route.
 * Shown by Next.js during navigation.
 */
export default function RepositoriesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
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

      {/* Loading Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
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
      </main>
    </div>
  );
}
