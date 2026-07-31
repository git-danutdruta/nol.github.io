import { describe, expect, it } from 'vitest';
import { migrateProgressState, sanitizeProgressState } from '@/lib/progressMigrations';

describe('progress migrations', () => {
  it('sanitizes unknown shapes to defaults', () => {
    const result = sanitizeProgressState({});
    expect(result.schemaVersion).toBe(2);
    expect(result.xp).toBe(0);
    expect(result.lessons).toEqual({});
  });

  it('migrates legacy states and computes mastery from exercise counts', () => {
    const result = migrateProgressState(
      {
        xp: 99,
        lessons: {
          lesson_a: {
            totalExercises: 4,
            attemptedExerciseIds: ['a', 'b', 'c'],
            correctExerciseIds: ['a', 'b'],
            attempts: 5,
            correctAttempts: 2,
          },
        },
      },
      1
    );

    expect(result.schemaVersion).toBe(2);
    expect(result.xp).toBe(99);
    expect(result.lessons.lesson_a.mastery).toBe(0.5);
  });
});

