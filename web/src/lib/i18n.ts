import type { LocalizedString } from '@/types/curriculum';

export function getLocalizedString(value: LocalizedString | undefined, language: string): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  if (value[language]) return value[language];
  if (value.en) return value.en;
  return Object.values(value)[0] ?? '';
}
