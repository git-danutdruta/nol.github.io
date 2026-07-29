import { describe, it, expect } from 'vitest';
import { cn, formatLocaleNumber, formatLocaleDate } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names and resolves tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('ignores falsy values', () => {
      expect(cn('px-2', false && 'py-1', 'py-3')).toBe('px-2 py-3');
    });
  });

  describe('formatLocaleNumber', () => {
    it('formats numbers for the given locale', () => {
      expect(formatLocaleNumber(1234.5, 'en-US')).toBe('1,234.5');
      expect(formatLocaleNumber(1234.5, 'fr-FR')).toMatch(/1[\s\u202f]234,5/);
    });
  });

  describe('formatLocaleDate', () => {
    it('formats dates for the given locale', () => {
      const date = new Date(2026, 6, 29);
      expect(formatLocaleDate(date, 'en-US')).toMatch(/7\/29\/2026/);
    });
  });
});
