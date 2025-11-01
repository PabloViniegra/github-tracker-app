/**
 * Tests for Analytics Data Processing Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTimeRange,
  filterEventsByTimeRange,
  processActivityTimeline,
  processEventDistribution,
  processTopRepositories,
  processContributionCalendar,
  processLanguageBreakdown,
  calculateSummary,
  formatNumber,
  formatPercentage,
} from './processAnalyticsData';
import {
  createMockPushEvent,
  createMockPullRequestEvent,
  createMockIssuesEvent,
  createMockRepository,
} from '@/test/mockData';

describe('calculateTimeRange', () => {
  it('should calculate 7 days range', () => {
    const range = calculateTimeRange('7d');
    const diffDays = Math.floor(
      (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBe(7);
    expect(range.preset).toBe('7d');
  });

  it('should calculate 30 days range', () => {
    const range = calculateTimeRange('30d');
    const diffDays = Math.floor(
      (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBe(30);
    expect(range.preset).toBe('30d');
  });

  it('should calculate 90 days range', () => {
    const range = calculateTimeRange('90d');
    const diffDays = Math.floor(
      (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBe(90);
    expect(range.preset).toBe('90d');
  });

  it('should calculate 1 year range', () => {
    const range = calculateTimeRange('1y');
    const diffYears =
      range.end.getFullYear() - range.start.getFullYear();
    expect(diffYears).toBe(1);
    expect(range.preset).toBe('1y');
  });

  it('should calculate all time range (10 years)', () => {
    const range = calculateTimeRange('all');
    const diffYears =
      range.end.getFullYear() - range.start.getFullYear();
    expect(diffYears).toBe(10);
    expect(range.preset).toBe('all');
  });
});

describe('filterEventsByTimeRange', () => {
  it('should filter events within time range', () => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 8); // 8 days ago to be outside 7d range

    const events = [
      createMockPushEvent({ id: '1', created_at: now.toISOString() }),
      createMockPushEvent({ id: '2', created_at: yesterday.toISOString() }),
      createMockPushEvent({ id: '3', created_at: lastWeek.toISOString() }),
    ];

    const range = calculateTimeRange('7d');
    const filtered = filterEventsByTimeRange(events, range);

    expect(filtered.length).toBe(2);
    expect(filtered.find((e) => e.id === '3')).toBeUndefined();
  });

  it('should return empty array when no events match', () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const events = [
      createMockPushEvent({ created_at: lastYear.toISOString() }),
    ];

    const range = calculateTimeRange('7d');
    const filtered = filterEventsByTimeRange(events, range);

    expect(filtered).toEqual([]);
  });

  it('should handle empty input', () => {
    const range = calculateTimeRange('7d');
    const filtered = filterEventsByTimeRange([], range);
    expect(filtered).toEqual([]);
  });
});

describe('processActivityTimeline', () => {
  it('should process events into daily data points', () => {
    const date1 = '2025-01-01T12:00:00Z';
    const date2 = '2025-01-02T12:00:00Z';

    const events = [
      createMockPushEvent({ created_at: date1 }),
      createMockPullRequestEvent({ created_at: date1 }),
      createMockIssuesEvent({ created_at: date2 }),
    ];

    const timeline = processActivityTimeline(events);

    expect(timeline.length).toBe(2);
    expect(timeline[0].date).toBe('2025-01-01');
    expect(timeline[0].commits).toBe(1);
    expect(timeline[0].pullRequests).toBe(1);
    expect(timeline[0].total).toBe(2);
  });

  it('should count different event types correctly', () => {
    const date = '2025-01-01T12:00:00Z';

    const events = [
      createMockPushEvent({ created_at: date }),
      createMockPushEvent({ created_at: date }),
      createMockPullRequestEvent({ created_at: date }),
      createMockIssuesEvent({ created_at: date }),
      {
        ...createMockIssuesEvent({ created_at: date }),
        type: 'IssueCommentEvent' as const,
      },
      {
        ...createMockPushEvent({ created_at: date }),
        type: 'CommitCommentEvent' as const,
      },
    ];

    const timeline = processActivityTimeline(events);

    expect(timeline.length).toBe(1);
    expect(timeline[0].commits).toBe(2);
    expect(timeline[0].pullRequests).toBe(1);
    expect(timeline[0].issues).toBe(2); // IssuesEvent + IssueCommentEvent
    expect(timeline[0].reviews).toBe(1); // CommitCommentEvent
    expect(timeline[0].total).toBe(6);
  });

  it('should handle empty array', () => {
    expect(processActivityTimeline([])).toEqual([]);
  });

  it('should handle null/undefined input', () => {
    // @ts-expect-error - Testing invalid input type
    expect(processActivityTimeline(null)).toEqual([]);
    // @ts-expect-error - Testing invalid input type
    expect(processActivityTimeline(undefined)).toEqual([]);
  });

  it('should skip invalid events', () => {
    const events = [
      createMockPushEvent({ created_at: '2025-01-01T12:00:00Z' }),
      // @ts-expect-error - Testing invalid event type
      { invalid: 'event' },
      // @ts-expect-error - Testing invalid event type
      null,
      createMockPullRequestEvent({ created_at: '2025-01-01T12:00:00Z' }),
    ];

    const timeline = processActivityTimeline(events);
    expect(timeline[0].total).toBe(2);
  });

  it('should sort timeline by date ascending', () => {
    const events = [
      createMockPushEvent({ created_at: '2025-01-03T12:00:00Z' }),
      createMockPushEvent({ created_at: '2025-01-01T12:00:00Z' }),
      createMockPushEvent({ created_at: '2025-01-02T12:00:00Z' }),
    ];

    const timeline = processActivityTimeline(events);

    expect(timeline[0].date).toBe('2025-01-01');
    expect(timeline[1].date).toBe('2025-01-02');
    expect(timeline[2].date).toBe('2025-01-03');
  });
});

describe('processEventDistribution', () => {
  it('should count events by type', () => {
    const events = [
      createMockPushEvent(),
      createMockPushEvent(),
      createMockPullRequestEvent(),
      createMockIssuesEvent(),
    ];

    const distribution = processEventDistribution(events);

    expect(distribution.length).toBe(3);
    const pushEvents = distribution.find((d) => d.eventType === 'PushEvent');
    expect(pushEvents?.count).toBe(2);
    expect(pushEvents?.percentage).toBe(50);
  });

  it('should sort by count descending', () => {
    const events = [
      createMockPushEvent(),
      createMockPullRequestEvent(),
      createMockPullRequestEvent(),
      createMockPullRequestEvent(),
      createMockIssuesEvent(),
      createMockIssuesEvent(),
    ];

    const distribution = processEventDistribution(events);

    expect(distribution[0].eventType).toBe('PullRequestEvent');
    expect(distribution[0].count).toBe(3);
    expect(distribution[1].count).toBe(2);
    expect(distribution[2].count).toBe(1);
  });

  it('should calculate percentages correctly', () => {
    const events = [
      createMockPushEvent(),
      createMockPushEvent(),
      createMockPullRequestEvent(),
      createMockIssuesEvent(),
    ];

    const distribution = processEventDistribution(events);

    expect(distribution.find((d) => d.eventType === 'PushEvent')?.percentage).toBe(50);
    expect(distribution.find((d) => d.eventType === 'PullRequestEvent')?.percentage).toBe(25);
    expect(distribution.find((d) => d.eventType === 'IssuesEvent')?.percentage).toBe(25);
  });

  it('should handle empty array', () => {
    expect(processEventDistribution([])).toEqual([]);
  });

  it('should handle null/undefined input', () => {
    // @ts-expect-error - Testing invalid input type
    expect(processEventDistribution(null)).toEqual([]);
    // @ts-expect-error - Testing invalid input type
    expect(processEventDistribution(undefined)).toEqual([]);
  });

  it('should skip invalid events', () => {
    const events = [
      createMockPushEvent(),
      // @ts-expect-error - Testing invalid event type
      { invalid: 'event' },
      // @ts-expect-error - Testing invalid event type
      null,
    ];

    const distribution = processEventDistribution(events);
    expect(distribution[0].count).toBe(1);
  });

  it('should map display names correctly', () => {
    const events = [createMockPushEvent()];
    const distribution = processEventDistribution(events);
    expect(distribution[0].displayName).toBe('Commits');
  });
});

describe('processTopRepositories', () => {
  it('should combine events and repository data', () => {
    const repos = [
      createMockRepository({
        full_name: 'user/repo1',
        name: 'repo1',
        stargazers_count: 10,
      }),
    ];

    const events = [
      createMockPushEvent({ repo: { id: 1, name: 'user/repo1', url: '' } }),
      createMockPullRequestEvent({ repo: { id: 1, name: 'user/repo1', url: '' } }),
    ];

    const topRepos = processTopRepositories(events, repos);

    expect(topRepos.length).toBe(1);
    expect(topRepos[0].fullName).toBe('user/repo1');
    expect(topRepos[0].commits).toBe(1);
    expect(topRepos[0].pullRequests).toBe(1);
    expect(topRepos[0].stars).toBe(10);
    expect(topRepos[0].total).toBe(2);
  });

  it('should handle repositories not in repository list', () => {
    const events = [
      createMockPushEvent({ repo: { id: 1, name: 'user/unknown-repo', url: '' } }),
    ];

    const topRepos = processTopRepositories(events, []);

    expect(topRepos.length).toBe(1);
    expect(topRepos[0].fullName).toBe('user/unknown-repo');
    expect(topRepos[0].commits).toBe(1);
  });

  it('should sort by total activity descending', () => {
    const events = [
      createMockPushEvent({ repo: { id: 1, name: 'user/repo1', url: '' } }),
      createMockPushEvent({ repo: { id: 2, name: 'user/repo2', url: '' } }),
      createMockPushEvent({ repo: { id: 2, name: 'user/repo2', url: '' } }),
      createMockPushEvent({ repo: { id: 2, name: 'user/repo2', url: '' } }),
    ];

    const topRepos = processTopRepositories(events, []);

    expect(topRepos[0].fullName).toBe('user/repo2');
    expect(topRepos[0].total).toBe(3);
    expect(topRepos[1].fullName).toBe('user/repo1');
    expect(topRepos[1].total).toBe(1);
  });

  it('should limit to top 5 repositories', () => {
    const events = Array.from({ length: 10 }, (_, i) =>
      createMockPushEvent({ repo: { id: i, name: `user/repo${i}`, url: '' } })
    );

    const topRepos = processTopRepositories(events, []);

    expect(topRepos.length).toBe(5);
  });

  it('should filter out repos with zero activity', () => {
    const repos = [
      createMockRepository({ full_name: 'user/active', name: 'active' }),
      createMockRepository({ full_name: 'user/inactive', name: 'inactive' }),
    ];

    const events = [
      createMockPushEvent({ repo: { id: 1, name: 'user/active', url: '' } }),
    ];

    const topRepos = processTopRepositories(events, repos);

    expect(topRepos.length).toBe(1);
    expect(topRepos[0].fullName).toBe('user/active');
  });

  it('should handle empty inputs', () => {
    expect(processTopRepositories([], [])).toEqual([]);
  });

  it('should handle null/undefined inputs', () => {
    // @ts-expect-error - Testing invalid input type
    expect(processTopRepositories(null, null)).toEqual([]);
    // @ts-expect-error - Testing invalid input type
    expect(processTopRepositories(undefined, undefined)).toEqual([]);
  });

  it('should update last activity to most recent event', () => {
    const events = [
      createMockPushEvent({
        repo: { id: 1, name: 'user/repo', url: '' },
        created_at: '2025-01-01T12:00:00Z',
      }),
      createMockPushEvent({
        repo: { id: 1, name: 'user/repo', url: '' },
        created_at: '2025-01-03T12:00:00Z',
      }),
      createMockPushEvent({
        repo: { id: 1, name: 'user/repo', url: '' },
        created_at: '2025-01-02T12:00:00Z',
      }),
    ];

    const topRepos = processTopRepositories(events, []);

    expect(topRepos[0].lastActivity).toBe('2025-01-03T12:00:00Z');
  });
});

describe('processContributionCalendar', () => {
  it('should generate 365 days of data', () => {
    const calendar = processContributionCalendar([]);
    expect(calendar.length).toBe(365);
  });

  it('should count events per day', () => {
    const today = new Date();
    const events = [
      createMockPushEvent({ created_at: today.toISOString() }),
      createMockPushEvent({ created_at: today.toISOString() }),
      createMockPullRequestEvent({ created_at: today.toISOString() }),
    ];

    const calendar = processContributionCalendar(events);
    const todayData = calendar[calendar.length - 1];

    expect(todayData.count).toBe(3);
  });

  it('should calculate intensity levels correctly', () => {
    const today = new Date();
    const events = [
      // 1 event = level 1
      createMockPushEvent({
        created_at: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      // 5 events = level 2
      ...Array(5)
        .fill(null)
        .map(() =>
          createMockPushEvent({
            created_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          })
        ),
      // 8 events = level 3
      ...Array(8)
        .fill(null)
        .map(() =>
          createMockPushEvent({
            created_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          })
        ),
      // 12 events = level 4
      ...Array(12)
        .fill(null)
        .map(() =>
          createMockPushEvent({
            created_at: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          })
        ),
    ];

    const calendar = processContributionCalendar(events);

    const level1Day = calendar[calendar.length - 2]; // 1 day ago
    const level2Day = calendar[calendar.length - 3]; // 2 days ago
    const level3Day = calendar[calendar.length - 4]; // 3 days ago
    const level4Day = calendar[calendar.length - 5]; // 4 days ago

    expect(level1Day.level).toBe(1);
    expect(level2Day.level).toBe(2);
    expect(level3Day.level).toBe(3);
    expect(level4Day.level).toBe(4);
  });

  it('should handle empty/null input', () => {
    const calendar = processContributionCalendar([]);
    expect(calendar.length).toBe(365);
    expect(calendar.every((day) => day.count === 0)).toBe(true);
  });

  it('should be sorted chronologically', () => {
    const calendar = processContributionCalendar([]);

    for (let i = 1; i < calendar.length; i++) {
      expect(new Date(calendar[i].date) > new Date(calendar[i - 1].date)).toBe(true);
    }
  });
});

describe('processLanguageBreakdown', () => {
  it('should count repositories by language', () => {
    const repos = [
      createMockRepository({ language: 'TypeScript', size: 100, full_name: 'user/repo1' }),
      createMockRepository({ language: 'TypeScript', size: 200, full_name: 'user/repo2' }),
      createMockRepository({ language: 'JavaScript', size: 150, full_name: 'user/repo3' }),
    ];

    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown.length).toBe(2);
    const ts = breakdown.find((l) => l.language === 'TypeScript');
    expect(ts?.repositories).toBe(2);
  });

  it('should calculate percentages correctly', () => {
    const repos = [
      createMockRepository({ language: 'TypeScript', size: 100 }),
      createMockRepository({ language: 'JavaScript', size: 100 }),
    ];

    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown[0].percentage).toBe(50);
    expect(breakdown[1].percentage).toBe(50);
  });

  it('should sort by bytes descending', () => {
    const repos = [
      createMockRepository({ language: 'JavaScript', size: 100 }),
      createMockRepository({ language: 'TypeScript', size: 300 }),
      createMockRepository({ language: 'Python', size: 200 }),
    ];

    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown[0].language).toBe('TypeScript');
    expect(breakdown[1].language).toBe('Python');
    expect(breakdown[2].language).toBe('JavaScript');
  });

  it('should limit to top 5 languages', () => {
    const repos = Array.from({ length: 10 }, (_, i) =>
      createMockRepository({ language: `Lang${i}`, size: 100 - i })
    );

    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown.length).toBe(5);
  });

  it('should skip repositories without language', () => {
    const repos = [
      createMockRepository({ language: 'TypeScript', size: 100 }),
      createMockRepository({ language: null, size: 100 }),
    ];

    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown.length).toBe(1);
    expect(breakdown[0].language).toBe('TypeScript');
  });

  it('should handle empty/null input', () => {
    expect(processLanguageBreakdown([])).toEqual([]);
    // @ts-expect-error - Testing invalid input type
    expect(processLanguageBreakdown(null)).toEqual([]);
  });

  it('should include language colors', () => {
    const repos = [createMockRepository({ language: 'TypeScript' })];
    const breakdown = processLanguageBreakdown(repos);

    expect(breakdown[0].color).toBeDefined();
    expect(breakdown[0].color).toBe('#3178c6');
  });
});

describe('calculateSummary', () => {
  it('should count all event types correctly', () => {
    const events = [
      createMockPushEvent(),
      createMockPushEvent(),
      createMockPullRequestEvent(),
      createMockIssuesEvent(),
      { ...createMockIssuesEvent(), type: 'IssueCommentEvent' as const },
      { ...createMockPushEvent(), type: 'CommitCommentEvent' as const },
    ];

    const summary = calculateSummary(events);

    expect(summary.totalCommits).toBe(2);
    expect(summary.totalPullRequests).toBe(1);
    expect(summary.totalIssues).toBe(2);
    expect(summary.totalReviews).toBe(1);
    expect(summary.totalEvents).toBe(6);
  });

  it('should count unique repositories', () => {
    const events = [
      createMockPushEvent({ repo: { id: 1, name: 'user/repo1', url: '' } }),
      createMockPushEvent({ repo: { id: 1, name: 'user/repo1', url: '' } }),
      createMockPushEvent({ repo: { id: 2, name: 'user/repo2', url: '' } }),
    ];

    const summary = calculateSummary(events);

    expect(summary.activeRepositories).toBe(2);
  });

  it('should count unique active days', () => {
    const events = [
      createMockPushEvent({ created_at: '2025-01-01T12:00:00Z' }),
      createMockPushEvent({ created_at: '2025-01-01T18:00:00Z' }),
      createMockPushEvent({ created_at: '2025-01-02T12:00:00Z' }),
    ];

    const summary = calculateSummary(events);

    expect(summary.activeDays).toBe(2);
  });

  it('should handle empty array', () => {
    const summary = calculateSummary([]);

    expect(summary.totalCommits).toBe(0);
    expect(summary.totalPullRequests).toBe(0);
    expect(summary.totalIssues).toBe(0);
    expect(summary.totalReviews).toBe(0);
    expect(summary.activeRepositories).toBe(0);
    expect(summary.activeDays).toBe(0);
    expect(summary.totalEvents).toBe(0);
  });

  it('should handle null/undefined input', () => {
    // @ts-expect-error - Testing invalid input type
    const summary1 = calculateSummary(null);
    // @ts-expect-error - Testing invalid input type
    const summary2 = calculateSummary(undefined);

    expect(summary1.totalEvents).toBe(0);
    expect(summary2.totalEvents).toBe(0);
  });

  it('should skip invalid events', () => {
    const events = [
      createMockPushEvent(),
      // @ts-expect-error - Testing invalid event type
      { invalid: 'event' },
      // @ts-expect-error - Testing invalid event type
      null,
    ];

    const summary = calculateSummary(events);
    expect(summary.totalEvents).toBe(3); // Counts all events in array
    expect(summary.totalCommits).toBe(1); // But only processes valid ones
  });
});

describe('formatNumber', () => {
  it('should format numbers less than 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(12345678)).toBe('12.3M');
  });

  it('should round to 1 decimal place', () => {
    expect(formatNumber(1234)).toBe('1.2K');
    expect(formatNumber(1567)).toBe('1.6K');
  });
});

describe('formatPercentage', () => {
  it('should format percentage to 1 decimal place', () => {
    expect(formatPercentage(50)).toBe('50.0%');
    expect(formatPercentage(33.333)).toBe('33.3%');
    expect(formatPercentage(66.667)).toBe('66.7%');
  });

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should handle 100', () => {
    expect(formatPercentage(100)).toBe('100.0%');
  });

  it('should handle small numbers', () => {
    expect(formatPercentage(0.1)).toBe('0.1%');
    expect(formatPercentage(0.05)).toBe('0.1%');
  });
});
