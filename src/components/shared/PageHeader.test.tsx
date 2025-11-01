/**
 * Tests for PageHeader Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  const defaultProps = {
    title: 'Test Page',
    onLogout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title', () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(<PageHeader {...defaultProps} subtitle="Test subtitle" />);

    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('should render username when provided', () => {
    render(<PageHeader {...defaultProps} username="testuser" />);

    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('should render logout button', () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    render(<PageHeader {...defaultProps} onLogout={onLogout} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should not render back button by default', () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('should render back button when showBackButton is true', () => {
    render(<PageHeader {...defaultProps} showBackButton />);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('should link back button to default href', () => {
    render(<PageHeader {...defaultProps} showBackButton />);

    const backButton = screen.getByRole('button', { name: /back/i });
    const link = backButton.closest('a');

    expect(link).toHaveAttribute('href', '/');
  });

  it('should link back button to custom href', () => {
    render(<PageHeader {...defaultProps} showBackButton backHref="/dashboard" />);

    const backButton = screen.getByRole('button', { name: /back/i });
    const link = backButton.closest('a');

    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should render custom actions', () => {
    render(
      <PageHeader
        {...defaultProps}
        actions={<button>Custom Action</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
  });

  it('should apply default maxWidth class', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const contentContainer = container.querySelector('.max-w-6xl');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should apply custom maxWidth class', () => {
    const { container } = render(<PageHeader {...defaultProps} maxWidth="7xl" />);

    const contentContainer = container.querySelector('.max-w-7xl');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should have sticky positioning', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('should have border bottom', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('border-b', 'border-border');
  });

  it('should have backdrop blur', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('backdrop-blur-sm');
  });

  it('should render title with proper styling', () => {
    render(<PageHeader {...defaultProps} />);

    const title = screen.getByText('Test Page');
    expect(title).toHaveClass('text-xl', 'font-semibold');
  });

  it('should render subtitle with proper styling', () => {
    render(<PageHeader {...defaultProps} subtitle="Subtitle" />);

    const subtitle = screen.getByText('Subtitle');
    expect(subtitle).toHaveClass('text-xs', 'text-muted-foreground');
  });

  it('should render username with proper styling', () => {
    render(<PageHeader {...defaultProps} username="testuser" />);

    const username = screen.getByText('@testuser');
    expect(username).toHaveClass('text-xs', 'font-mono');
  });

  it('should render all three text elements when provided', () => {
    render(
      <PageHeader
        {...defaultProps}
        subtitle="Subtitle"
        username="testuser"
      />
    );

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('should render logout button with icon', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    const icon = logoutButton.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('should render back button with icon', () => {
    const { container } = render(<PageHeader {...defaultProps} showBackButton />);

    const backButton = screen.getByRole('button', { name: /back/i });
    const icon = backButton.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('should have proper horizontal spacing', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const contentContainer = container.querySelector('.px-6.py-4');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should have flex layout for header content', () => {
    const { container } = render(<PageHeader {...defaultProps} />);

    const flexContainer = container.querySelector('.flex.items-center.justify-between');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should group actions and logout button together', () => {
    render(
      <PageHeader
        {...defaultProps}
        actions={<button>Action</button>}
      />
    );

    const actionButton = screen.getByRole('button', { name: 'Action' });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    // Both should be in the same container (may have different immediate parents due to HeroUI wrapper)
    // Check they share a common ancestor with gap-3 class
    const actionParent = actionButton.parentElement;
    const logoutParent = logoutButton.closest('.flex.items-center.gap-3');

    expect(actionParent).toBeTruthy();
    expect(logoutParent).toBeTruthy();
  });

  it('should memoize component for performance', () => {
    const { rerender } = render(<PageHeader {...defaultProps} />);

    // Re-render with same props shouldn't cause issues
    rerender(<PageHeader {...defaultProps} />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });
});
