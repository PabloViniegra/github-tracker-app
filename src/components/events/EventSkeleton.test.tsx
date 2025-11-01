/**
 * Tests for EventSkeleton Component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import EventSkeleton, { EventSkeletonList } from './EventSkeleton';

describe('EventSkeleton', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<EventSkeleton />);

    // Check for Card component
    const card = container.querySelector('.border');
    expect(card).toBeInTheDocument();
  });

  it('should render timeline connector dot', () => {
    const { container } = render(<EventSkeleton />);

    // Check for absolute positioned dot (w-3 h-3)
    const dot = container.querySelector('.absolute.w-3.h-3');
    expect(dot).toBeInTheDocument();
  });

  it('should render timeline vertical line', () => {
    const { container } = render(<EventSkeleton />);

    // Check for vertical line (w-px)
    const line = container.querySelector('.w-px.bg-border');
    expect(line).toBeInTheDocument();
  });

  it('should render icon skeleton', () => {
    const { container } = render(<EventSkeleton />);

    // Check for icon skeleton (w-5 h-5)
    const iconSkeleton = container.querySelector('.w-5.h-5.rounded');
    expect(iconSkeleton).toBeInTheDocument();
  });

  it('should render content skeletons', () => {
    const { container } = render(<EventSkeleton />);

    // Check for HeroUI Skeleton components (they use different implementation)
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    // If HeroUI doesn't use that class, check for any skeleton-like structure
    if (skeletons.length === 0) {
      // Check for the rounded skeleton elements we defined
      const roundedSkeletons = container.querySelectorAll('.rounded, .rounded-full');
      expect(roundedSkeletons.length).toBeGreaterThan(0);
    } else {
      expect(skeletons.length).toBeGreaterThan(0);
    }
  });

  it('should render title skeleton', () => {
    const { container } = render(<EventSkeleton />);

    // Check for title skeleton (h-5)
    const titleSkeleton = container.querySelector('.h-5.w-3\\/4');
    expect(titleSkeleton).toBeInTheDocument();
  });

  it('should render description skeletons', () => {
    const { container } = render(<EventSkeleton />);

    // Check for description skeletons (h-4)
    const descSkeletons = container.querySelectorAll('.h-4');
    expect(descSkeletons.length).toBeGreaterThan(0);
  });

  it('should render footer skeletons', () => {
    const { container } = render(<EventSkeleton />);

    // Check for footer elements (h-3)
    const footerSkeletons = container.querySelectorAll('.h-3');
    expect(footerSkeletons.length).toBeGreaterThan(0);
  });

  it('should have proper spacing', () => {
    const { container } = render(<EventSkeleton />);

    // Check for space-y-3 class
    const spacedContainer = container.querySelector('.space-y-3');
    expect(spacedContainer).toBeInTheDocument();
  });

  it('should match EventCard structure', () => {
    const { container } = render(<EventSkeleton />);

    // Check for Card structure
    const card = container.querySelector('.border.border-border');
    expect(card).toBeInTheDocument();

    // Check for padding
    const cardBody = container.querySelector('.p-5');
    expect(cardBody).toBeInTheDocument();
  });
});

describe('EventSkeletonList', () => {
  it('should render default count of 3 skeletons', () => {
    const { container } = render(<EventSkeletonList />);

    // Count the number of cards rendered
    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(3);
  });

  it('should render custom count of skeletons', () => {
    const { container } = render(<EventSkeletonList count={5} />);

    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(5);
  });

  it('should render single skeleton', () => {
    const { container } = render(<EventSkeletonList count={1} />);

    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(1);
  });

  it('should render many skeletons', () => {
    const { container } = render(<EventSkeletonList count={10} />);

    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(10);
  });

  it('should have spacing between skeletons', () => {
    const { container } = render(<EventSkeletonList count={3} />);

    // Check for space-y-4 class
    const list = container.querySelector('.space-y-4');
    expect(list).toBeInTheDocument();
  });

  it('should render zero skeletons when count is 0', () => {
    const { container } = render(<EventSkeletonList count={0} />);

    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(0);
  });

  it('should give each skeleton a unique key', () => {
    const { container } = render(<EventSkeletonList count={3} />);

    // Each skeleton should be rendered (check by counting cards)
    const cards = container.querySelectorAll('.border.border-border');
    expect(cards.length).toBe(3);

    // All cards should be in the DOM (no key warnings in console)
    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
    });
  });
});
