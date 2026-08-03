import { describe, expect, it } from 'vitest';
import { gradeGeometryDrawing } from '@/lib/geometry/grader';
import type { Exercise } from '@/types/curriculum';
import type { DrawingState, Stroke } from '@/components/drawing/types';

function makeExercise(question: string): Exercise {
  return {
    id: 'geo-test',
    type: 'drawing',
    question,
    drawingMode: 'geometry',
  };
}

function lineStroke(id: string, x1: number, y1: number, x2: number, y2: number): Stroke {
  return {
    id,
    color: '#000',
    width: 2,
    opacity: 1,
    tool: 'pen',
    points: [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ],
  };
}

function drawingWithStrokes(strokes: Stroke[]): DrawingState {
  return {
    version: 1,
    mode: 'freehand',
    freehand: { strokes },
  };
}

describe('gradeGeometryDrawing', () => {
  it('passes a simple perpendicular construction', () => {
    const exercise = makeExercise('Construct perpendicular lines through point P.');
    const state = drawingWithStrokes([
      lineStroke('a', 100, 100, 300, 100),
      lineStroke('b', 200, 20, 200, 220),
    ]);

    const result = gradeGeometryDrawing(exercise, state);
    expect(result.correct).toBe(true);
    expect(result.status).toBe('passed');
  });

  it('passes a simple parallel construction', () => {
    const exercise = makeExercise('Draw a line parallel to the given segment.');
    const state = drawingWithStrokes([
      lineStroke('a', 100, 100, 300, 120),
      lineStroke('b', 110, 180, 310, 200),
    ]);

    const result = gradeGeometryDrawing(exercise, state);
    expect(result.correct).toBe(true);
    expect(result.status).toBe('passed');
  });

  it('returns manual mode for unsupported geometry prompts', () => {
    const exercise = makeExercise('Construct a regular pentagon from side AB.');
    const state = drawingWithStrokes([
      lineStroke('a', 100, 100, 300, 100),
      lineStroke('b', 300, 100, 350, 200),
    ]);

    const result = gradeGeometryDrawing(exercise, state);
    expect(result.status).toBe('manual');
    expect(result.correct).toBe(false);
  });
});
