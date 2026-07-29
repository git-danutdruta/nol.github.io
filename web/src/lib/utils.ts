import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLocaleNumber(value: number, locale = navigator.language): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatLocaleDate(value: Date | number, locale = navigator.language): string {
  return new Intl.DateTimeFormat(locale).format(value);
}
