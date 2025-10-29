"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { authApi, tokenStorage, isTokenResponse, isGitHubLoginResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Bell, BarChart3, Webhook, AlertCircle, GitBranch, Star, GitPullRequest } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Animation variants defined outside component for performance
const FLOATING_VARIANTS = {
  initial: { y: 0 },
  animate: (custom: number) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: custom * 0.2
    }
  })
};

// Feature cards data
const FEATURES = [
  { icon: BarChart3, label: "Analytics", delay: 0 },
  { icon: Bell, label: "Notifications", delay: 1 },
  { icon: Webhook, label: "Webhooks", delay: 2 },
  { icon: GitBranch, label: "Repo Tracking", delay: 3 },
] as const;

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
  const shouldReduceMotion = useReducedMotion();
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is already logged in - ONLY ONCE on mount
  useEffect(() => {
    // Only check once to prevent infinite loops
    if (hasCheckedAuth.current) return;

    // Wait for auth to finish loading before checking
    if (authLoading) return;

    // Mark as checked BEFORE checking isAuthenticated to prevent race condition
    hasCheckedAuth.current = true;

    if (isAuthenticated) {
      // Set redirecting state to show loading UI
      setIsRedirecting(true);
      // Redirect to dashboard if already logged in
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle GitHub OAuth login
   * Backend can return either:
   * 1. authorization_url (needs OAuth flow)
   * 2. tokens directly (already authorized)
   */
  const handleGitHubLogin = async () => {
    console.log("[Login] Button clicked, starting login flow");

    setIsLoading(true);
    setError(null);

    // Set timeout for request (30 seconds)
    requestTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setError("Request timed out. Please check your connection and try again.");
    }, 30000);

    try {
      console.log("[Login] Calling authApi.initiateLogin()");
      const response = await authApi.initiateLogin();

      // Clear timeout on successful response
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }

      // Case 1: Backend returned tokens directly (user already authorized)
      if (isTokenResponse(response)) {
        console.log("[Login] User already authorized, received tokens");

        // Store tokens
        tokenStorage.setTokens(response.access_token, response.refresh_token || "");

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
      // Clear timeout on error
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }

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
      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 1 }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-border bg-card/80 backdrop-blur-xl shadow-2xl max-w-md mx-auto">
            <CardBody className="p-12">
              <div className="flex flex-col items-center gap-6">
                {/* Custom spinner with pulse effect */}
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-muted border-t-foreground rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-16 h-16 border-4 border-foreground/20 rounded-full"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground font-sans text-center"
                  role="status"
                  aria-live="polite"
                >
                  {isRedirecting ? "Already logged in. Redirecting..." : "Checking authentication..."}
                </motion.p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Skip link for keyboard navigation - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-2 focus:outline-primary"
      >
        Saltar al contenido principal
      </a>
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden" role="main">
      {/* Animated gradient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Logo/Icon with glow effect */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="relative">
                  <div className="relative p-4 bg-card border border-border rounded-2xl shadow-lg">
                    {/* Animated glow layer using opacity (GPU-accelerated) */}
                    {!shouldReduceMotion && (
                      <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-foreground/10 blur-md -z-10"
                      />
                    )}
                    <Github className="w-12 h-12 text-foreground" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 text-foreground font-sans">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-block"
                >
                  GitHub
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="inline-block bg-linear-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent"
                >
                  Activity Tracker
                </motion.span>
              </h1>

              <h2 className="sr-only">Monitor your GitHub projects and receive real-time notifications</h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xl text-muted-foreground max-w-md font-sans leading-relaxed"
              >
                Monitor your GitHub activity, repositories, and webhooks in real-time with powerful analytics and notifications.
              </motion.p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.label}
                  custom={feature.delay}
                  initial="initial"
                  animate="animate"
                  variants={shouldReduceMotion ? undefined : FLOATING_VARIANTS}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "var(--shadow-lg)",
                  }}
                  className="p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl transition-all"
                  role="presentation"
                >
                  <feature.icon className="w-6 h-6 text-muted-foreground mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground font-sans">
                    {feature.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Login Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                {/* Gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"
                />

                <CardBody className="p-10 relative z-10">
                  <div className="flex flex-col items-center">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />

                    {/* GitHub Icon with animated ring */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.4
                      }}
                      className="relative mb-8"
                    >
                      {!shouldReduceMotion && (
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.1, 0.3]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 w-24 h-24 -m-6 border-2 border-foreground rounded-full"
                        />
                      )}
                      <div className="relative p-6 bg-card border-2 border-border rounded-2xl">
                        <Github className="w-12 h-12 text-foreground" aria-hidden="true" />
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold text-foreground mb-2 font-sans"
                    >
                      Welcome Back
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm text-muted-foreground mb-8 text-center font-sans"
                    >
                      Sign in with your GitHub account to continue
                    </motion.p>

                    {/* Login Button or Loading State */}
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center gap-4 w-full"
                        >
                          <div className="relative">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-16 h-16 border-4 border-muted border-t-foreground rounded-full"
                            />
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.2, 0.5]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 w-16 h-16 border-4 border-foreground/20 rounded-full"
                            />
                          </div>
                          <motion.p
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-sm text-muted-foreground font-sans"
                            role="status"
                            aria-live="polite"
                          >
                            Connecting to GitHub...
                          </motion.p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="w-full space-y-6"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              size="lg"
                              className="w-full bg-foreground text-background hover:bg-muted-foreground transition-all duration-300 font-semibold text-base py-6 relative overflow-hidden group"
                              onPress={handleGitHubLogin}
                            >
                              {/* Button shine effect */}
                              <motion.div
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "200%" }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-1/2 h-full bg-linearto-r from-transparent via-white/20 to-transparent skew-x-12"
                              />
                              <span className="flex items-center justify-center gap-2 relative z-10">
                                <Github className="w-5 h-5" aria-hidden="true" />
                                Sign in with GitHub
                              </span>
                            </Button>
                          </motion.div>

                          <div className="space-y-3">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
                            >
                              <div className="w-8 h-px bg-border" />
                              <span className="font-sans">Secure OAuth 2.0</span>
                              <div className="w-8 h-px bg-border" />
                            </motion.div>

                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              className="text-xs text-muted-foreground text-center font-sans leading-relaxed"
                            >
                              By signing in, you agree to access your GitHub profile and repository information
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mt-6 w-full"
                        >
                          <Card className="border border-destructive/50 bg-destructive/5 backdrop-blur-sm overflow-hidden relative">
                            {/* Animated error background pulse */}
                            {!shouldReduceMotion && (
                              <motion.div
                                animate={{
                                  opacity: [0.1, 0.2, 0.1],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-destructive/10"
                              />
                            )}
                            <CardBody className="p-4 relative z-10">
                              <div className="flex items-start gap-3">
                                <motion.div
                                  animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 0.5, repeat: 2 }}
                                >
                                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                                </motion.div>
                                <div>
                                  <p className="text-foreground font-semibold text-sm font-sans mb-1">
                                    Login Error
                                  </p>
                                  <p className="text-muted-foreground text-xs font-sans leading-relaxed">
                                    {error}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    className="mt-3 text-xs"
                                    onPress={handleGitHubLogin}
                                  >
                                    Try Again
                                  </Button>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Additional info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-muted-foreground font-sans flex items-center justify-center gap-2">
                <Star className="w-3 h-3" aria-hidden="true" />
                Trusted by developers worldwide
                <Star className="w-3 h-3" aria-hidden="true" />
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom decorative footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 text-xs text-muted-foreground font-sans">
            <motion.div
              whileHover={{ scale: 1.1, color: "var(--color-foreground)" }}
              className="flex items-center gap-2 cursor-default transition-colors"
            >
              <GitBranch className="w-4 h-4" aria-hidden="true" />
              <span>Track repositories</span>
            </motion.div>
            <div className="w-px h-4 bg-border" />
            <motion.div
              whileHover={{ scale: 1.1, color: "var(--color-foreground)" }}
              className="flex items-center gap-2 cursor-default transition-colors"
            >
              <Webhook className="w-4 h-4" aria-hidden="true" />
              <span>Real-time webhooks</span>
            </motion.div>
            <div className="w-px h-4 bg-border" />
            <motion.div
              whileHover={{ scale: 1.1, color: "var(--color-foreground)" }}
              className="flex items-center gap-2 cursor-default transition-colors"
            >
              <GitPullRequest className="w-4 h-4" aria-hidden="true" />
              <span>Activity monitoring</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
    </>
  );
}
