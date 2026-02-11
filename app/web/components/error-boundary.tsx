"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI. If not provided, uses the default error card. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Phase 8.1 (M8/FR-013): Global error boundary to prevent white-screen crashes.
 *
 * Catches unhandled React rendering errors and displays a fallback UI
 * with retry/reload options instead of a blank page.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development, could send to monitoring in production
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="mx-auto max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-center">
            <div className="mb-4 text-4xl">&#x26A0;</div>
            <h2 className="mb-2 text-xl font-semibold text-zinc-100">
              Something went wrong
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              An unexpected error occurred. You can try again or reload the page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mb-4 max-h-32 overflow-auto rounded bg-zinc-800 p-3 text-left text-xs text-red-400">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={this.handleRetry}>
                Try Again
              </Button>
              <Button onClick={this.handleReload}>Reload Page</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
