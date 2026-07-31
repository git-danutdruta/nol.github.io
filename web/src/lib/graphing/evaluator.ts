import { compile } from 'mathjs';

export interface EvaluationResult {
  values: { x: number; y: number }[];
  error?: string;
}

export function evaluateFunction(
  expression: string,
  xMin: number,
  xMax: number,
  samples = 400
): EvaluationResult {
  try {
    const compiled = compile(expression);
    const values: { x: number; y: number }[] = [];
    const step = (xMax - xMin) / samples;

    for (let i = 0; i <= samples; i++) {
      const x = xMin + i * step;
      try {
        const y = compiled.evaluate({ x });
        if (typeof y === 'number' && Number.isFinite(y)) {
          values.push({ x, y });
        }
      } catch {
        // Skip points that fail evaluation
      }
    }

    return { values };
  } catch (err) {
    return { values: [], error: err instanceof Error ? err.message : 'Invalid expression' };
  }
}
