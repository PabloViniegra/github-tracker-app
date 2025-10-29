/**
 * Analytics Data Processing Utilities
 * Process GitHub events and repository data into analytics metrics
 */

import { GitHubEvent } from "@/types/github";
import { Repository } from "@/lib/api";
import {
  ActivityDataPoint,
  EventDistribution,
  RepositoryActivity,
  ContributionDay,
  LanguageStats,
  AnalyticsSummary,
  TimeRange,
  EVENT_TYPE_NAMES,
  LANGUAGE_COLORS,
} from "../types/analytics";

/**
 * Calculate date range based on preset
 */
export function calculateTimeRange(preset: TimeRange["preset"]): TimeRange {
  const end = new Date();
  const start = new Date();

  switch (preset) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "all":
      start.setFullYear(end.getFullYear() - 10); // 10 years back
      break;
  }

  return { start, end, preset };
}

/**
 * Filter events by time range
 */
export function filterEventsByTimeRange(
  events: GitHubEvent[],
  timeRange: TimeRange,
): GitHubEvent[] {
  return events.filter((event) => {
    const eventDate = new Date(event.created_at);
    return eventDate >= timeRange.start && eventDate <= timeRange.end;
  });
}

/**
 * Process events into activity timeline
 */
export function processActivityTimeline(
  events: GitHubEvent[],
): ActivityDataPoint[] {
  // Validate input
  if (!events || !Array.isArray(events)) {
    return [];
  }

  const dataMap = new Map<string, ActivityDataPoint>();

  events.forEach((event) => {
    // Validate event has required fields
    if (!event || !event.created_at || !event.type) {
      return;
    }

    try {
      const date = new Date(event.created_at).toISOString().split("T")[0];

    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        commits: 0,
        pullRequests: 0,
        issues: 0,
        reviews: 0,
        total: 0,
      });
    }

    const dataPoint = dataMap.get(date)!;

    switch (event.type) {
      case "PushEvent":
        dataPoint.commits++;
        break;
      case "PullRequestEvent":
        dataPoint.pullRequests++;
        break;
      case "IssuesEvent":
      case "IssueCommentEvent":
        dataPoint.issues++;
        break;
      case "CommitCommentEvent":
        // Count commit comments as reviews
        dataPoint.reviews++;
        break;
    }

    dataPoint.total++;
    dataMap.set(date, dataPoint);
    } catch (error) {
      // Skip invalid dates
      console.warn('Invalid event date:', event.created_at, error);
    }
  });

  // Convert to array and sort by date
  return Array.from(dataMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * Process events into event distribution
 */
export function processEventDistribution(
  events: GitHubEvent[],
): EventDistribution[] {
  // Validate input
  if (!events || !Array.isArray(events)) {
    return [];
  }

  const countMap = new Map<string, number>();
  const total = events.length;

  events.forEach((event) => {
    // Validate event has type
    if (!event || !event.type) {
      return;
    }
    const count = countMap.get(event.type) || 0;
    countMap.set(event.type, count + 1);
  });

  const distribution: EventDistribution[] = [];

  countMap.forEach((count, eventType) => {
    distribution.push({
      eventType,
      displayName: EVENT_TYPE_NAMES[eventType] || eventType,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    });
  });

  // Sort by count descending
  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * Process events and repositories into top repositories
 */
export function processTopRepositories(
  events: GitHubEvent[],
  repositories: Repository[],
): RepositoryActivity[] {
  // Validate inputs
  if (!events || !Array.isArray(events)) {
    events = [];
  }
  if (!repositories || !Array.isArray(repositories)) {
    repositories = [];
  }

  const repoMap = new Map<string, RepositoryActivity>();

  // Initialize with repository data
  repositories.forEach((repo) => {
    if (!repo || !repo.full_name || !repo.name || !repo.owner) {
      return;
    }
    repoMap.set(repo.full_name, {
      name: repo.name,
      owner: repo.owner.login,
      fullName: repo.full_name,
      commits: 0,
      pullRequests: 0,
      issues: 0,
      stars: repo.stargazers_count,
      lastActivity: repo.updated_at,
      total: 0,
    });
  });

  // Count events by repository
  events.forEach((event) => {
    // Validate event has repo
    if (!event || !event.repo || !event.repo.name || !event.type) {
      return;
    }
    const repoName = event.repo.name;

    if (!repoMap.has(repoName)) {
      const [owner, name] = repoName.split("/");
      repoMap.set(repoName, {
        name: name || repoName,
        owner: owner || "",
        fullName: repoName,
        commits: 0,
        pullRequests: 0,
        issues: 0,
        stars: 0,
        lastActivity: event.created_at,
        total: 0,
      });
    }

    const repoActivity = repoMap.get(repoName)!;

    switch (event.type) {
      case "PushEvent":
        repoActivity.commits++;
        break;
      case "PullRequestEvent":
        repoActivity.pullRequests++;
        break;
      case "IssuesEvent":
      case "IssueCommentEvent":
        repoActivity.issues++;
        break;
    }

    repoActivity.total =
      repoActivity.commits + repoActivity.pullRequests + repoActivity.issues;

    // Update last activity if this event is more recent
    if (new Date(event.created_at) > new Date(repoActivity.lastActivity)) {
      repoActivity.lastActivity = event.created_at;
    }
  });

  // Convert to array, filter out zero activity, sort by total, take top 5
  return Array.from(repoMap.values())
    .filter((repo) => repo.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

/**
 * Generate contribution calendar (last 365 days)
 */
export function processContributionCalendar(
  events: GitHubEvent[],
): ContributionDay[] {
  // Validate input
  if (!events || !Array.isArray(events)) {
    events = [];
  }

  const calendar: ContributionDay[] = [];
  const today = new Date();
  const contributionMap = new Map<string, number>();

  // Count events by date
  events.forEach((event) => {
    if (!event || !event.created_at) {
      return;
    }
    try {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      const count = contributionMap.get(date) || 0;
      contributionMap.set(date, count + 1);
    } catch (error) {
      // Skip invalid dates
      console.warn('Invalid event date:', event.created_at, error);
    }
  });

  // Generate 365 days of data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const count = contributionMap.get(dateStr) || 0;

    // Calculate intensity level (0-4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) {
      if (count >= 10) level = 4;
      else if (count >= 7) level = 3;
      else if (count >= 4) level = 2;
      else level = 1;
    }

    calendar.push({ date: dateStr, count, level });
  }

  return calendar;
}

/**
 * Process repositories into language breakdown
 */
export function processLanguageBreakdown(
  repositories: Repository[],
): LanguageStats[] {
  // Validate input
  if (!repositories || !Array.isArray(repositories)) {
    return [];
  }

  const languageMap = new Map<string, { bytes: number; repos: Set<string> }>();
  let totalBytes = 0;

  repositories.forEach((repo) => {
    if (!repo || !repo.language || !repo.full_name) {
      return;
    }
    if (repo.language) {
      const lang = repo.language;
      const existing = languageMap.get(lang) || { bytes: 0, repos: new Set() };

      // Estimate bytes (GitHub doesn't provide exact language bytes in basic API)
      // Use a rough estimate based on repo size
      const estimatedBytes = repo.size * 1024; // size is in KB

      existing.bytes += estimatedBytes;
      existing.repos.add(repo.full_name);
      totalBytes += estimatedBytes;

      languageMap.set(lang, existing);
    }
  });

  const breakdown: LanguageStats[] = [];

  languageMap.forEach((data, language) => {
    breakdown.push({
      language,
      bytes: data.bytes,
      percentage: totalBytes > 0 ? (data.bytes / totalBytes) * 100 : 0,
      repositories: data.repos.size,
      color: LANGUAGE_COLORS[language] || "#858585",
    });
  });

  // Sort by bytes descending, take top 5
  return breakdown.sort((a, b) => b.bytes - a.bytes).slice(0, 5);
}

/**
 * Calculate summary statistics
 */
export function calculateSummary(
  events: GitHubEvent[],
): AnalyticsSummary {
  // Validate input
  if (!events || !Array.isArray(events)) {
    return {
      totalCommits: 0,
      totalPullRequests: 0,
      totalIssues: 0,
      totalReviews: 0,
      activeRepositories: 0,
      activeDays: 0,
      totalEvents: 0,
    };
  }

  let totalCommits = 0;
  let totalPullRequests = 0;
  let totalIssues = 0;
  let totalReviews = 0;
  const uniqueDates = new Set<string>();
  const uniqueRepos = new Set<string>();

  events.forEach((event) => {
    if (!event || !event.created_at || !event.type) {
      return;
    }
    try {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      uniqueDates.add(date);
      if (event.repo && event.repo.name) {
        uniqueRepos.add(event.repo.name);
      }

    switch (event.type) {
      case "PushEvent":
        totalCommits++;
        break;
      case "PullRequestEvent":
        totalPullRequests++;
        break;
      case "IssuesEvent":
      case "IssueCommentEvent":
        totalIssues++;
        break;
      case "CommitCommentEvent":
        totalReviews++;
        break;
    }
    } catch (error) {
      // Skip invalid events
      console.warn('Invalid event:', event, error);
    }
  });

  return {
    totalCommits,
    totalPullRequests,
    totalIssues,
    totalReviews,
    activeRepositories: uniqueRepos.size,
    activeDays: uniqueDates.size,
    totalEvents: events.length,
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  return percentage.toFixed(1) + "%";
}
