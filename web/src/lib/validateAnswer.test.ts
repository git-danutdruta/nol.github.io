import { describe, it, expect } from 'vitest';
import { validateAnswer } from '@/lib/validateAnswer';
import type { Exercise } from '@/types/curriculum';

function makeExercise(overrides: Partial<Exercise>): Exercise {
  return {
    id: 'test',
    type: 'numeric',
    question: 'Test',
    ...overrides,
  };
}

describe('validateAnswer', () => {
  it('validates multiple choice', () => {
    const exercise = makeExercise({
      type: 'multiple-choice',
      options: ['A', 'B', 'C'],
      correctOptionIndex: 1,
    });
    expect(validateAnswer(exercise, '1').correct).toBe(true);
    expect(validateAnswer(exercise, '0').correct).toBe(false);
  });

  it('validates numeric answers with tolerance', () => {
    const exercise = makeExercise({ type: 'numeric', answer: 10, tolerance: 0.5 });
    expect(validateAnswer(exercise, '10').correct).toBe(true);
    expect(validateAnswer(exercise, '10.3').correct).toBe(true);
    expect(validateAnswer(exercise, '11').correct).toBe(false);
  });

  it('validates expression answers', () => {
    const exercise = makeExercise({ type: 'expression', answer: '5x' });
    expect(validateAnswer(exercise, '5x').correct).toBe(true);
    expect(validateAnswer(exercise, 'x*5').correct).toBe(true);
    expect(validateAnswer(exercise, '4x').correct).toBe(false);
  });

  it('validates free-response exact answers', () => {
    const exercise = makeExercise({ type: 'free-response', answer: '5 R 3', validation: 'exact' });
    expect(validateAnswer(exercise, '5 R 3').correct).toBe(true);
    expect(validateAnswer(exercise, '5 r 3').correct).toBe(true);
    expect(validateAnswer(exercise, '5').correct).toBe(false);
  });
});
