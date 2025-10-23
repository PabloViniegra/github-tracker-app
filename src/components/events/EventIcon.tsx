/**
 * EventIcon Component
 * Displays the appropriate icon for each GitHub event type
 */

import {
  GitCommit,
  GitPullRequest,
  GitMerge,
  MessageSquare,
  Plus,
  Trash2,
  GitFork,
  Star,
  Tag,
  FileText,
  Globe,
  UserPlus,
} from "lucide-react";
import { GitHubEvent, GitHubEventType } from "@/types/github";
import { getEventColor } from "@/lib/events/event-utils";

interface EventIconProps {
  event: GitHubEvent;
  size?: number;
}

/**
 * EventIcon Component
 *
 * Renders an icon based on the event type with appropriate color.
 *
 * Usage:
 * ```tsx
 * <EventIcon event={event} size={20} />
 * ```
 */
export default function EventIcon({ event, size = 20 }: EventIconProps) {
  const color = getEventColor(event.type);
  const iconProps = {
    size,
    style: { color },
    className: "flex-shrink-0",
  };

  // Special case: merged PR
  if (
    event.type === "PullRequestEvent" &&
    "pull_request" in event.payload &&
    typeof event.payload.pull_request === "object" &&
    event.payload.pull_request !== null &&
    "merged_at" in event.payload.pull_request &&
    event.payload.pull_request.merged_at
  ) {
    return <GitMerge {...iconProps} />;
  }

  const iconMap: Record<GitHubEventType, React.ReactElement> = {
    PushEvent: <GitCommit {...iconProps} />,
    PullRequestEvent: <GitPullRequest {...iconProps} />,
    IssuesEvent: <MessageSquare {...iconProps} />,
    IssueCommentEvent: <MessageSquare {...iconProps} />,
    CreateEvent: <Plus {...iconProps} />,
    DeleteEvent: <Trash2 {...iconProps} />,
    ForkEvent: <GitFork {...iconProps} />,
    WatchEvent: <Star {...iconProps} />,
    ReleaseEvent: <Tag {...iconProps} />,
    PublicEvent: <Globe {...iconProps} />,
    MemberEvent: <UserPlus {...iconProps} />,
    CommitCommentEvent: <MessageSquare {...iconProps} />,
    GollumEvent: <FileText {...iconProps} />,
  };

  return iconMap[event.type] || <GitCommit {...iconProps} />;
}
