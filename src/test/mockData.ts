/**
 * Mock Data Factories
 * Reusable mock data for tests
 */

import {
  GitHubEvent,
  GitHubActor,
  GitHubRepo,
  PushEventPayload,
  PullRequestEventPayload,
  IssuesEventPayload,
  GitHubPullRequest,
  GitHubIssue,
} from '@/types/github';
import { UserProfile, Repository, GitHubUserDetails } from '@/lib/api';

/**
 * Create mock GitHub Actor
 */
export function createMockActor(overrides?: Partial<GitHubActor>): GitHubActor {
  return {
    id: 12345,
    login: 'testuser',
    display_login: 'testuser',
    gravatar_id: '',
    url: 'https://api.github.com/users/testuser',
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    ...overrides,
  };
}

/**
 * Create mock GitHub Repo
 */
export function createMockRepo(overrides?: Partial<GitHubRepo>): GitHubRepo {
  return {
    id: 123456,
    name: 'testuser/test-repo',
    url: 'https://api.github.com/repos/testuser/test-repo',
    ...overrides,
  };
}

/**
 * Create mock PushEvent
 */
export function createMockPushEvent(overrides?: Partial<GitHubEvent>): GitHubEvent {
  return {
    id: '1',
    type: 'PushEvent',
    actor: createMockActor(),
    repo: createMockRepo(),
    payload: {
      push_id: 1,
      size: 1,
      distinct_size: 1,
      ref: 'refs/heads/main',
      head: 'abc123',
      before: 'def456',
      commits: [
        {
          sha: 'abc123',
          author: { email: 'test@example.com', name: 'Test User' },
          message: 'Test commit message',
          distinct: true,
          url: 'https://api.github.com/repos/testuser/test-repo/commits/abc123',
        },
      ],
    } as PushEventPayload,
    public: true,
    created_at: '2025-01-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create mock PullRequestEvent
 */
export function createMockPullRequestEvent(
  overrides?: Partial<GitHubEvent>
): GitHubEvent {
  return {
    id: '2',
    type: 'PullRequestEvent',
    actor: createMockActor(),
    repo: createMockRepo(),
    payload: {
      action: 'opened',
      number: 1,
      pull_request: {
        id: 1,
        number: 1,
        state: 'open',
        locked: false,
        title: 'Test Pull Request',
        user: {
          login: 'testuser',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345',
        },
        body: 'Test PR body',
        created_at: '2025-01-01T12:00:00Z',
        updated_at: '2025-01-01T12:00:00Z',
        closed_at: null,
        merged_at: null,
        merge_commit_sha: null,
        html_url: 'https://github.com/testuser/test-repo/pull/1',
        head: { label: 'testuser:feature', ref: 'feature', sha: 'abc123' },
        base: { label: 'testuser:main', ref: 'main', sha: 'def456' },
      } as GitHubPullRequest,
    } as PullRequestEventPayload,
    public: true,
    created_at: '2025-01-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create mock IssuesEvent
 */
export function createMockIssuesEvent(overrides?: Partial<GitHubEvent>): GitHubEvent {
  return {
    id: '3',
    type: 'IssuesEvent',
    actor: createMockActor(),
    repo: createMockRepo(),
    payload: {
      action: 'opened',
      issue: {
        id: 1,
        number: 1,
        state: 'open',
        title: 'Test Issue',
        user: {
          login: 'testuser',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345',
        },
        body: 'Test issue body',
        created_at: '2025-01-01T12:00:00Z',
        updated_at: '2025-01-01T12:00:00Z',
        closed_at: null,
        html_url: 'https://github.com/testuser/test-repo/issues/1',
        labels: [],
      } as GitHubIssue,
    } as IssuesEventPayload,
    public: true,
    created_at: '2025-01-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create mock UserProfile
 */
export function createMockUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'user-123',
    github_id: 12345,
    username: 'testuser',
    name: 'Test User',
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    email: 'test@example.com',
    profile_url: 'https://github.com/testuser',
    created_at: '2025-01-01T00:00:00Z',
    webhook_configured: false,
    ...overrides,
  };
}

/**
 * Create mock Repository
 */
export function createMockRepository(overrides?: Partial<Repository>): Repository {
  return {
    id: 123456,
    name: 'test-repo',
    full_name: 'testuser/test-repo',
    description: 'Test repository description',
    private: false,
    html_url: 'https://github.com/testuser/test-repo',
    stargazers_count: 10,
    language: 'TypeScript',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T12:00:00Z',
    forks_count: 5,
    watchers_count: 10,
    size: 1024,
    owner: {
      login: 'testuser',
      id: 12345,
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
      html_url: 'https://github.com/testuser',
    },
    ...overrides,
  };
}

/**
 * Create mock GitHubUserDetails
 */
export function createMockGitHubUserDetails(
  overrides?: Partial<GitHubUserDetails>
): GitHubUserDetails {
  return {
    login: 'testuser',
    id: 12345,
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    html_url: 'https://github.com/testuser',
    name: 'Test User',
    company: 'Test Company',
    blog: 'https://testuser.dev',
    location: 'San Francisco, CA',
    email: 'test@example.com',
    bio: 'Test bio',
    twitter_username: 'testuser',
    public_repos: 50,
    public_gists: 10,
    followers: 100,
    following: 50,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Create multiple mock events
 */
export function createMockEvents(count: number): GitHubEvent[] {
  const events: GitHubEvent[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Alternate between different event types
    const eventType = i % 3;

    if (eventType === 0) {
      events.push(
        createMockPushEvent({
          id: `event-${i}`,
          created_at: date.toISOString(),
        })
      );
    } else if (eventType === 1) {
      events.push(
        createMockPullRequestEvent({
          id: `event-${i}`,
          created_at: date.toISOString(),
        })
      );
    } else {
      events.push(
        createMockIssuesEvent({
          id: `event-${i}`,
          created_at: date.toISOString(),
        })
      );
    }
  }

  return events;
}

/**
 * Create multiple mock repositories
 */
export function createMockRepositories(count: number): Repository[] {
  return Array.from({ length: count }, (_, i) =>
    createMockRepository({
      id: 123456 + i,
      name: `test-repo-${i}`,
      full_name: `testuser/test-repo-${i}`,
    })
  );
}
