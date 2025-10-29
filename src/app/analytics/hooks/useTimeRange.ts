/**
 * useTimeRange Hook
 * Manage time range state for analytics filtering
 */

import { useState, useCallback } from 'react';
import { TimeRange } from '../types/analytics';
import { calculateTimeRange } from '../utils/processAnalyticsData';

export function useTimeRange(initialPreset: TimeRange['preset'] = '30d') {
  const [timeRange, setTimeRange] = useState<TimeRange>(() =>
    calculateTimeRange(initialPreset)
  );

  const setPreset = useCallback((preset: TimeRange['preset']) => {
    setTimeRange(calculateTimeRange(preset));
  }, []);

  return {
    timeRange,
    preset: timeRange.preset,
    setPreset,
  };
}
