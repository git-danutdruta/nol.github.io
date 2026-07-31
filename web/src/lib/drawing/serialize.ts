import type { DrawingState } from '@/components/drawing/types';

export function serializeDrawing(state: DrawingState): string {
  return JSON.stringify(state);
}

export function deserializeDrawing(input: string): DrawingState | null {
  try {
    const parsed = JSON.parse(input) as DrawingState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}
