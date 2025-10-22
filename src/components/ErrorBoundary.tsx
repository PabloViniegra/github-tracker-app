"use client";

import { Component, ReactNode } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (could also send to error reporting service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <Card className="border border-border bg-card shadow-sm max-w-md mx-auto">
            <CardBody className="p-10">
              <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 rounded-full border-2 border-destructive flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground font-sans">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 font-sans">
                    {this.state.error?.message ||
                      "An unexpected error occurred"}
                  </p>

                  {process.env.NODE_ENV === "development" && (
                    <details className="mt-4 text-left">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground font-mono">
                        Error details
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-40 font-mono">
                        {this.state.error?.stack}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="bordered"
                    size="sm"
                    onClick={this.handleReset}
                    startContent={<RefreshCw className="w-4 h-4" />}
                    className="border-border text-foreground hover:bg-accent"
                  >
                    Try again
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => (window.location.href = "/")}
                    className="text-muted-foreground hover:text-foreground"
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

    return this.props.children;
  }
}
