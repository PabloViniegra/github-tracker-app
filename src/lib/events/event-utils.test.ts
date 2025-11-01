/**
 * Tests for Event Utility Functions
 */

import { describe, it, expect } from 'vitest';
import {
  getEventColor,
  getEventTitle,
  getEventDescription,
  getEventUrl,
  formatEventDate,
  getDateSeparatorLabel,
  groupEventsByDate,
  truncateText,
  getBranchName,
  formatCommitSha,
  EVENT_COLORS,
} from './event-utils';
import {
  createMockPushEvent,
  createMockPullRequestEvent,
  createMockIssuesEvent,
} from '@/test/mockData';
import { GitHubEvent } from '@/types/github';

describe('getEventColor', () => {
  it('should return correct color for PushEvent', () => {
    expect(getEventColor('PushEvent')).toBe('#60A5FA');
  });

  it('should return correct color for PullRequestEvent', () => {
    expect(getEventColor('PullRequestEvent')).toBe('#C084FC');
  });

  it('should return correct color for IssuesEvent', () => {
    expect(getEventColor('IssuesEvent')).toBe('#4ADE80');
  });

  it('should return default color for unknown event type', () => {
    expect(getEventColor('UnknownEvent' as any)).toBe('#858585');
  });

  it('should have colors defined for all event types', () => {
    expect(EVENT_COLORS.PushEvent).toBeDefined();
    expect(EVENT_COLORS.CreateEvent).toBeDefined();
    expect(EVENT_COLORS.DeleteEvent).toBeDefined();
    expect(EVENT_COLORS.ForkEvent).toBeDefined();
  });
});

describe('getEventTitle', () => {
  it('should return correct title for PushEvent with single commit', () => {
    const event = createMockPushEvent({
      payload: {
        ref: 'refs/heads/main',
        commits: [{ sha: 'abc', author: { name: 'Test', email: 'test@test.com' }, message: 'Test', distinct: true, url: '' }],
      } as any,
    });
    expect(getEventTitle(event)).toBe('Pushed 1 commit to main');
  });

  it('should return correct title for PushEvent with multiple commits', () => {
    const event = createMockPushEvent({
      payload: {
        ref: 'refs/heads/main',
        commits: [{}, {}],
      } as any,
    });
    expect(getEventTitle(event)).toBe('Pushed 2 commits to main');
  });

  it('should return correct title for opened PullRequestEvent', () => {
    const event = createMockPullRequestEvent({
      payload: {
        action: 'opened',
        number: 42,
      } as any,
    });
    expect(getEventTitle(event)).toBe('Opened pull request #42');
  });

  it('should return correct title for merged PullRequestEvent', () => {
    const event = createMockPullRequestEvent({
      payload: {
        action: 'closed',
        number: 42,
        pull_request: {
          merged_at: '2025-01-01T12:00:00Z',
        } as any,
      } as any,
    });
    expect(getEventTitle(event)).toBe('Merged pull request #42');
  });

  it('should return correct title for IssuesEvent', () => {
    const event = createMockIssuesEvent({
      payload: {
        action: 'opened',
        issue: { number: 10 } as any,
      } as any,
    });
    expect(getEventTitle(event)).toBe('Opened issue #10');
  });

  it('should return correct title for IssueCommentEvent', () => {
    const event: GitHubEvent = {
      ...createMockIssuesEvent(),
      type: 'IssueCommentEvent',
      payload: {
        action: 'created',
        issue: { number: 5 } as any,
      } as any,
    };
    expect(getEventTitle(event)).toBe('Commented on issue #5');
  });

  it('should return correct title for CreateEvent with branch', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'CreateEvent',
      payload: {
        ref_type: 'branch',
        ref: 'feature-branch',
      } as any,
    };
    expect(getEventTitle(event)).toBe('Created branch feature-branch');
  });

  it('should return correct title for DeleteEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'DeleteEvent',
      payload: {
        ref_type: 'branch',
        ref: 'old-branch',
      } as any,
    };
    expect(getEventTitle(event)).toBe('Deleted branch old-branch');
  });

  it('should return correct title for ForkEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'ForkEvent',
      repo: { id: 1, name: 'user/test-repo', url: '' },
    } as any;
    expect(getEventTitle(event)).toBe('Forked test-repo');
  });

  it('should return correct title for WatchEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'WatchEvent',
      repo: { id: 1, name: 'user/test-repo', url: '' },
    } as any;
    expect(getEventTitle(event)).toBe('Starred test-repo');
  });

  it('should return correct title for ReleaseEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'ReleaseEvent',
      payload: {
        action: 'published',
        release: { tag_name: 'v1.0.0' } as any,
      } as any,
    };
    expect(getEventTitle(event)).toBe('Published release v1.0.0');
  });

  it('should handle unknown event types gracefully', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'PublicEvent' as any,
    };
    expect(getEventTitle(event)).toBe('Public');
  });
});

describe('getEventDescription', () => {
  it('should return PR title for PullRequestEvent', () => {
    const event = createMockPullRequestEvent({
      payload: {
        pull_request: {
          title: 'Fix bug in feature',
        } as any,
      } as any,
    });
    expect(getEventDescription(event)).toBe('Fix bug in feature');
  });

  it('should return issue title for IssuesEvent', () => {
    const event = createMockIssuesEvent({
      payload: {
        issue: {
          title: 'Bug report',
        } as any,
      } as any,
    });
    expect(getEventDescription(event)).toBe('Bug report');
  });

  it('should return commit message for PushEvent', () => {
    const event = createMockPushEvent({
      payload: {
        commits: [{ message: 'Initial commit' } as any],
      } as any,
    });
    expect(getEventDescription(event)).toBe('Initial commit');
  });

  it('should return null for events without description', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'WatchEvent',
    };
    expect(getEventDescription(event)).toBeNull();
  });

  it('should return release name for ReleaseEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'ReleaseEvent',
      payload: {
        release: { name: 'Version 1.0' } as any,
      } as any,
    };
    expect(getEventDescription(event)).toBe('Version 1.0');
  });
});

describe('getEventUrl', () => {
  it('should return commits URL for PushEvent', () => {
    const event = createMockPushEvent({
      repo: { id: 1, name: 'user/repo', url: '' },
      payload: {
        ref: 'refs/heads/main',
      } as any,
    });
    expect(getEventUrl(event)).toBe('https://github.com/user/repo/commits/main');
  });

  it('should return PR URL for PullRequestEvent', () => {
    const event = createMockPullRequestEvent({
      payload: {
        pull_request: {
          html_url: 'https://github.com/user/repo/pull/1',
        } as any,
      } as any,
    });
    expect(getEventUrl(event)).toBe('https://github.com/user/repo/pull/1');
  });

  it('should return issue URL for IssuesEvent', () => {
    const event = createMockIssuesEvent({
      payload: {
        issue: {
          html_url: 'https://github.com/user/repo/issues/1',
        } as any,
      } as any,
    });
    expect(getEventUrl(event)).toBe('https://github.com/user/repo/issues/1');
  });

  it('should return branch URL for CreateEvent with branch', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'CreateEvent',
      repo: { id: 1, name: 'user/repo', url: '' },
      payload: {
        ref_type: 'branch',
        ref: 'feature',
      } as any,
    };
    expect(getEventUrl(event)).toBe('https://github.com/user/repo/tree/feature');
  });

  it('should return tag URL for CreateEvent with tag', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'CreateEvent',
      repo: { id: 1, name: 'user/repo', url: '' },
      payload: {
        ref_type: 'tag',
        ref: 'v1.0.0',
      } as any,
    };
    expect(getEventUrl(event)).toBe('https://github.com/user/repo/releases/tag/v1.0.0');
  });

  it('should return repo URL as fallback', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'WatchEvent',
      repo: { id: 1, name: 'user/repo', url: '' },
    };
    expect(getEventUrl(event)).toBe('https://github.com/user/repo');
  });
});

describe('formatEventDate', () => {
  it('should return "just now" for dates less than 1 minute ago', () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() - 30);
    expect(formatEventDate(date.toISOString())).toBe('just now');
  });

  it('should return minutes for dates less than 1 hour ago', () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 30);
    expect(formatEventDate(date.toISOString())).toBe('30m ago');
  });

  it('should return hours for dates less than 24 hours ago', () => {
    const date = new Date();
    date.setHours(date.getHours() - 5);
    expect(formatEventDate(date.toISOString())).toBe('5h ago');
  });

  it('should return days for dates less than 7 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    expect(formatEventDate(date.toISOString())).toBe('3d ago');
  });

  it('should return formatted date for older dates', () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const result = formatEventDate(date.toISOString());
    expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}/); // e.g., "Jan 1"
  });
});

describe('getDateSeparatorLabel', () => {
  it('should return "Today" for today', () => {
    const today = new Date();
    expect(getDateSeparatorLabel(today.toISOString())).toBe('Today');
  });

  it('should return "Yesterday" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getDateSeparatorLabel(yesterday.toISOString())).toBe('Yesterday');
  });

  it('should return "This Week" for dates 2-6 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    expect(getDateSeparatorLabel(date.toISOString())).toBe('This Week');
  });

  it('should return "Last Week" for dates 7-13 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 10);
    expect(getDateSeparatorLabel(date.toISOString())).toBe('Last Week');
  });

  it('should return "This Month" for dates 14-29 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 20);
    expect(getDateSeparatorLabel(date.toISOString())).toBe('This Month');
  });

  it('should return month and year for older dates', () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    const result = getDateSeparatorLabel(date.toISOString());
    expect(result).toMatch(/[A-Z][a-z]+ \d{4}/); // e.g., "November 2024"
  });
});

describe('groupEventsByDate', () => {
  it('should group events by date labels', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const events = [
      createMockPushEvent({ id: '1', created_at: today.toISOString() }),
      createMockPushEvent({ id: '2', created_at: today.toISOString() }),
      createMockPushEvent({ id: '3', created_at: yesterday.toISOString() }),
    ];

    const grouped = groupEventsByDate(events);

    expect(grouped.has('Today')).toBe(true);
    expect(grouped.has('Yesterday')).toBe(true);
    expect(grouped.get('Today')?.length).toBe(2);
    expect(grouped.get('Yesterday')?.length).toBe(1);
  });

  it('should handle empty array', () => {
    const grouped = groupEventsByDate([]);
    expect(grouped.size).toBe(0);
  });

  it('should maintain event order within groups', () => {
    const today = new Date();
    const events = [
      createMockPushEvent({ id: '1', created_at: today.toISOString() }),
      createMockPushEvent({ id: '2', created_at: today.toISOString() }),
    ];

    const grouped = groupEventsByDate(events);
    const todayEvents = grouped.get('Today')!;

    expect(todayEvents[0].id).toBe('1');
    expect(todayEvents[1].id).toBe('2');
  });
});

describe('truncateText', () => {
  it('should return text as-is if under max length', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate text and add ellipsis', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello Wo...');
  });

  it('should handle exact max length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should trim whitespace before adding ellipsis', () => {
    expect(truncateText('Hello  World  ', 8)).toBe('Hello  W...');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('getBranchName', () => {
  it('should remove refs/heads/ prefix', () => {
    expect(getBranchName('refs/heads/main')).toBe('main');
  });

  it('should remove refs/tags/ prefix', () => {
    expect(getBranchName('refs/tags/v1.0.0')).toBe('v1.0.0');
  });

  it('should return string as-is if no prefix', () => {
    expect(getBranchName('feature-branch')).toBe('feature-branch');
  });

  it('should handle multiple slashes correctly', () => {
    expect(getBranchName('refs/heads/feature/my-feature')).toBe('feature/my-feature');
  });
});

describe('formatCommitSha', () => {
  it('should return first 7 characters', () => {
    expect(formatCommitSha('abcdef1234567890')).toBe('abcdef1');
  });

  it('should handle short SHAs', () => {
    expect(formatCommitSha('abc')).toBe('abc');
  });

  it('should handle exactly 7 characters', () => {
    expect(formatCommitSha('abcdefg')).toBe('abcdefg');
  });

  it('should handle empty string', () => {
    expect(formatCommitSha('')).toBe('');
  });
});
