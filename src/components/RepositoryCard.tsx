"use client";

import { Card, CardBody } from "@heroui/react";
import { Star, GitFork, Lock, ExternalLink } from "lucide-react";
import { Repository } from "@/lib/api";

/**
 * Language color mapping
 * Maps programming languages to their conventional colors
 */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
};

interface RepositoryCardProps {
  repository: Repository;
}

/**
 * Repository Card Component
 *
 * Displays a single repository with key information.
 * Clean, minimal design following Vercel design system.
 *
 * Features:
 * - Repository name and description
 * - Language badge with color
 * - Star and fork counts
 * - Private badge for private repos
 * - Link to GitHub repository
 * - Hover effects
 *
 * Usage:
 * ```tsx
 * <RepositoryCard repository={repo} />
 * ```
 */
export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const languageColor = repository.language
    ? LANGUAGE_COLORS[repository.language] || "#858585"
    : "#858585";

  return (
    <a
      href={repository.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="border border-border bg-card shadow-sm hover:bg-accent hover:border-foreground transition-all h-full">
        <CardBody className="p-6">
          <div className="flex flex-col h-full space-y-4">
            {/* Repository Name and Privacy Badge */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground font-sans group-hover:text-foreground transition-colors line-clamp-1 flex-1">
                {repository.name}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {repository.private && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                    title="Private repository"
                  >
                    <Lock className="w-3 h-3" />
                    Private
                  </span>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground font-serif line-clamp-2 flex-1">
              {repository.description || "No description provided"}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              {/* Language Badge */}
              {repository.language && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground font-sans">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  {repository.language}
                </span>
              )}

              {/* Stars */}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Star className="w-3.5 h-3.5" />
                {repository.stargazers_count.toLocaleString()}
              </span>

              {/* Forks */}
              {repository.forks_count !== undefined && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <GitFork className="w-3.5 h-3.5" />
                  {repository.forks_count.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </a>
  );
}
