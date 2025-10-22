"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, Spacer, Spinner } from "@heroui/react";
import { authApi, tokenStorage, isTokenResponse, isGitHubLoginResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Bell, BarChart3, Webhook, AlertCircle } from "lucide-react";

/**
 * Login Page Component
 *
 * Implements GitHub OAuth login flow:
 * 1. User clicks "Sign in with GitHub" button
 * 2. Fetch authorization URL from backend API
 * 3. Redirect user to GitHub OAuth page
 * 4. GitHub redirects back to backend callback
 * 5. Backend handles callback and stores tokens
 *
 * Usage: Navigate to /login to access this page
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Check if user is already logged in - ONLY ONCE on mount
  useEffect(() => {
    // Only check once to prevent infinite loops
    if (hasCheckedAuth.current) return;

    // Wait for auth to finish loading before checking
    if (authLoading) return;

    if (isAuthenticated) {
      // Set redirecting state to show loading UI
      setIsRedirecting(true);
      // Redirect to dashboard if already logged in
      router.push("/");
    }

    // Mark as checked (persists across re-renders)
    hasCheckedAuth.current = true;
  }, [isAuthenticated, authLoading, router]);

  /**
   * Handle GitHub OAuth login
   * Backend can return either:
   * 1. authorization_url (needs OAuth flow)
   * 2. tokens directly (already authorized)
   */
  const handleGitHubLogin = async (e?: React.MouseEvent) => {
    // Prevent any default behavior
    e?.preventDefault();
    e?.stopPropagation();

    console.log("[Login] Button clicked, starting login flow");

    setIsLoading(true);
    setError(null);

    try {
      console.log("[Login] Calling authApi.initiateLogin()");
      const response = await authApi.initiateLogin();

      // Case 1: Backend returned tokens directly (user already authorized)
      if (isTokenResponse(response)) {
        console.log("[Login] User already authorized, received tokens");

        // Store tokens
        tokenStorage.setTokens(response.access_token, response.refresh_token);

        // Redirect to dashboard
        router.push("/");
        return;
      }

      // Case 2: Backend returned OAuth URL (first time login)
      if (isGitHubLoginResponse(response)) {
        console.log("[Login] Redirecting to GitHub OAuth");

        // Store state token for validation
        if (typeof window !== "undefined" && response.state) {
          sessionStorage.setItem("oauth_state", response.state);
        }

        // Redirect to GitHub OAuth page
        window.location.href = response.authorization_url;
        return;
      }

      // Unknown response format
      throw new Error("Unexpected response format from backend");

    } catch (err) {
      setIsLoading(false);

      // Enhanced error message
      let errorMessage = "Failed to connect to the backend API. ";

      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage += "Please ensure the backend is running on http://localhost:8000";
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage += "Please try again.";
      }

      setError(errorMessage);
      console.error("Login error:", err);
    }
  };

  // Show loading state while checking auth or redirecting
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="border border-border bg-card shadow-sm max-w-md mx-auto">
          <CardBody className="p-10">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin" />
              <p className="text-muted-foreground font-sans">
                {isRedirecting ? "Already logged in. Redirecting..." : "Checking authentication..."}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground font-sans">
            GitHub Activity Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto font-sans">
            Monitor your GitHub activity in real-time
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardBody className="p-12">
            <div className="flex flex-col items-center">
              {/* GitHub Icon */}
              <div className="flex justify-center mb-6">
                <Github className="w-12 h-12 text-foreground" />
              </div>

              {/* Login Button or Loading State */}
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground font-sans">
                    Connecting to GitHub...
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-muted-foreground transition-colors font-medium"
                    onClick={handleGitHubLogin}
                  >
                    Sign in with GitHub
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-6 font-sans">
                    Secure authentication via GitHub OAuth
                  </p>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 w-full">
                  <Card className="border border-destructive/50 bg-card">
                    <CardBody className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-semibold text-sm font-sans">
                            Login Error
                          </p>
                          <p className="text-muted-foreground text-sm font-sans mt-1">
                            {error}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Simplified Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-sans">
            Track repositories, webhooks, and GitHub events
          </p>
        </div>
      </div>
    </div>
  );
}
