import { evaluate, simplify } from 'mathjs';

export function normalizeExpression(input: string): string {
  return input.replace(/\s+/g, '').replace(/\*/g, '').toLowerCase();
}

export function parseNumeric(input: string): number | null {
  const cleaned = input.replace(/,/g, '').trim();
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function evaluateExpression(input: string): number | null {
  try {
    const result = evaluate(input);
    return typeof result === 'number' && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

export function areExpressionsEquivalent(a: string, b: string): boolean {
  try {
    const diff = simplify(`(${a}) - (${b})`);
    return diff.toString() === '0';
  } catch {
    return normalizeExpression(a) === normalizeExpression(b);
  }
}
