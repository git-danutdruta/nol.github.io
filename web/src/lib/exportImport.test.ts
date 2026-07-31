import { describe, expect, it } from 'vitest';
import { exportProgressToJson, parseImportedProgress } from '@/lib/exportImport';
import type { ProgressPersistedState } from '@/types/progress';

const sampleState: ProgressPersistedState = {
  schemaVersion: 2,
  xp: 42,
  lessons: {
    lesson_a: {
      lessonId: 'lesson_a',
      totalExercises: 2,
      attemptedExerciseIds: ['e1', 'e2'],
      correctExerciseIds: ['e1'],
      attempts: 3,
      correctAttempts: 1,
      mastery: 0.5,
      completed: false,
      reviewLevel: 0,
    },
  },
  dailyActivity: {
    '2026-08-01': 2,
  },
  badges: ['first_steps'],
};

describe('export/import progress', () => {
  it('exports and re-imports valid progress payloads', () => {
    const json = exportProgressToJson(sampleState);
    const imported = parseImportedProgress(json);
    expect(imported.xp).toBe(42);
    expect(imported.lessons.lesson_a.attempts).toBe(3);
    expect(imported.badges).toContain('first_steps');
  });

  it('rejects invalid JSON payloads', () => {
    expect(() => parseImportedProgress('{ bad json')).toThrowError('Invalid JSON file.');
  });

  it('rejects non-progress payloads', () => {
    expect(() => parseImportedProgress(JSON.stringify({ foo: 'bar' }))).toThrowError(
      'Unsupported import file format.'
    );
  });
});

