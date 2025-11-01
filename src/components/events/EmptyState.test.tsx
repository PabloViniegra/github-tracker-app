/**
 * Tests for EmptyState Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('should render empty state message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No Activity Yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Your GitHub activity timeline is empty/)
    ).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(<EmptyState />);

    // Check for icon container
    const iconContainer = container.querySelector('.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<EmptyState />);

    expect(screen.queryByRole('button', { name: /refresh/i })).not.toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<EmptyState onRetry={onRetry} />);

    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<EmptyState onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render tip section', () => {
    render(<EmptyState />);

    expect(screen.getByText(/Tip:/)).toBeInTheDocument();
    expect(
      screen.getByText(/This page shows your recent GitHub activity/)
    ).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    render(<EmptyState />);

    // Check for Card component
    const heading = screen.getByRole('heading', { level: 3, name: 'No Activity Yet' });
    expect(heading).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(<EmptyState />);

    const heading = screen.getByText('No Activity Yet');
    expect(heading).toHaveClass('text-xl');
    expect(heading).toHaveClass('font-semibold');
  });

  it('should render within a Card component', () => {
    const { container } = render(<EmptyState />);

    // HeroUI Card should be present
    const card = container.querySelector('.border');
    expect(card).toBeInTheDocument();
  });

  it('should center content', () => {
    const { container } = render(<EmptyState />);

    const flexContainer = container.querySelector('.flex.flex-col.items-center');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should have spacing between sections', () => {
    const { container } = render(<EmptyState />);

    const spacedDivs = container.querySelectorAll('.space-y-4, .space-y-2');
    expect(spacedDivs.length).toBeGreaterThan(0);
  });
});
