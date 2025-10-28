"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScrollToTop Component
 *
 * A floating button that appears when scrolling down and scrolls to top on click.
 *
 * Features:
 * - Shows after scrolling 300px down
 * - Smooth scroll animation to top
 * - Positioned at bottom-right
 * - Animated entrance/exit
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    /**
     * Toggle button visibility based on scroll position
     */
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen to scroll events
    window.addEventListener("scroll", toggleVisibility);

    // Clean up
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  /**
   * Scroll to top with smooth animation
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            isIconOnly
            variant="shadow"
            color="primary"
            onPress={scrollToTop}
            className="w-12 h-12 shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
