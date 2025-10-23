/**
 * EventDetails Component
 * Displays event-specific details based on event type
 */

import { Chip } from "@heroui/react";
import {
  GitHubEvent,
  isPushEvent,
  isPullRequestEvent,
  isIssuesEvent,
  isIssueCommentEvent,
  isCreateEvent,
  isDeleteEvent,
  isForkEvent,
  isReleaseEvent,
} from "@/types/github";
import { formatCommitSha, truncateText } from "@/lib/events/event-utils";

interface EventDetailsProps {
  event: GitHubEvent;
}

/**
 * EventDetails Component
 *
 * Renders additional details specific to each event type.
 * Includes commits, PR status, issue labels, etc.
 *
 * Usage:
 * ```tsx
 * <EventDetails event={event} />
 * ```
 */
export default function EventDetails({ event }: EventDetailsProps) {
  // PushEvent: Show commits
  if (isPushEvent(event)) {
    const allCommits = event.payload.commits || [];
    const commits = allCommits.slice(0, 3); // Show max 3 commits
    const remainingCount = allCommits.length - commits.length;

    if (commits.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 space-y-2">
        {commits.map((commit, index) => (
          <div
            key={`${commit.sha}-${index}`}
            className="flex items-start gap-2 text-sm"
          >
            <code className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono flex-shrink-0">
              {formatCommitSha(commit.sha)}
            </code>
            <p className="text-muted-foreground font-mono text-xs line-clamp-1">
              {commit.message}
            </p>
          </div>
        ))}
        {remainingCount > 0 && (
          <p className="text-xs text-muted-foreground font-sans pl-16">
            +{remainingCount} more commit{remainingCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    );
  }

  // PullRequestEvent: Show PR state and branch info
  if (isPullRequestEvent(event)) {
    const pr = event.payload.pull_request;
    if (!pr) return null;

    const isMerged = !!pr.merged_at;
    const isClosed = pr.state === "closed";

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip
          size="sm"
          variant="flat"
          className={`text-xs font-sans ${
            isMerged
              ? "bg-purple-500/10 text-purple-400"
              : isClosed
              ? "bg-red-500/10 text-red-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {isMerged ? "Merged" : isClosed ? "Closed" : "Open"}
        </Chip>
        <span className="text-xs text-muted-foreground font-mono">
          {pr.head?.ref || "branch"} → {pr.base?.ref || "base"}
        </span>
      </div>
    );
  }

  // IssuesEvent: Show issue state and labels
  if (isIssuesEvent(event)) {
    const issue = event.payload.issue;
    if (!issue) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip
          size="sm"
          variant="flat"
          className={`text-xs font-sans ${
            issue.state === "closed"
              ? "bg-purple-500/10 text-purple-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {issue.state === "closed" ? "Closed" : "Open"}
        </Chip>
        {issue.labels?.slice(0, 3).map((label) => (
          <Chip
            key={label.name}
            size="sm"
            variant="flat"
            style={{
              backgroundColor: `#${label.color}20`,
              color: `#${label.color}`,
            }}
            className="text-xs font-sans"
          >
            {label.name}
          </Chip>
        ))}
      </div>
    );
  }

  // IssueCommentEvent: Show comment preview
  if (isIssueCommentEvent(event)) {
    const comment = event.payload.comment;
    if (!comment?.body) return null;

    const preview = truncateText(comment.body, 120);

    return (
      <div className="mt-3 border-l-2 border-border pl-3">
        <p className="text-sm text-muted-foreground font-serif italic line-clamp-2">
          {preview}
        </p>
      </div>
    );
  }

  // CreateEvent: Show ref type and name
  if (isCreateEvent(event)) {
    return (
      <div className="mt-2">
        <Chip
          size="sm"
          variant="flat"
          className="bg-emerald-500/10 text-emerald-400 text-xs font-mono"
        >
          {event.payload.ref_type}: {event.payload.ref || event.repo.name.split("/")[1]}
        </Chip>
      </div>
    );
  }

  // DeleteEvent: Show what was deleted
  if (isDeleteEvent(event)) {
    return (
      <div className="mt-2">
        <Chip
          size="sm"
          variant="flat"
          className="bg-red-500/10 text-red-400 text-xs font-mono"
        >
          {event.payload.ref_type}: {event.payload.ref}
        </Chip>
      </div>
    );
  }

  // ForkEvent: Show forked repo
  if (isForkEvent(event)) {
    const forkee = event.payload.forkee;
    if (!forkee) return null;

    return (
      <div className="mt-2">
        <a
          href={forkee.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          → {forkee.full_name}
        </a>
      </div>
    );
  }

  // ReleaseEvent: Show release info
  if (isReleaseEvent(event)) {
    const release = event.payload.release;
    if (!release) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip
          size="sm"
          variant="flat"
          className="bg-indigo-500/10 text-indigo-400 text-xs font-mono"
        >
          {release.tag_name || "Release"}
        </Chip>
        {release.prerelease && (
          <Chip
            size="sm"
            variant="flat"
            className="bg-yellow-500/10 text-yellow-400 text-xs font-sans"
          >
            Pre-release
          </Chip>
        )}
        {release.draft && (
          <Chip
            size="sm"
            variant="flat"
            className="bg-muted text-muted-foreground text-xs font-sans"
          >
            Draft
          </Chip>
        )}
      </div>
    );
  }

  return null;
}
