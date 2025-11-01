/**
 * Tests for RepositoryCardSkeleton Component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import RepositoryCardSkeleton from './RepositoryCardSkeleton';

describe('RepositoryCardSkeleton', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Check for Card component
    const card = container.querySelector('.border.border-border');
    expect(card).toBeInTheDocument();
  });

  it('should render repository name skeleton', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Repository name skeleton (h-6 w-3/4)
    const nameSkeleton = container.querySelector('.h-6.w-3\\/4');
    expect(nameSkeleton).toBeInTheDocument();
  });

  it('should render description skeletons', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Description skeletons (h-4)
    const descSkeletons = container.querySelectorAll('.h-4');
    expect(descSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render language badge skeleton', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Language badge skeleton (h-5 w-20 rounded-full)
    const languageSkeleton = container.querySelector('.h-5.w-20.rounded-full');
    expect(languageSkeleton).toBeInTheDocument();
  });

  it('should render stats skeletons', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Stars and forks skeletons (h-4 w-12)
    const statSkeletons = container.querySelectorAll('.h-4.w-12');
    expect(statSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('should have pulse animation on all skeletons', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const pulsingElements = container.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThan(0);
  });

  it('should have muted background on skeletons', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const mutedElements = container.querySelectorAll('.bg-muted');
    expect(mutedElements.length).toBeGreaterThan(0);
  });

  it('should have proper spacing between elements', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Check for space-y-4 and space-y-2 classes
    const spacedContainers = container.querySelectorAll('.space-y-4, .space-y-2');
    expect(spacedContainers.length).toBeGreaterThan(0);
  });

  it('should have proper card padding', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const cardBody = container.querySelector('.p-6');
    expect(cardBody).toBeInTheDocument();
  });

  it('should have flex layout for stats row', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const statsRow = container.querySelector('.flex.items-center.justify-between');
    expect(statsRow).toBeInTheDocument();
  });

  it('should have gap between stat items', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const statsContainer = container.querySelector('.gap-4');
    expect(statsContainer).toBeInTheDocument();
  });

  it('should match RepositoryCard structure', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    // Should have Card wrapper
    const card = container.querySelector('.border.border-border.bg-card');
    expect(card).toBeInTheDocument();

    // Should have proper content structure
    const contentContainer = container.querySelector('.space-y-4');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should render all skeleton elements with rounded corners', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const roundedElements = container.querySelectorAll('.rounded, .rounded-full');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it('should have proper spacing with pt-2 for stats section', () => {
    const { container } = render(<RepositoryCardSkeleton />);

    const statsSection = container.querySelector('.pt-2');
    expect(statsSection).toBeInTheDocument();
  });
});
