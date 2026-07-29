import { parseNumeric, evaluateExpression, areExpressionsEquivalent } from '@/lib/math/parseInput';
import type { Exercise } from '@/types/curriculum';

export interface ValidationResult {
  correct: boolean;
  message: string;
}

export function validateAnswer(exercise: Exercise, userAnswer: string): ValidationResult {
  if (exercise.type === 'multiple-choice') {
    const index = Number(userAnswer);
    if (Number.isNaN(index)) {
      return { correct: false, message: 'Please select an answer.' };
    }
    return {
      correct: index === exercise.correctOptionIndex,
      message: index === exercise.correctOptionIndex ? 'Correct!' : 'Not quite. Try again.',
    };
  }

  if (exercise.type === 'numeric') {
    const userValue = parseNumeric(userAnswer);
    const expectedValue =
      typeof exercise.answer === 'number' ? exercise.answer : parseNumeric(String(exercise.answer));
    if (userValue === null || expectedValue === null) {
      return { correct: false, message: 'Please enter a valid number.' };
    }
    const tolerance = exercise.tolerance ?? 0;
    const correct = Math.abs(userValue - expectedValue) <= tolerance;
    return { correct, message: correct ? 'Correct!' : 'Not quite. Check your calculation.' };
  }

  if (exercise.type === 'expression') {
    const expected = String(exercise.answer);
    if (exercise.validation === 'numeric') {
      const userValue = evaluateExpression(userAnswer);
      const expectedValue = evaluateExpression(expected);
      if (userValue === null || expectedValue === null) {
        return { correct: false, message: 'Please enter a valid expression.' };
      }
      const tolerance = exercise.tolerance ?? 0;
      const correct = Math.abs(userValue - expectedValue) <= tolerance;
      return { correct, message: correct ? 'Correct!' : 'Not quite. Simplify or check your work.' };
    }
    const correct = areExpressionsEquivalent(userAnswer, expected);
    return { correct, message: correct ? 'Correct!' : 'Not quite. Check your expression.' };
  }

  if (exercise.type === 'free-response') {
    const normalizedUser = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedExpected = String(exercise.answer).trim().toLowerCase().replace(/\s+/g, ' ');
    if (exercise.validation === 'exact') {
      return {
        correct: normalizedUser === normalizedExpected,
        message: normalizedUser === normalizedExpected ? 'Correct!' : 'Not quite. Try again.',
      };
    }
    return { correct: false, message: 'Free-response answers are reviewed manually.' };
  }

  if (exercise.type === 'drawing') {
    return { correct: true, message: 'Drawing saved for review.' };
  }

  return { correct: false, message: 'Unknown exercise type.' };
}
