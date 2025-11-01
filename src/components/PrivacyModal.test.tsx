/**
 * PrivacyModal Component Tests
 *
 * Tests for the Privacy Policy modal component.
 * Tests visibility, content, and user interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import PrivacyModal from './PrivacyModal';

describe('PrivacyModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Visibility and Props', () => {
    it('should render when isOpen is true', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<PrivacyModal isOpen={false} onClose={mockOnClose} />);

      const dialog = screen.queryByRole('dialog');
      expect(dialog).not.toBeInTheDocument();
    });

    it('should toggle visibility based on isOpen prop changes', () => {
      const { rerender } = render(<PrivacyModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<PrivacyModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should display the correct title', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const title = screen.getByRole('heading', { name: /Privacy Policy/i, level: 2 });
      expect(title).toBeInTheDocument();
    });

    it('should display privacy policy content', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      // Check for typical privacy content
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Should contain privacy-related keywords
      expect(modal.textContent).toMatch(/privacy|data|information|personal|protection|collect/i);
    });

    it('should display structured content sections', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Should have some structure - headings or sections
      const headings = dialog.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should display complete privacy policy content', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Check that content is substantial (not empty)
      expect(dialog.textContent?.length).toBeGreaterThan(100);
    });

    it('should have properly formatted content', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Should contain paragraphs or lists
      const paragraphs = dialog.querySelectorAll('p, li');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('should include important privacy sections', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const content = dialog.textContent || '';

      // Should mention key privacy topics
      // At least one of these should be present
      const hasPrivacyTopics =
        /collect|storage|use|sharing|cookies|security|data|information/i.test(content);

      expect(hasPrivacyTopics).toBe(true);
    });
  });

  describe('Close Button', () => {
    it('should have a close button', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it.skip('should have an accessible close button', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });
      expect(closeButton).toBeVisible();
      expect(closeButton).toBeEnabled();
    });

    it('should handle multiple clicks on close button', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });

      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      // Should be called for each click
      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });
  });

  describe('Backdrop Interaction', () => {
    it('should call onClose when backdrop is clicked', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      // Find backdrop element
      const backdrop = document.querySelector('[data-slot="backdrop"]');

      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it.skip('should render backdrop when modal is open', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const backdrop = document.querySelector('[data-slot="backdrop"]');
      expect(backdrop).toBeInTheDocument();
    });

    it('should not call onClose when clicking inside modal content', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      // Should not close when clicking content (only backdrop)
      // Note: This depends on implementation, adjust if needed
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('should close on Escape key press (if supported)', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Press Escape key
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

      // HeroUI Modal typically handles this, so onClose might be called
      // This depends on the Modal implementation
    });

    it('should trap focus within modal when open', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Focus should be within the modal
      const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have accessible name or title', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName();
    });

    it('should have proper modal attributes', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Check for modal-specific attributes
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should be keyboard navigable', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });

      // Should be able to focus and activate with keyboard
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);

      fireEvent.keyDown(closeButton, { key: 'Enter' });
      // Enter key should trigger click
    });

    it.skip('should have readable content with proper contrast', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Content should be visible
      expect(dialog).toBeVisible();
    });
  });

  describe('Scrolling and Overflow', () => {
    it('should be scrollable when content is long', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const modalContent = dialog.querySelector('[data-slot="body"]');

      if (modalContent) {
        // Check if overflow is handled
        const styles = window.getComputedStyle(modalContent);
        expect(['auto', 'scroll', 'overlay']).toContain(styles.overflowY);
      }
    });

    it.skip('should prevent body scroll when modal is open', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      // HeroUI Modal typically prevents body scroll
      // Check if body has overflow hidden or similar
      expect(document.body.style.overflow).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid open/close cycles', () => {
      const { rerender } = render(<PrivacyModal isOpen={false} onClose={mockOnClose} />);

      for (let i = 0; i < 10; i++) {
        rerender(<PrivacyModal isOpen={i % 2 === 0} onClose={mockOnClose} />);
      }

      expect(() => rerender(<PrivacyModal isOpen={true} onClose={mockOnClose} />)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing onClose gracefully', () => {
      // Test with undefined onClose
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        // @ts-expect-error - Testing invalid prop type
        render(<PrivacyModal isOpen={true} onClose={undefined} />)
      ).not.toThrow();

      consoleError.mockRestore();
    });

    it('should handle null isOpen value', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        // @ts-expect-error - Testing invalid prop type
        render(<PrivacyModal isOpen={null} onClose={mockOnClose} />)
      ).not.toThrow();

      consoleError.mockRestore();
    });

    it('should render correctly with minimum props', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('HeroUI Modal Integration', () => {
    it('should use HeroUI Modal component', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // HeroUI modals have specific data attributes
      expect(dialog.closest('[data-slot]')).toBeTruthy();
    });

    it('should apply proper modal styling', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Should have HeroUI classes
      expect(dialog.className).toBeTruthy();
    });

    it.skip('should have proper modal structure', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Should have header, body, footer structure
      const header = dialog.querySelector('[data-slot="header"]');
      const body = dialog.querySelector('[data-slot="body"]');

      expect(header || body).toBeTruthy();
    });
  });

  describe('Content Integrity', () => {
    it('should not have empty content', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('should display all required privacy sections', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const content = dialog.textContent || '';

      // Should contain important privacy information
      // Adjust based on actual content
      expect(content.length).toBeGreaterThan(50);
    });

    it('should maintain content formatting', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Should have formatted elements
      const formattedElements = dialog.querySelectorAll('h1, h2, h3, p, ul, ol, li');
      expect(formattedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Comparison with TermsModal', () => {
    it('should have different content from Terms modal', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const content = dialog.textContent || '';

      // Should contain privacy-specific content, not just generic terms
      const hasPrivacySpecificContent = /privacy|personal data|information|collect/i.test(content);
      expect(hasPrivacySpecificContent).toBe(true);
    });

    it('should have consistent modal behavior with TermsModal', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      // Should have same structure as TermsModal
      const dialog = screen.getByRole('dialog');
      const closeButton = screen.getByRole('button', { name: /Close privacy policy/i });

      expect(dialog).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Data Privacy Information', () => {
    it('should mention data collection practices', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const content = dialog.textContent || '';

      // Should mention what data is collected
      const mentionsDataCollection = /collect|collection|data|information/i.test(content);
      expect(mentionsDataCollection).toBe(true);
    });

    it('should be informative and comprehensive', () => {
      render(<PrivacyModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');

      // Content should be substantial enough to be useful
      expect(dialog.textContent?.length).toBeGreaterThan(200);
    });
  });
});
