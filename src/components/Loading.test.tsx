/**
 * Tests for Loading Components
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import {
  LoadingSpinner,
  LoadingCard,
  LoadingInline,
  LoadingSkeleton,
  LoadingDashboardSkeleton,
} from './Loading';

describe('LoadingSpinner', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('should render small spinner', () => {
    const { container } = render(<LoadingSpinner size="sm" />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('should render large spinner', () => {
    const { container } = render(<LoadingSpinner size="lg" />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('should apply correct border classes', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('border-muted', 'border-t-foreground', 'rounded-full');
  });
});

describe('LoadingCard', () => {
  it('should render default loading message', () => {
    render(<LoadingCard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<LoadingCard message="Loading user data..." />);

    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  it('should render spinner', () => {
    const { container } = render(<LoadingCard />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should be centered on screen', () => {
    const { container } = render(<LoadingCard />);

    const wrapper = container.querySelector('.min-h-screen');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should render inside a Card component', () => {
    const { container } = render(<LoadingCard />);

    const card = container.querySelector('.border');
    expect(card).toBeInTheDocument();
  });

  it('should use large spinner', () => {
    const { container } = render(<LoadingCard />);

    const spinner = container.querySelector('.w-16.h-16');
    expect(spinner).toBeInTheDocument();
  });
});

describe('LoadingInline', () => {
  it('should render spinner without message by default', () => {
    const { container } = render(<LoadingInline />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingInline message="Loading data..." />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should use medium spinner', () => {
    const { container } = render(<LoadingInline />);

    const spinner = container.querySelector('.w-12.h-12');
    expect(spinner).toBeInTheDocument();
  });

  it('should be centered within container', () => {
    const { container } = render(<LoadingInline />);

    const wrapper = container.querySelector('.flex.items-center.justify-center');
    expect(wrapper).toBeInTheDocument();
  });

  it('should have vertical spacing', () => {
    const { container } = render(<LoadingInline />);

    const wrapper = container.querySelector('.py-12');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('LoadingSkeleton', () => {
  it('should render single skeleton by default', () => {
    const { container } = render(<LoadingSkeleton />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(1);
  });

  it('should render multiple skeletons', () => {
    const { container } = render(<LoadingSkeleton count={5} />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(5);
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingSkeleton className="h-10 w-full" />);

    const skeleton = container.querySelector('.h-10.w-full');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have pulse animation', () => {
    const { container } = render(<LoadingSkeleton />);

    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have muted background', () => {
    const { container } = render(<LoadingSkeleton />);

    const skeleton = container.querySelector('.bg-muted');
    expect(skeleton).toBeInTheDocument();
  });

  it('should be rounded', () => {
    const { container } = render(<LoadingSkeleton />);

    const skeleton = container.querySelector('.rounded');
    expect(skeleton).toBeInTheDocument();
  });
});

describe('LoadingDashboardSkeleton', () => {
  it('should render header skeleton', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    const headerSkeletons = container.querySelectorAll('.h-6.w-48, .h-9.w-20');
    expect(headerSkeletons.length).toBeGreaterThan(0);
  });

  it('should render profile card skeleton', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    // Avatar skeleton
    const avatar = container.querySelector('.w-20.h-20.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should render stats skeletons', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    // Stats row
    const statsContainer = container.querySelector('.flex.gap-6');
    expect(statsContainer).toBeInTheDocument();
  });

  it('should render metadata grid skeletons', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    // Metadata grid
    const metadataGrid = container.querySelector('.grid.grid-cols-2');
    expect(metadataGrid).toBeInTheDocument();
  });

  it('should render quick actions skeletons', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    // Quick actions grid (3 items)
    const quickActions = container.querySelectorAll('.border.border-border.bg-card.p-6');
    expect(quickActions.length).toBeGreaterThanOrEqual(3);
  });

  it('should have full screen height', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    const wrapper = container.querySelector('.min-h-screen');
    expect(wrapper).toBeInTheDocument();
  });

  it('should have proper max width', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    const contentContainer = container.querySelector('.max-w-6xl');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should render all skeleton elements with pulse animation', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    const pulsingElements = container.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThan(10);
  });

  it('should have border styling', () => {
    const { container } = render(<LoadingDashboardSkeleton />);

    const borders = container.querySelectorAll('.border-b, .border-t');
    expect(borders.length).toBeGreaterThan(0);
  });
});
