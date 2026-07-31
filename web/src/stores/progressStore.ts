import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PROGRESS_SCHEMA_VERSION,
  type BadgeId,
  type LessonProgress,
  type ProgressPersistedState,
} from '@/types/progress';
import { migrateProgressState } from '@/lib/progressMigrations';

const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

interface ProgressStore extends ProgressPersistedState {
  syncLessonStructure(lessonId: string, totalExercises: number): void;
  recordLessonVisit(lessonId: string): void;
  recordExerciseResult(lessonId: string, exerciseId: string, correct: boolean): void;
  getDueLessonIds(now?: number): string[];
  importProgress(data: ProgressPersistedState): void;
  resetProgress(): void;
}

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function computeCurrentStreak(activity: Record<string, number>): number {
  const dayMs = 24 * 60 * 60 * 1000;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Cap history scan to avoid unbounded loops if data is malformed.
  for (let i = 0; i < 3650; i++) {
    const key = toDateKey(cursor);
    if ((activity[key] ?? 0) <= 0) break;
    streak += 1;
    cursor.setTime(cursor.getTime() - dayMs);
  }

  return streak;
}

function updateBadges(state: ProgressPersistedState): BadgeId[] {
  const completedLessons = Object.values(state.lessons).filter((lesson) => lesson.completed).length;
  const totalAttempts = Object.values(state.lessons).reduce((sum, lesson) => sum + lesson.attempts, 0);
  const streak = computeCurrentStreak(state.dailyActivity);

  const badges = new Set<BadgeId>();
  if (totalAttempts >= 1) badges.add('first_steps');
  if (completedLessons >= 1) badges.add('lesson_finisher');
  if (streak >= 3) badges.add('streak_3');
  if (completedLessons >= 5) badges.add('mastery_5');

  return Array.from(badges);
}

function getOrCreateLesson(lessons: Record<string, LessonProgress>, lessonId: string): LessonProgress {
  return (
    lessons[lessonId] ?? {
      lessonId,
      totalExercises: 0,
      attemptedExerciseIds: [],
      correctExerciseIds: [],
      attempts: 0,
      correctAttempts: 0,
      mastery: 0,
      completed: false,
      reviewLevel: 0,
    }
  );
}

function computeNextReviewAt(level: number, now: number): number {
  const day = 24 * 60 * 60 * 1000;
  const idx = Math.min(level, REVIEW_INTERVAL_DAYS.length - 1);
  return now + REVIEW_INTERVAL_DAYS[idx] * day;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      xp: 0,
      lessons: {},
      dailyActivity: {},
      badges: [],

      syncLessonStructure: (lessonId, totalExercises) => {
        set((state) => {
          const lesson = getOrCreateLesson(state.lessons, lessonId);
          const normalizedTotal = Math.max(0, totalExercises);
          const mastery =
            normalizedTotal > 0
              ? Math.min(1, lesson.correctExerciseIds.length / normalizedTotal)
              : lesson.mastery;
          const updatedLesson: LessonProgress = {
            ...lesson,
            totalExercises: normalizedTotal,
            mastery,
            completed: normalizedTotal > 0 && mastery >= 1,
          };

          const next = {
            ...state,
            lessons: {
              ...state.lessons,
              [lessonId]: updatedLesson,
            },
          };

          return { ...next, badges: updateBadges(next) };
        });
      },

      recordLessonVisit: (lessonId) => {
        set((state) => {
          const now = Date.now();
          const today = toDateKey(new Date(now));
          const lesson = getOrCreateLesson(state.lessons, lessonId);
          const updatedLesson: LessonProgress = {
            ...lesson,
            lastReviewedAt: now,
          };

          const next = {
            ...state,
            lessons: { ...state.lessons, [lessonId]: updatedLesson },
            dailyActivity: {
              ...state.dailyActivity,
              [today]: (state.dailyActivity[today] ?? 0) + 1,
            },
          };

          return { ...next, badges: updateBadges(next) };
        });
      },

      recordExerciseResult: (lessonId, exerciseId, correct) => {
        set((state) => {
          const now = Date.now();
          const today = toDateKey(new Date(now));
          const lesson = getOrCreateLesson(state.lessons, lessonId);

          const attemptedSet = new Set(lesson.attemptedExerciseIds);
          const correctSet = new Set(lesson.correctExerciseIds);
          attemptedSet.add(exerciseId);
          if (correct) {
            correctSet.add(exerciseId);
          }

          const totalExercises = Math.max(lesson.totalExercises, attemptedSet.size);
          const mastery = totalExercises > 0 ? Math.min(1, correctSet.size / totalExercises) : 0;

          let reviewLevel = lesson.reviewLevel;
          let nextReviewAt = lesson.nextReviewAt;
          const wasCompleted = lesson.completed;
          const isCompleted = mastery >= 1;

          if (isCompleted && !wasCompleted) {
            reviewLevel = 0;
            nextReviewAt = computeNextReviewAt(reviewLevel, now);
          } else if (isCompleted && correct && lesson.nextReviewAt && now >= lesson.nextReviewAt) {
            reviewLevel = lesson.reviewLevel + 1;
            nextReviewAt = computeNextReviewAt(reviewLevel, now);
          }

          const updatedLesson: LessonProgress = {
            ...lesson,
            attemptedExerciseIds: Array.from(attemptedSet),
            correctExerciseIds: Array.from(correctSet),
            attempts: lesson.attempts + 1,
            correctAttempts: lesson.correctAttempts + (correct ? 1 : 0),
            mastery,
            completed: isCompleted,
            completedAt: isCompleted ? lesson.completedAt ?? now : lesson.completedAt,
            lastReviewedAt: now,
            reviewLevel,
            nextReviewAt,
          };

          const next = {
            ...state,
            xp: state.xp + (correct ? 10 : 2),
            lessons: {
              ...state.lessons,
              [lessonId]: updatedLesson,
            },
            dailyActivity: {
              ...state.dailyActivity,
              [today]: (state.dailyActivity[today] ?? 0) + 1,
            },
          };

          return { ...next, badges: updateBadges(next) };
        });
      },

      getDueLessonIds: (now = Date.now()) => {
        return Object.values(get().lessons)
          .filter((lesson) => lesson.completed && lesson.nextReviewAt !== undefined && lesson.nextReviewAt <= now)
          .map((lesson) => lesson.lessonId);
      },

      importProgress: (data) => {
        const imported = migrateProgressState(data, data.schemaVersion);
        set(() => ({ ...imported, badges: updateBadges(imported) }));
      },

      resetProgress: () => {
        set(() => ({
          schemaVersion: PROGRESS_SCHEMA_VERSION,
          xp: 0,
          lessons: {},
          dailyActivity: {},
          badges: [],
        }));
      },
    }),
    {
      name: 'nol-progress',
      version: PROGRESS_SCHEMA_VERSION,
      migrate: (persistedState, version) => migrateProgressState(persistedState, version),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        xp: state.xp,
        lessons: state.lessons,
        dailyActivity: state.dailyActivity,
        badges: state.badges,
      }),
    }
  )
);

export function getCurrentStreak(): number {
  return computeCurrentStreak(useProgressStore.getState().dailyActivity);
}

