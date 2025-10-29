/**
 * EventsErrorBoundary Component
 * Catches and handles errors in events components
 */

"use client";

import React from "react";
import { Button } from "@heroui/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class EventsErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Events Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-card border border-red-500/20 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground font-sans mb-2">
                Something went wrong
              </h2>

              <p className="text-sm text-muted-foreground font-sans mb-4">
                An error occurred while loading the activity timeline. Please try refreshing the page.
              </p>

              {this.state.error && (
                <details className="text-left mb-4">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-mono">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs bg-accent/5 p-3 rounded overflow-auto max-h-40 font-mono text-red-400">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <Button
                color="primary"
                variant="flat"
                onPress={this.handleReset}
                startContent={<RefreshCw className="w-4 h-4" />}
              >
                Reload Timeline
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EventsErrorBoundary;
