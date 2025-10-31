"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { githubApi, GitHubUserDetails } from "@/lib/api";
import PageHeader from "./shared/PageHeader";
import {
  Card,
  CardBody,
  Avatar,
} from "@heroui/react";
import {
  Github,
  Calendar,
  BarChart3,
  MapPin,
  Building2,
  Link as LinkIcon,
  Users,
  GitFork,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Dashboard Component
 *
 * Main dashboard view shown to authenticated users.
 *
 * Features:
 * - Displays user profile information
 * - Shows GitHub username, avatar, and account details
 * - Provides logout functionality
 * - Displays webhook configuration status
 *
 * Usage:
 * ```tsx
 * <Dashboard />
 * ```
 */
export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const [githubDetails, setGithubDetails] = useState<GitHubUserDetails | null>(
    null,
  );

  // Fetch GitHub details when user is available
  useEffect(() => {
    if (user?.username) {
      githubApi
        .getUserDetails(user.username)
        .then((details) => {
          setGithubDetails(details);
        })
        .catch((error) => {
          console.error("Failed to fetch GitHub details:", error);
        });
    }
  }, [user?.username]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title="GitHub Activity Tracker"
        username={user?.username}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <Card className="border border-border bg-card shadow-sm mb-8">
            <CardBody className="p-8">
              <div className="flex items-start gap-6">
                <Avatar
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-20 h-20 border-2 border-border"
                />

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-1 text-foreground font-sans">
                    {user.name || user.username}
                  </h2>

                  <a
                    href={user.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 font-mono mb-3"
                  >
                    <Github className="w-3.5 h-3.5" />@{user.username}
                  </a>

                  {/* Bio */}
                  {githubDetails?.bio && (
                    <p className="text-sm text-foreground mt-3 font-sans">
                      {githubDetails.bio}
                    </p>
                  )}

                  {/* GitHub Info - Location, Company, Blog */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    {githubDetails?.location && (
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5 font-sans">
                        <MapPin className="w-4 h-4" />
                        {githubDetails.location}
                      </span>
                    )}
                    {githubDetails?.company && (
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5 font-sans">
                        <Building2 className="w-4 h-4" />
                        {githubDetails.company}
                      </span>
                    )}
                    {githubDetails?.blog && (
                      <a
                        href={
                          githubDetails.blog.startsWith("http")
                            ? githubDetails.blog
                            : `https://${githubDetails.blog}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-sans transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {githubDetails.blog}
                      </a>
                    )}
                  </div>

                  {/* GitHub Statistics */}
                  {githubDetails && (
                    <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                      <div className="inline-flex items-center gap-2">
                        <GitFork className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-sans">
                          <span className="font-semibold text-foreground">
                            {githubDetails.public_repos}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            repositories
                          </span>
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-sans">
                          <span className="font-semibold text-foreground">
                            {githubDetails.followers}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            followers
                          </span>
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <span className="text-sm font-sans">
                          <span className="font-semibold text-foreground">
                            {githubDetails.following}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            following
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
                    {githubDetails?.created_at && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                          GitHub Member Since
                        </p>
                        <p className="text-sm font-mono text-foreground">
                          {new Date(
                            githubDetails.created_at,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    )}

                    {user.email && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                          Email
                        </p>
                        <p className="text-sm font-mono text-foreground">
                          {user.email}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                        GitHub ID
                      </p>
                      <p className="text-sm font-mono text-foreground">
                        {user.github_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                        App Registered
                      </p>
                      <p className="text-sm font-mono text-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                        Webhook Status
                      </p>
                      <span className="text-sm inline-flex items-center gap-1.5 text-foreground font-sans">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.webhook_configured
                              ? "bg-foreground"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {user.webhook_configured ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/repositories">
              <button className="group border border-border bg-card hover:bg-accent hover:border-foreground transition-all p-6 rounded-lg text-left w-full h-full">
                <div className="flex items-start gap-3">
                  <Github className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div>
                    <h3 className="font-medium mb-1 text-foreground font-sans">
                      Repositories
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      View repositories
                    </p>
                  </div>
                </div>
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/events">
              <button className="group border border-border bg-card hover:bg-accent hover:border-foreground transition-all p-6 rounded-lg text-left w-full h-full">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div>
                    <h3 className="font-medium mb-1 text-foreground font-sans">
                      Activity
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      Track GitHub events
                    </p>
                  </div>
                </div>
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/analytics">
              <button className="group border border-border bg-card hover:bg-accent hover:border-foreground transition-all p-6 rounded-lg text-left w-full h-full">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div>
                    <h3 className="font-medium mb-1 text-foreground font-sans">
                      Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      View insights
                    </p>
                  </div>
                </div>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
