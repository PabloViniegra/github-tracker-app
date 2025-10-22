"use client";

import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Providers Component
 *
 * Wraps the application with all necessary providers and error boundaries.
 *
 * Provider hierarchy:
 * 1. ErrorBoundary - Catches runtime errors
 * 2. HeroUIProvider - UI component theme
 * 3. AuthProvider - Authentication state
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <HeroUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}
