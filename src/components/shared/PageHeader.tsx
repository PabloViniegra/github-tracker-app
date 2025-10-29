/**
 * PageHeader Component
 * Shared header component for all main pages
 */

"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  username?: string;
  showBackButton?: boolean;
  backHref?: string;
  onLogout: () => void;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "6xl" | "7xl";
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const PageHeader = React.memo(function PageHeader({
  title,
  subtitle,
  username,
  showBackButton = false,
  backHref = "/",
  onLogout,
  actions,
  maxWidth = "6xl",
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80"
    >
      <div className={`${MAX_WIDTH_CLASSES[maxWidth]} mx-auto px-6 py-4`}>
        <div className="flex items-center justify-between">
          {/* Left: Title and optional back button */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={backHref}>
                  <Button
                    variant="light"
                    size="sm"
                    startContent={<ArrowLeft className="w-4 h-4" />}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </Button>
                </Link>
              </motion.div>
            )}

            <div>
              <h1 className="text-xl font-semibold tracking-tight font-sans text-shiny cursor-default">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-serif mt-0.5">
                  {subtitle}
                </p>
              )}
              {username && (
                <p className="text-xs font-mono mt-0.5 text-shiny cursor-default">
                  @{username}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions and logout */}
          <div className="flex items-center gap-3">
            {actions}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="light"
                size="sm"
                className="text-muted-foreground text-sm hover:text-foreground"
                onPress={onLogout}
                startContent={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

export default PageHeader;
