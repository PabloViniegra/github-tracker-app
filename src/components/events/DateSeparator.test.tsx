/**
 * Tests for DateSeparator Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import DateSeparator from './DateSeparator';

describe('DateSeparator', () => {
  it('should render the label', () => {
    render(<DateSeparator label="Today" />);

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should render with uppercase styling', () => {
    render(<DateSeparator label="Yesterday" />);

    const label = screen.getByText('Yesterday');
    expect(label).toHaveClass('uppercase');
  });

  it('should render with correct structure', () => {
    const { container } = render(<DateSeparator label="This Week" />);

    // Check for motion.div wrapper
    const wrapper = container.querySelector('div');
    expect(wrapper).toBeInTheDocument();

    // Check for label
    const label = screen.getByText('This Week');
    expect(label).toBeInTheDocument();
  });

  it('should render different labels', () => {
    const { rerender } = render(<DateSeparator label="Today" />);
    expect(screen.getByText('Today')).toBeInTheDocument();

    rerender(<DateSeparator label="Last Week" />);
    expect(screen.getByText('Last Week')).toBeInTheDocument();

    rerender(<DateSeparator label="January 2025" />);
    expect(screen.getByText('January 2025')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(<DateSeparator label="Today" />);

    const label = screen.getByText('Today');
    expect(label).toHaveClass('text-xs');
    expect(label).toHaveClass('font-semibold');
    expect(label).toHaveClass('uppercase');
    expect(label).toHaveClass('tracking-wider');
  });

  it('should handle empty label gracefully', () => {
    render(<DateSeparator label="" />);

    // Component should still render, just with empty text
    const label = screen.queryByText('', { selector: 'span' });
    expect(label).toBeInTheDocument();
  });

  it('should handle special characters in label', () => {
    render(<DateSeparator label="Week of 01/15" />);
    expect(screen.getByText('Week of 01/15')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const { container } = render(<DateSeparator label="Today" />);

    // Check for horizontal lines (gradient dividers)
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(1); // Main wrapper + gradient lines
  });
});
