/**
 * Tests for EventIcon Component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import EventIcon from './EventIcon';
import {
  createMockPushEvent,
  createMockPullRequestEvent,
  createMockIssuesEvent,
} from '@/test/mockData';
import { GitHubEvent } from '@/types/github';

describe('EventIcon', () => {
  it('should render icon for PushEvent', () => {
    const event = createMockPushEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for PullRequestEvent', () => {
    const event = createMockPullRequestEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for IssuesEvent', () => {
    const event = createMockIssuesEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render merged icon for merged pull request', () => {
    const event = createMockPullRequestEvent({
      // @ts-expect-error - Testing partial payload type
      payload: {
        action: 'closed',
        number: 1,
        // @ts-expect-error - Testing partial pull_request type
        pull_request: {
          merged_at: '2025-01-01T12:00:00Z',
        },
      },
    });

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should apply correct color based on event type', () => {
    const event = createMockPushEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveStyle({ color: '#60A5FA' }); // PushEvent color
  });

  it('should render icon for CreateEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'CreateEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for DeleteEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'DeleteEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for ForkEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'ForkEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for WatchEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'WatchEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render icon for ReleaseEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'ReleaseEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should accept custom size prop', () => {
    const event = createMockPushEvent();
    const { container } = render(<EventIcon event={event} size={32} />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('should use default size when not specified', () => {
    const event = createMockPushEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
  });

  it('should apply flex-shrink-0 class', () => {
    const event = createMockPushEvent();
    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('flex-shrink-0');
  });

  it('should render fallback icon for unknown event types', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      // @ts-expect-error - Testing invalid event type
      type: 'UnknownEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle IssueCommentEvent', () => {
    const event: GitHubEvent = {
      ...createMockIssuesEvent(),
      type: 'IssueCommentEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle CommitCommentEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'CommitCommentEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle PublicEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'PublicEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle MemberEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'MemberEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle GollumEvent', () => {
    const event: GitHubEvent = {
      ...createMockPushEvent(),
      type: 'GollumEvent',
    };

    const { container } = render(<EventIcon event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
