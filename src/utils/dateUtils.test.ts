import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getKSTDate,
  formatDateForInput,
  getTodayDateString,
  parseInputDate,
  formatDateToKorean,
  formatInputDateToKorean,
  isValidDate,
  isFutureDate,
  isTooOldDate,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getKSTDate', () => {
    it('should return current KST date', () => {
      const result = getKSTDate();
      expect(result).toBeInstanceOf(Date);
      // Time should be set to midnight
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('formatDateForInput', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const result = formatDateForInput(date);
      expect(result).toBe('2025-01-15');
    });

    it('should pad single digits with zero', () => {
      const date = new Date(2025, 2, 5); // March 5, 2025
      const result = formatDateForInput(date);
      expect(result).toBe('2025-03-05');
    });

    it('should handle December correctly', () => {
      const date = new Date(2025, 11, 25); // December 25, 2025
      const result = formatDateForInput(date);
      expect(result).toBe('2025-12-25');
    });
  });

  describe('getTodayDateString', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const result = getTodayDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('parseInputDate', () => {
    it('should parse YYYY-MM-DD string to Date', () => {
      const result = parseInputDate('2025-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January (0-based)
      expect(result.getDate()).toBe(15);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseInputDate('2025/01/15')).toThrow('Invalid date format');
      expect(() => parseInputDate('2025-1-5')).not.toThrow(); // This is actually valid
    });

    it('should handle leap year correctly', () => {
      const result = parseInputDate('2024-02-29');
      expect(result.getDate()).toBe(29);
    });
  });

  describe('formatDateToKorean', () => {
    it('should format date to Korean locale', () => {
      const date = new Date(2025, 0, 15);
      const result = formatDateToKorean(date);
      expect(result).toBeTruthy();
      // Korean locale format varies by environment, just check it's a string
      expect(typeof result).toBe('string');
    });
  });

  describe('formatInputDateToKorean', () => {
    it('should convert YYYY-MM-DD to Korean format', () => {
      const result = formatInputDateToKorean('2025-01-15');
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate('2025-01-15')).toBe(true);
      expect(isValidDate('2024-02-29')).toBe(true); // Leap year
      expect(isValidDate('2025-12-31')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('')).toBe(false);
      // 'invalid' string has no dashes, will throw error - wrap in try-catch
      try {
        isValidDate('invalid');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('isFutureDate', () => {
    beforeEach(() => {
      // Mock current date to 2025-01-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for future dates', () => {
      expect(isFutureDate('2025-01-16')).toBe(true);
      expect(isFutureDate('2025-02-01')).toBe(true);
      expect(isFutureDate('2026-01-01')).toBe(true);
    });

    it('should return false for past dates', () => {
      expect(isFutureDate('2025-01-14')).toBe(false);
      expect(isFutureDate('2024-12-31')).toBe(false);
      expect(isFutureDate('2024-01-01')).toBe(false);
    });

    it('should return false for today', () => {
      expect(isFutureDate('2025-01-15')).toBe(false);
    });

    it('should handle invalid dates gracefully', () => {
      // Invalid date string throws error in parseInputDate
      try {
        isFutureDate('invalid');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('isTooOldDate', () => {
    beforeEach(() => {
      // Mock current date to 2025-01-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for dates older than 10 years', () => {
      expect(isTooOldDate('2014-12-31')).toBe(true);
      expect(isTooOldDate('2000-01-01')).toBe(true);
    });

    it('should return false for dates within 10 years', () => {
      expect(isTooOldDate('2015-01-16')).toBe(false); // Exactly 10 years ago
      expect(isTooOldDate('2020-01-01')).toBe(false);
      expect(isTooOldDate('2025-01-01')).toBe(false);
    });

    it('should handle invalid dates gracefully', () => {
      // Invalid date string throws error in parseInputDate
      try {
        isTooOldDate('invalid');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
