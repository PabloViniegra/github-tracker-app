/**
 * GitHub Events API Type Definitions
 * Based on GitHub's REST API v3 Events structure
 */

/**
 * Supported GitHub event types
 */
export type GitHubEventType =
  | "PushEvent"
  | "PullRequestEvent"
  | "IssuesEvent"
  | "IssueCommentEvent"
  | "CreateEvent"
  | "DeleteEvent"
  | "ForkEvent"
  | "WatchEvent"
  | "ReleaseEvent"
  | "PublicEvent"
  | "MemberEvent"
  | "CommitCommentEvent"
  | "GollumEvent";

/**
 * Actor (user) who triggered the event
 */
export interface GitHubActor {
  id: number;
  login: string;
  display_login?: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

/**
 * Repository information
 */
export interface GitHubRepo {
  id: number;
  name: string;
  url: string;
}

/**
 * Commit information for PushEvent
 */
export interface GitHubCommit {
  sha: string;
  author: {
    email: string;
    name: string;
  };
  message: string;
  distinct: boolean;
  url: string;
}

/**
 * Pull Request information
 */
export interface GitHubPullRequest {
  id: number;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  html_url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
  };
  base: {
    label: string;
    ref: string;
    sha: string;
  };
}

/**
 * Issue information
 */
export interface GitHubIssue {
  id: number;
  number: number;
  state: "open" | "closed";
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
}

/**
 * Comment information
 */
export interface GitHubComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

/**
 * Release information
 */
export interface GitHubRelease {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  body: string | null;
}

/**
 * Event payloads for different event types
 */
export interface PushEventPayload {
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: GitHubCommit[];
}

export interface PullRequestEventPayload {
  action: "opened" | "closed" | "reopened" | "edited" | "assigned" | "unassigned" | "review_requested" | "review_request_removed" | "labeled" | "unlabeled" | "synchronize";
  number: number;
  pull_request: GitHubPullRequest;
}

export interface IssuesEventPayload {
  action: "opened" | "closed" | "reopened" | "edited" | "assigned" | "unassigned" | "labeled" | "unlabeled";
  issue: GitHubIssue;
}

export interface IssueCommentEventPayload {
  action: "created" | "edited" | "deleted";
  issue: GitHubIssue;
  comment: GitHubComment;
}

export interface CreateEventPayload {
  ref: string | null;
  ref_type: "repository" | "branch" | "tag";
  master_branch: string;
  description: string | null;
  pusher_type: string;
}

export interface DeleteEventPayload {
  ref: string;
  ref_type: "branch" | "tag";
  pusher_type: string;
}

export interface ForkEventPayload {
  forkee: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string | null;
    created_at: string;
  };
}

export interface WatchEventPayload {
  action: "started";
}

export interface ReleaseEventPayload {
  action: "published" | "created" | "edited" | "deleted" | "prereleased" | "released";
  release: GitHubRelease;
}

/**
 * Generic event payload (fallback for unsupported event types)
 */
export type GitHubEventPayload =
  | PushEventPayload
  | PullRequestEventPayload
  | IssuesEventPayload
  | IssueCommentEventPayload
  | CreateEventPayload
  | DeleteEventPayload
  | ForkEventPayload
  | WatchEventPayload
  | ReleaseEventPayload
  | Record<string, unknown>;

/**
 * GitHub Event structure
 */
export interface GitHubEvent {
  id: string;
  type: GitHubEventType;
  actor: GitHubActor;
  repo: GitHubRepo;
  payload: GitHubEventPayload;
  public: boolean;
  created_at: string;
  org?: {
    id: number;
    login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
}

/**
 * API response for events
 */
export interface GitHubEventsResponse {
  events: GitHubEvent[];
}

/**
 * Type guards for event payloads
 */
export function isPushEvent(event: GitHubEvent): event is GitHubEvent & { payload: PushEventPayload } {
  return event.type === "PushEvent";
}

export function isPullRequestEvent(event: GitHubEvent): event is GitHubEvent & { payload: PullRequestEventPayload } {
  return event.type === "PullRequestEvent";
}

export function isIssuesEvent(event: GitHubEvent): event is GitHubEvent & { payload: IssuesEventPayload } {
  return event.type === "IssuesEvent";
}

export function isIssueCommentEvent(event: GitHubEvent): event is GitHubEvent & { payload: IssueCommentEventPayload } {
  return event.type === "IssueCommentEvent";
}

export function isCreateEvent(event: GitHubEvent): event is GitHubEvent & { payload: CreateEventPayload } {
  return event.type === "CreateEvent";
}

export function isDeleteEvent(event: GitHubEvent): event is GitHubEvent & { payload: DeleteEventPayload } {
  return event.type === "DeleteEvent";
}

export function isForkEvent(event: GitHubEvent): event is GitHubEvent & { payload: ForkEventPayload } {
  return event.type === "ForkEvent";
}

export function isWatchEvent(event: GitHubEvent): event is GitHubEvent & { payload: WatchEventPayload } {
  return event.type === "WatchEvent";
}

export function isReleaseEvent(event: GitHubEvent): event is GitHubEvent & { payload: ReleaseEventPayload } {
  return event.type === "ReleaseEvent";
}
