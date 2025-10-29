"use client";

import { useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

/**
 * Next.js Error Boundary
 *
 * Automatically catches errors in the app directory routes
 * and displays this error UI.
 *
 * This file must be a Client Component.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error("[Next.js Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="border border-border bg-card shadow-sm max-w-md mx-auto">
        <CardBody className="p-10">
          <div className="flex flex-col items-center gap-6">
            {/* Error Icon */}
            <div className="w-12 h-12 rounded-full border-2 border-destructive flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-foreground font-sans">
                Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground mb-4 font-sans">
                {error.message || "An unexpected error occurred"}
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground font-mono transition-colors">
                    Show error details
                  </summary>
                  <div className="mt-2 space-y-2">
                    {error.digest && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Error ID: {error.digest}
                      </p>
                    )}
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40 font-mono text-foreground">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="bordered"
                size="sm"
                onPress={reset}
                startContent={<RefreshCw className="w-4 h-4" />}
                className="border-border text-foreground hover:bg-accent transition-colors"
              >
                Try again
              </Button>
              <Button
                variant="light"
                size="sm"
                onPress={() => (window.location.href = "/")}
                startContent={<Home className="w-4 h-4" />}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Go home
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
