import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore } from '@/stores/progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({
      schemaVersion: 2,
      xp: 0,
      lessons: {},
      dailyActivity: {},
      badges: [],
    });
  });

  it('tracks exercise attempts and awards XP', () => {
    const store = useProgressStore.getState();
    store.syncLessonStructure('lesson-1', 2);
    store.recordExerciseResult('lesson-1', 'ex-1', true);

    const next = useProgressStore.getState();
    expect(next.xp).toBe(10);
    expect(next.lessons['lesson-1'].attempts).toBe(1);
    expect(next.lessons['lesson-1'].mastery).toBe(0.5);
  });

  it('marks lesson complete when all exercises are correct', () => {
    const store = useProgressStore.getState();
    store.syncLessonStructure('lesson-1', 2);
    store.recordExerciseResult('lesson-1', 'ex-1', true);
    store.recordExerciseResult('lesson-1', 'ex-2', true);

    const lesson = useProgressStore.getState().lessons['lesson-1'];
    expect(lesson.completed).toBe(true);
    expect(lesson.nextReviewAt).toBeDefined();
  });

  it('imports and resets persisted progress', () => {
    const store = useProgressStore.getState();
    store.importProgress({
      schemaVersion: 2,
      xp: 77,
      lessons: {},
      dailyActivity: {},
      badges: ['first_steps'],
    });
    expect(useProgressStore.getState().xp).toBe(77);

    store.resetProgress();
    expect(useProgressStore.getState().xp).toBe(0);
    expect(Object.keys(useProgressStore.getState().lessons)).toHaveLength(0);
  });
});
