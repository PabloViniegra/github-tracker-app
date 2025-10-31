"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@heroui/react";
import { tokenStorage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

/**
 * OAuth Callback Handler Page
 *
 * This page handles the redirect after GitHub OAuth completes.
 *
 * Secure Flow:
 * 1. Backend redirects to /api/auth/callback with tokens in URL
 * 2. API route stores tokens in httpOnly cookies (not in browser history)
 * 3. API route redirects here to /callback (clean URL, no tokens)
 * 4. This page fetches tokens from cookies via /api/auth/tokens
 * 5. Tokens are moved to localStorage for API calls
 *
 * This prevents tokens from being exposed in browser history.
 *
 * Usage: This page is automatically accessed after OAuth flow completes
 */
export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasProcessed = useRef(false);

  // Confetti celebration on successful login
  useEffect(() => {
    if (status === "success") {
      // Fire confetti from multiple positions
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Fire from left side
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
        });

        // Fire from right side
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // Check for error in URL
    const error = searchParams.get("error");

    if (error) {
      // OAuth flow failed
      setStatus("error");
      setErrorMessage(decodeURIComponent(error));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    // Fetch tokens from secure httpOnly cookies (via API route)
    const fetchTokens = async () => {
      try {
        const response = await fetch("/api/auth/tokens");

        if (!response.ok) {
          throw new Error("Failed to retrieve tokens");
        }

        const data = await response.json();

        if (data.access_token && data.refresh_token) {
          // Store tokens in localStorage
          tokenStorage.setTokens(data.access_token, data.refresh_token);
          setStatus("success");

          // Refresh user profile in AuthContext to sync state
          await refreshUser();

          // Redirect to dashboard after successful login
          setTimeout(() => {
            router.push("/");
          }, 500);
        } else {
          throw new Error("Invalid token response");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage(
          "Authentication failed. Could not retrieve tokens."
        );

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    fetchTokens();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="border border-border bg-card shadow-sm max-w-md mx-auto">
        <CardBody className="p-10">
          <div className="flex flex-col items-center gap-6">
            {status === "loading" && (
              <>
                <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground font-sans">
                    Setting up your account
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans">
                    Loading your profile...
                  </p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground font-sans">
                    Success
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans">
                    Redirecting to dashboard...
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-12 h-12 rounded-full border-2 border-destructive flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground font-sans">
                    Authentication Failed
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 font-sans">
                    {errorMessage || "Something went wrong during login"}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    Redirecting to login page...
                  </p>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
