/**
 * EventCard Component
 * Individual event card in the timeline
 */

"use client";

import { memo } from "react";
import { Card, CardBody, Avatar } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { GitHubEvent } from "@/types/github";
import {
  getEventTitle,
  getEventDescription,
  getEventUrl,
  formatEventDate,
  getEventColor,
} from "@/lib/events/event-utils";
import EventIcon from "./EventIcon";
import EventDetails from "./EventDetails";
import { motion } from "framer-motion";

interface EventCardProps {
  event: GitHubEvent;
  index: number;
}

/**
 * EventCard Component (Memoized)
 *
 * Displays a single GitHub event with icon, title, description, and details.
 * Includes hover effects and animations.
 * Memoized to prevent unnecessary re-renders.
 *
 * Usage:
 * ```tsx
 * <EventCard event={event} index={0} />
 * ```
 */
const EventCard = memo(function EventCard({ event, index }: EventCardProps) {
  const title = getEventTitle(event);
  const description = getEventDescription(event);
  const url = getEventUrl(event);
  const color = getEventColor(event.type);
  const formattedDate = formatEventDate(event.created_at);
  const repoName = event.repo.name;

  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        // Limit stagger to first 10 items to prevent performance issues
        delay: index < 10 ? index * 0.03 : 0
      }}
      className="relative"
    >
      {/* Timeline connector dot */}
      <div
        className="absolute left-0 top-6 w-3 h-3 rounded-full border-2 border-background z-10"
        style={{ backgroundColor: color }}
      />

      {/* Card */}
      <div className="ml-8 pl-6 relative">
        {/* Timeline vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

        <Card
          isPressable={!!url}
          onPress={handleClick}
          className="border border-border bg-card shadow-sm hover:bg-accent hover:border-foreground transition-all group"
        >
          <CardBody className="p-5">
            <div className="flex items-start gap-4">
              {/* Event Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <EventIcon event={event} size={20} />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-foreground font-sans line-clamp-1 group-hover:text-foreground transition-colors">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-sm text-muted-foreground font-serif mt-1 line-clamp-2">
                        {description}
                      </p>
                    )}
                  </div>

                  {url && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  )}
                </div>

                {/* Event Details */}
                <EventDetails event={event} />

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <Avatar
                      src={event.actor.avatar_url}
                      alt={event.actor.login}
                      className="w-5 h-5"
                    />
                    <span className="text-xs text-muted-foreground font-sans">
                      <span className="font-medium text-foreground">
                        {event.actor.login}
                      </span>
                      {" in "}
                      <span className="font-mono">{repoName}</span>
                    </span>
                  </div>

                  {/* Timestamp */}
                  <time
                    dateTime={event.created_at}
                    className="text-xs text-muted-foreground font-mono flex-shrink-0"
                  >
                    {formattedDate}
                  </time>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
});

export default EventCard;
