/**
 * Event Utility Functions
 * Helper functions for processing and displaying GitHub events
 */

import {
  GitHubEvent,
  GitHubEventType,
  isPushEvent,
  isPullRequestEvent,
  isIssuesEvent,
  isIssueCommentEvent,
  isCreateEvent,
  isDeleteEvent,
  isForkEvent,
  isWatchEvent,
  isReleaseEvent,
} from "@/types/github";

/**
 * Color mapping for event types
 */
export const EVENT_COLORS: Record<GitHubEventType, string> = {
  PushEvent: "#60A5FA",           // blue
  PullRequestEvent: "#C084FC",    // purple
  IssuesEvent: "#4ADE80",         // green
  IssueCommentEvent: "#22D3EE",   // cyan
  CreateEvent: "#10B981",         // emerald
  DeleteEvent: "#F87171",         // red
  ForkEvent: "#FCD34D",           // amber
  WatchEvent: "#FBBF24",          // yellow
  ReleaseEvent: "#818CF8",        // indigo
  PublicEvent: "#A78BFA",         // violet
  MemberEvent: "#FB923C",         // orange
  CommitCommentEvent: "#38BDF8",  // sky
  GollumEvent: "#2DD4BF",         // teal
};

/**
 * Get color for event type
 */
export function getEventColor(type: GitHubEventType): string {
  return EVENT_COLORS[type] || "#858585";
}

/**
 * Get human-readable event title
 */
export function getEventTitle(event: GitHubEvent): string {
  const repoName = event.repo.name.split("/")[1] || event.repo.name;

  if (isPushEvent(event)) {
    const branch = event.payload.ref?.replace("refs/heads/", "") || "unknown";
    const commitCount = event.payload.commits?.length || 0;
    return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${branch}`;
  }

  if (isPullRequestEvent(event)) {
    const action = event.payload.action === "closed" && event.payload.pull_request?.merged_at
      ? "merged"
      : event.payload.action;
    return `${capitalize(action)} pull request #${event.payload.number || 0}`;
  }

  if (isIssuesEvent(event)) {
    return `${capitalize(event.payload.action)} issue #${event.payload.issue?.number || 0}`;
  }

  if (isIssueCommentEvent(event)) {
    return `Commented on issue #${event.payload.issue?.number || 0}`;
  }

  if (isCreateEvent(event)) {
    const refType = event.payload.ref_type || "ref";
    const refName = event.payload.ref || repoName;
    return `Created ${refType} ${refName}`;
  }

  if (isDeleteEvent(event)) {
    return `Deleted ${event.payload.ref_type || "ref"} ${event.payload.ref || ""}`;
  }

  if (isForkEvent(event)) {
    return `Forked ${repoName}`;
  }

  if (isWatchEvent(event)) {
    return `Starred ${repoName}`;
  }

  if (isReleaseEvent(event)) {
    return `${capitalize(event.payload.action)} release ${event.payload.release?.tag_name || ""}`;
  }

  return event.type.replace("Event", "");
}

/**
 * Get event description (subtitle)
 */
export function getEventDescription(event: GitHubEvent): string | null {
  if (isPullRequestEvent(event)) {
    return event.payload.pull_request?.title || null;
  }

  if (isIssuesEvent(event)) {
    return event.payload.issue?.title || null;
  }

  if (isIssueCommentEvent(event)) {
    return event.payload.issue?.title || null;
  }

  if (isReleaseEvent(event)) {
    return event.payload.release?.name || null;
  }

  if (isPushEvent(event)) {
    const firstCommit = event.payload.commits?.[0];
    return firstCommit?.message || null;
  }

  return null;
}

/**
 * Get event URL
 */
export function getEventUrl(event: GitHubEvent): string | null {
  const repoUrl = `https://github.com/${event.repo.name}`;

  if (isPushEvent(event)) {
    const branch = event.payload.ref?.replace("refs/heads/", "") || "main";
    return `${repoUrl}/commits/${branch}`;
  }

  if (isPullRequestEvent(event)) {
    return event.payload.pull_request?.html_url || null;
  }

  if (isIssuesEvent(event)) {
    return event.payload.issue?.html_url || null;
  }

  if (isIssueCommentEvent(event)) {
    return event.payload.comment?.html_url || null;
  }

  if (isReleaseEvent(event)) {
    return event.payload.release?.html_url || null;
  }

  if (isCreateEvent(event)) {
    if (event.payload.ref_type === "branch" && event.payload.ref) {
      return `${repoUrl}/tree/${event.payload.ref}`;
    }
    if (event.payload.ref_type === "tag" && event.payload.ref) {
      return `${repoUrl}/releases/tag/${event.payload.ref}`;
    }
    return repoUrl;
  }

  if (isForkEvent(event)) {
    return event.payload.forkee?.html_url || null;
  }

  return repoUrl;
}

/**
 * Format date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "just now";
  }

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get date separator label
 */
export function getDateSeparatorLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Reset time parts for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = today.getTime() - eventDate.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return "This Week";
  }

  if (diffDays < 14) {
    return "Last Week";
  }

  if (diffDays < 30) {
    return "This Month";
  }

  // Format as "Month Year" for older dates
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: GitHubEvent[]): Map<string, GitHubEvent[]> {
  const grouped = new Map<string, GitHubEvent[]>();

  for (const event of events) {
    const label = getDateSeparatorLabel(event.created_at);

    if (!grouped.has(label)) {
      grouped.set(label, []);
    }

    grouped.get(label)!.push(event);
  }

  return grouped;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Get branch name from ref
 */
export function getBranchName(ref: string): string {
  return ref.replace("refs/heads/", "").replace("refs/tags/", "");
}

/**
 * Format commit SHA for display (short version)
 */
export function formatCommitSha(sha: string): string {
  return sha.slice(0, 7);
}
