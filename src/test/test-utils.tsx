/**
 * Test Utilities
 * Custom render function and helpers for testing React components
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Custom render function that wraps components with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Set to false to skip wrapping with providers
   */
  withProviders?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { withProviders = true, ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    if (!withProviders) {
      return <>{children}</>;
    }

    return (
      <HeroUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
