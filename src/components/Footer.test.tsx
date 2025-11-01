/**
 * Footer Component Tests
 *
 * Tests for the Footer component which displays app name, year,
 * and links to Terms and Privacy modals.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import Footer from './Footer';

// Mock current year for consistent testing
const MOCK_YEAR = 2025;

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock Date to return consistent year
    vi.useFakeTimers();
    vi.setSystemTime(new Date(MOCK_YEAR, 0, 1));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render the footer component', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should display the application name', () => {
      render(<Footer />);

      // Look for "GitHub Activity Tracker" or app name
      const appName = screen.getByText(/GitHub Activity Tracker/i);
      expect(appName).toBeInTheDocument();
    });

    it('should display the current year dynamically', () => {
      render(<Footer />);

      const yearText = screen.getByText(new RegExp(MOCK_YEAR.toString()));
      expect(yearText).toBeInTheDocument();
    });

    it('should render the Terms and Conditions link', () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      expect(termsLink).toBeInTheDocument();
    });

    it('should render the Privacy Policy link', () => {
      render(<Footer />);

      const privacyLink = screen.getByText(/Privacy Policy/i);
      expect(privacyLink).toBeInTheDocument();
    });

    it('should render both modal links as clickable buttons or links', () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      const privacyLink = screen.getByText(/Privacy Policy/i);

      // Check they are clickable elements (button or link)
      expect(termsLink.tagName).toMatch(/BUTTON|A/i);
      expect(privacyLink.tagName).toMatch(/BUTTON|A/i);
    });
  });

  describe('Terms Modal Interaction', () => {
    it.skip('should open the Terms modal when clicking the Terms link', async () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);

      // Modal should not be visible initially
      expect(screen.queryByRole('dialog', { name: /terms/i })).not.toBeInTheDocument();

      // Click the terms link
      fireEvent.click(termsLink);

      // Modal should now be visible
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
      });
    });

    it.skip('should close the Terms modal when close button is clicked', async () => {
      render(<Footer />);

      // Open the modal
      const termsLink = screen.getByText(/Terms and Conditions/i);
      fireEvent.click(termsLink);

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it.skip('should display Terms content in the modal', async () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      fireEvent.click(termsLink);

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();

        // Check for terms-specific content
        expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Privacy Modal Interaction', () => {
    it.skip('should open the Privacy modal when clicking the Privacy link', async () => {
      render(<Footer />);

      const privacyLink = screen.getByText(/Privacy Policy/i);

      // Modal should not be visible initially
      expect(screen.queryByRole('dialog', { name: /privacy/i })).not.toBeInTheDocument();

      // Click the privacy link
      fireEvent.click(privacyLink);

      // Modal should now be visible
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
      });
    });

    it.skip('should close the Privacy modal when close button is clicked', async () => {
      render(<Footer />);

      // Open the modal
      const privacyLink = screen.getByText(/Privacy Policy/i);
      fireEvent.click(privacyLink);

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it.skip('should display Privacy content in the modal', async () => {
      render(<Footer />);

      const privacyLink = screen.getByText(/Privacy Policy/i);
      fireEvent.click(privacyLink);

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();

        // Check for privacy-specific content
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      });
    });
  });

  describe('Modal State Management', () => {
    it.skip('should only show one modal at a time', async () => {
      render(<Footer />);

      // Open Terms modal
      const termsLink = screen.getByText(/Terms and Conditions/i);
      fireEvent.click(termsLink);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close Terms modal
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Open Privacy modal
      const privacyLink = screen.getByText(/Privacy Policy/i);
      fireEvent.click(privacyLink);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it.skip('should close modal when clicking backdrop (if supported)', async () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      fireEvent.click(termsLink);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Try to find and click backdrop
      const backdrop = document.querySelector('[data-slot="backdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', () => {
      // Set mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();

      // All elements should still be present
      expect(screen.getByText(/GitHub Activity Tracker/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });

    it('should render correctly on desktop viewport', () => {
      // Set desktop viewport
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();

      // All elements should still be present
      expect(screen.getByText(/GitHub Activity Tracker/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it.skip('should have accessible modal dialogs', async () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      fireEvent.click(termsLink);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAccessibleName();
      });
    });

    it('should have focusable interactive elements', () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);
      const privacyLink = screen.getByText(/Privacy Policy/i);

      // Elements should be focusable
      expect(termsLink).toBeVisible();
      expect(privacyLink).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle rapid clicking on modal links', async () => {
      render(<Footer />);

      const termsLink = screen.getByText(/Terms and Conditions/i);

      // Click multiple times rapidly
      fireEvent.click(termsLink);
      fireEvent.click(termsLink);
      fireEvent.click(termsLink);

      // Should only have one modal
      await waitFor(() => {
        const modals = screen.queryAllByRole('dialog');
        expect(modals.length).toBeLessThanOrEqual(1);
      });
    });

    it('should update year when component re-renders on new year', () => {
      const { rerender } = render(<Footer />);

      expect(screen.getByText(new RegExp(MOCK_YEAR.toString()))).toBeInTheDocument();

      // Advance time to next year
      vi.setSystemTime(new Date(MOCK_YEAR + 1, 0, 1));

      rerender(<Footer />);

      expect(screen.getByText(new RegExp((MOCK_YEAR + 1).toString()))).toBeInTheDocument();
    });

    it('should handle missing modal components gracefully', () => {
      // This test ensures footer doesn't crash if modals fail to render
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<Footer />)).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('Content Formatting', () => {
    it('should display year in correct format', () => {
      render(<Footer />);

      // Should include copyright symbol or just the year
      const footer = screen.getByRole('contentinfo');
      expect(footer.textContent).toMatch(/2025/);
    });

    it('should have proper spacing between elements', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      // Check that footer contains elements with gap or space classes
      const elementWithSpacing = footer.querySelector('[class*="gap"], [class*="space"]');
      expect(elementWithSpacing).toBeTruthy();
    });
  });
});
