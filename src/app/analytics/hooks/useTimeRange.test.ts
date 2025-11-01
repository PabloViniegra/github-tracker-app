/**
 * Tests for useTimeRange Hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeRange } from './useTimeRange';

describe('useTimeRange', () => {
  it('should initialize with default preset (30d)', () => {
    const { result } = renderHook(() => useTimeRange());

    expect(result.current.preset).toBe('30d');
    expect(result.current.timeRange.preset).toBe('30d');
    expect(result.current.timeRange.start).toBeInstanceOf(Date);
    expect(result.current.timeRange.end).toBeInstanceOf(Date);
  });

  it('should initialize with custom preset', () => {
    const { result } = renderHook(() => useTimeRange('7d'));

    expect(result.current.preset).toBe('7d');
    expect(result.current.timeRange.preset).toBe('7d');
  });

  it('should update time range when preset changes', () => {
    const { result } = renderHook(() => useTimeRange('30d'));

    expect(result.current.preset).toBe('30d');

    act(() => {
      result.current.setPreset('7d');
    });

    expect(result.current.preset).toBe('7d');
    expect(result.current.timeRange.preset).toBe('7d');
  });

  it('should calculate correct date range for 7d preset', () => {
    const { result } = renderHook(() => useTimeRange('7d'));

    const diffDays = Math.floor(
      (result.current.timeRange.end.getTime() -
        result.current.timeRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    expect(diffDays).toBe(7);
  });

  it('should calculate correct date range for 30d preset', () => {
    const { result } = renderHook(() => useTimeRange('30d'));

    const diffDays = Math.floor(
      (result.current.timeRange.end.getTime() -
        result.current.timeRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    expect(diffDays).toBe(30);
  });

  it('should calculate correct date range for 90d preset', () => {
    const { result } = renderHook(() => useTimeRange('90d'));

    const diffDays = Math.floor(
      (result.current.timeRange.end.getTime() -
        result.current.timeRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    expect(diffDays).toBe(90);
  });

  it('should calculate correct date range for 1y preset', () => {
    const { result } = renderHook(() => useTimeRange('1y'));

    const diffYears =
      result.current.timeRange.end.getFullYear() -
      result.current.timeRange.start.getFullYear();

    expect(diffYears).toBe(1);
  });

  it('should calculate correct date range for all preset', () => {
    const { result } = renderHook(() => useTimeRange('all'));

    const diffYears =
      result.current.timeRange.end.getFullYear() -
      result.current.timeRange.start.getFullYear();

    expect(diffYears).toBe(10);
  });

  it('should maintain stable setPreset reference', () => {
    const { result, rerender } = renderHook(() => useTimeRange());

    const firstSetPreset = result.current.setPreset;

    rerender();

    expect(result.current.setPreset).toBe(firstSetPreset);
  });

  it('should update all return values when preset changes', () => {
    const { result } = renderHook(() => useTimeRange('30d'));

    const initialStart = result.current.timeRange.start;

    act(() => {
      result.current.setPreset('7d');
    });

    expect(result.current.preset).toBe('7d');
    expect(result.current.timeRange.preset).toBe('7d');
    expect(result.current.timeRange.start).not.toBe(initialStart);
  });

  it('should allow switching between all preset options', () => {
    const { result } = renderHook(() => useTimeRange());

    const presets: Array<'7d' | '30d' | '90d' | '1y' | 'all'> = [
      '7d',
      '30d',
      '90d',
      '1y',
      'all',
    ];

    presets.forEach((preset) => {
      act(() => {
        result.current.setPreset(preset);
      });

      expect(result.current.preset).toBe(preset);
      expect(result.current.timeRange.preset).toBe(preset);
    });
  });
});
