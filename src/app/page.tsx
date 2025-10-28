"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import { Card, CardBody } from "@heroui/react";

/**
 * Home Page (Root Route)
 *
 * Authentication Logic:
 * - If user is authenticated → Show Dashboard
 * - If user is not authenticated → Redirect to /login
 * - While loading → Show loading spinner
 *
 * This is the protected main page of the application
 */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Only redirect once to prevent infinite loops
    if (hasRedirected.current) return;

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      hasRedirected.current = true;

      // Only navigate if still mounted
      if (isMounted) {
        router.push("/login");
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        {/* Skip link for keyboard navigation - WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-2 focus:outline-primary"
        >
          Saltar al contenido principal
        </a>
        <div
          id="main-content"
          className="min-h-screen bg-background relative overflow-hidden"
          role="status"
          aria-busy="true"
          aria-label="Cargando dashboard"
        >
        {/* Screen reader text */}
        <span className="sr-only">Cargando información del usuario...</span>

        {/* Animated gradient background - optimized for performance */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: '4s', willChange: 'opacity' }}
          />
          <div
            className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '1s', willChange: 'opacity' }}
          />
        </div>

        {/* Header with shimmer effect */}
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="relative overflow-hidden rounded-lg bg-default-200/50 h-7 w-56">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-lg bg-default-200/50 h-9 w-24">
              <div
                className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
          {/* Profile Card with enhanced animations */}
          <Card className="border border-border bg-card/80 backdrop-blur-sm mb-8 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardBody className="p-8 relative">
              <div className="flex items-start gap-6">
                {/* Avatar skeleton with pulse */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-default-300/50 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Name skeleton */}
                  <div className="relative overflow-hidden rounded-lg bg-default-300/50 h-8 w-2/5">
                    <div
                      className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>

                  {/* Username skeleton */}
                  <div className="relative overflow-hidden rounded-lg bg-default-200/50 h-4 w-1/4">
                    <div
                      className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>

                  {/* Bio lines with staggered animation */}
                  <div className="space-y-2 mt-3">
                    {[0.6, 0.8].map((delay, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg bg-default-200/50 h-4"
                        style={{ width: idx === 0 ? '80%' : '60%' }}
                      >
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Tags with wave animation */}
                  <div className="flex gap-4 mt-3">
                    {[0.7, 0.9, 1.1].map((delay, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg bg-default-200/50 h-4"
                        style={{
                          width: idx === 0 ? '6rem' : idx === 1 ? '8rem' : '7rem',
                          animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                          animationDelay: `${delay}s`
                        }}
                      >
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Stats section with border */}
                  <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
                    {[1.2, 1.4, 1.6].map((delay, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg bg-default-200/50 h-5"
                        style={{ width: idx === 0 ? '8rem' : '7rem' }}
                      >
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Additional info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/50">
                    {[1.8, 2.0, 2.2, 2.4, 2.6].map((delay, i) => (
                      <div key={i} className="space-y-2">
                        <div className="relative overflow-hidden rounded-lg bg-default-200/50 h-3 w-24">
                          <div
                            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            style={{ animationDelay: `${delay}s` }}
                          />
                        </div>
                        <div className="relative overflow-hidden rounded-lg bg-default-300/50 h-4 w-32">
                          <div
                            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            style={{ animationDelay: `${delay + 0.1}s` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats cards with parallax effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Card
                key={i}
                className="border border-border bg-card/80 backdrop-blur-sm overflow-hidden relative group hover:border-primary/50 transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardBody className="p-6 relative">
                  <div className="flex items-start gap-3">
                    {/* Icon skeleton with glow */}
                    <div className="relative">
                      <div className="w-5 h-5 rounded-lg bg-default-300/50 relative overflow-hidden">
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      </div>
                      <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-50 animate-pulse" />
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Title skeleton */}
                      <div className="relative overflow-hidden rounded-lg bg-default-300/50 h-5 w-3/4">
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                        />
                      </div>
                      {/* Description skeleton */}
                      <div className="relative overflow-hidden rounded-lg bg-default-200/50 h-4 w-full">
                        <div
                          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{ animationDelay: `${i * 0.2 + 0.2}s` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          /* Respect user's motion preferences */
          @media (prefers-reduced-motion: reduce) {
            .animate-shimmer,
            .animate-pulse,
            .animate-ping {
              animation: none !important;
            }

            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
      </>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return null;
}
