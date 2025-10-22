"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";

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
    // Only redirect once to prevent infinite loops
    if (hasRedirected.current) return;

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      hasRedirected.current = true;
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Return null while redirecting to login
  return null;
}
