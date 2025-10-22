"use client";

import { useEffect } from "react";

/**
 * Global Error Boundary
 *
 * Catches errors in the root layout.
 * This must replace the entire root layout when an error occurs.
 *
 * Note: This file must define its own <html> and <body> tags.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error
    console.error("[Global Error Boundary - Critical]:", error);
  }, [error]);

  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Application Error
            </h1>
            <p className="text-muted-foreground mb-6">
              A critical error occurred. Please try refreshing the page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 text-left bg-muted p-4 rounded">
                <p className="text-xs text-muted-foreground mb-2 font-mono">
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-foreground text-background rounded hover:bg-muted-foreground transition-colors font-sans text-sm"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 border border-border text-foreground rounded hover:bg-accent transition-colors font-sans text-sm"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
