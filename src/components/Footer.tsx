"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

/**
 * Footer Component
 *
 * Professional footer with links to Terms and Privacy modals.
 * Displays current year dynamically and app name.
 *
 * Features:
 * - Responsive design (mobile-first)
 * - Dark mode optimized
 * - Modal state management
 * - HeroUI Link components with proper ARIA labels
 *
 * Usage:
 * ```tsx
 * <Footer />
 * ```
 */
export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        className="w-full border-t border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            {/* Copyright and App Name */}
            <div className="text-center text-sm text-default-500 md:text-left">
              <p>
                © {currentYear}{" "}
                <span className="font-semibold text-default-700">
                  GitHub Activity Tracker
                </span>
                . All rights reserved.
              </p>
            </div>

            {/* Links Section */}
            <nav
              className="flex flex-wrap items-center justify-center gap-4 text-sm"
              aria-label="Legal links"
            >
              <Link
                as="button"
                color="foreground"
                className="cursor-pointer text-default-500 transition-colors hover:text-default-700"
                onPress={() => setIsTermsOpen(true)}
                aria-label="Open terms and conditions"
              >
                Terms and Conditions
              </Link>

              <span className="text-default-400" aria-hidden="true">
                •
              </span>

              <Link
                as="button"
                color="foreground"
                className="cursor-pointer text-default-500 transition-colors hover:text-default-700"
                onPress={() => setIsPrivacyOpen(true)}
                aria-label="Open privacy policy"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Additional Info - Optional */}
          <div className="mt-4 text-center text-xs text-default-400">
            <p>
              Built for developers seeking complete visibility of their GitHub workflow
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}
