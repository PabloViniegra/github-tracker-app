/**
 * Analytics Types and Interfaces
 * TypeScript definitions for GitHub Activity Analytics
 */

export interface TimeRange {
  start: Date;
  end: Date;
  preset: "7d" | "30d" | "90d" | "1y" | "all";
}

export interface ActivityDataPoint {
  date: string; // ISO format (YYYY-MM-DD)
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  total: number;
}

export interface EventDistribution {
  eventType: string;
  displayName: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface RepositoryActivity {
  name: string;
  owner: string;
  fullName: string; // owner/name
  commits: number;
  pullRequests: number;
  issues: number;
  stars: number;
  lastActivity: string;
  total: number; // Sum of commits + PRs + issues
}

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Intensity level for heatmap
}

export interface LanguageStats {
  language: string;
  bytes: number;
  percentage: number;
  repositories: number;
  color?: string; // Optional color for chart
}

export interface CollaborationMetrics {
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  contributedRepos: number;
  organizations: number;
  publicRepos: number;
}

export interface AnalyticsSummary {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalReviews: number;
  activeRepositories: number;
  activeDays: number;
  totalEvents: number;
}

export interface AnalyticsData {
  timeRange: TimeRange;
  summary: AnalyticsSummary;
  activityTimeline: ActivityDataPoint[];
  eventDistribution: EventDistribution[];
  topRepositories: RepositoryActivity[];
  contributionCalendar: ContributionDay[];
  languageBreakdown: LanguageStats[];
  collaboration: CollaborationMetrics;
}

// Chart color palette from globals.css
export const CHART_COLORS = {
  chart1: "#a78bfa", // Purple (approximation of oklch(0.71 0.25 258.87))
  chart2: "#60a5fa", // Cyan (approximation of oklch(0.65 0.24 192.72))
  chart3: "#4ade80", // Green (approximation of oklch(0.70 0.21 142.83))
  chart4: "#fbbf24", // Yellow (approximation of oklch(0.72 0.22 82.74))
  chart5: "#fb923c", // Orange (approximation of oklch(0.64 0.26 16.61))
} as const;

// Event type display names mapping
export const EVENT_TYPE_NAMES: Record<string, string> = {
  PushEvent: "Commits",
  PullRequestEvent: "Pull Requests",
  IssuesEvent: "Issues",
  IssueCommentEvent: "Issue Comments",
  PullRequestReviewEvent: "PR Reviews",
  PullRequestReviewCommentEvent: "PR Review Comments",
  CreateEvent: "Created Repos/Branches",
  DeleteEvent: "Deleted Branches",
  ForkEvent: "Forked Repos",
  WatchEvent: "Starred Repos",
  ReleaseEvent: "Releases",
  PublicEvent: "Made Public",
  MemberEvent: "Added Collaborators",
  CommitCommentEvent: "Commit Comments",
};

// Language colors (GitHub standard)
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Scala: "#c22d40",
  R: "#198CE7",
  Lua: "#000080",
  Perl: "#0298c3",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Clojure: "#db5855",
  "Objective-C": "#438eff",
};
