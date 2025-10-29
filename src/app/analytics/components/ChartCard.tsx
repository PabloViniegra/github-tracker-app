/**
 * ChartCard Component
 * Reusable wrapper for analytics charts
 */

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const ChartCard = React.memo(function ChartCard({
  title,
  description,
  children,
  actions,
  fullWidth = false,
  className = '',
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.005, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
      className={`${fullWidth ? 'col-span-full' : ''} ${className}`}
    >
      <Card className="border border-border bg-card shadow-sm h-full overflow-hidden">
        <CardBody className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-start justify-between mb-4"
          >
            <div>
              <h3 className="text-xl font-semibold text-foreground font-sans">
                {title}
              </h3>
              {description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-sm text-muted-foreground font-serif mt-1"
                >
                  {description}
                </motion.p>
              )}
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </motion.div>

          {/* Divider */}
          {(title || description) && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="border-t border-border mb-4 origin-left"
            />
          )}

          {/* Chart Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
});

export default ChartCard;
