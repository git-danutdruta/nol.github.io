import {
  PROGRESS_SCHEMA_VERSION,
  type BadgeId,
  type LessonProgress,
  type ProgressPersistedState,
} from '@/types/progress';

const EMPTY_STATE: ProgressPersistedState = {
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  xp: 0,
  lessons: {},
  dailyActivity: {},
  badges: [],
};

function sanitizeBadges(value: unknown): BadgeId[] {
  if (!Array.isArray(value)) return [];
  const allowed: BadgeId[] = ['first_steps', 'lesson_finisher', 'streak_3', 'mastery_5'];
  return value.filter(
    (entry): entry is BadgeId => typeof entry === 'string' && allowed.includes(entry as BadgeId)
  );
}

function sanitizeLessonProgress(lessonId: string, value: unknown): LessonProgress | null {
  if (!value || typeof value !== 'object') return null;
  const lesson = value as Partial<LessonProgress>;

  const attemptedExerciseIds = Array.isArray(lesson.attemptedExerciseIds)
    ? lesson.attemptedExerciseIds.filter((id): id is string => typeof id === 'string')
    : [];
  const correctExerciseIds = Array.isArray(lesson.correctExerciseIds)
    ? lesson.correctExerciseIds.filter((id): id is string => typeof id === 'string')
    : [];

  const totalExercises = Number.isFinite(lesson.totalExercises)
    ? Math.max(0, Number(lesson.totalExercises))
    : 0;
  const attempts = Number.isFinite(lesson.attempts) ? Math.max(0, Number(lesson.attempts)) : 0;
  const correctAttempts = Number.isFinite(lesson.correctAttempts)
    ? Math.max(0, Number(lesson.correctAttempts))
    : 0;
  const mastery = totalExercises > 0 ? Math.min(1, correctExerciseIds.length / totalExercises) : 0;

  return {
    lessonId,
    totalExercises,
    attemptedExerciseIds,
    correctExerciseIds,
    attempts,
    correctAttempts,
    mastery,
    completed: mastery >= 1,
    completedAt: Number.isFinite(lesson.completedAt) ? Number(lesson.completedAt) : undefined,
    lastReviewedAt: Number.isFinite(lesson.lastReviewedAt)
      ? Number(lesson.lastReviewedAt)
      : undefined,
    nextReviewAt: Number.isFinite(lesson.nextReviewAt) ? Number(lesson.nextReviewAt) : undefined,
    reviewLevel: Number.isFinite(lesson.reviewLevel) ? Math.max(0, Number(lesson.reviewLevel)) : 0,
  };
}

export function sanitizeProgressState(input: unknown): ProgressPersistedState {
  if (!input || typeof input !== 'object') return EMPTY_STATE;

  const raw = input as Partial<ProgressPersistedState>;
  const lessons: Record<string, LessonProgress> = {};

  if (raw.lessons && typeof raw.lessons === 'object') {
    for (const [lessonId, value] of Object.entries(raw.lessons)) {
      const sanitized = sanitizeLessonProgress(lessonId, value);
      if (sanitized) lessons[lessonId] = sanitized;
    }
  }

  const dailyActivity: Record<string, number> = {};
  if (raw.dailyActivity && typeof raw.dailyActivity === 'object') {
    for (const [date, count] of Object.entries(raw.dailyActivity)) {
      if (Number.isFinite(count)) {
        dailyActivity[date] = Math.max(0, Number(count));
      }
    }
  }

  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    xp: Number.isFinite(raw.xp) ? Math.max(0, Number(raw.xp)) : 0,
    lessons,
    dailyActivity,
    badges: sanitizeBadges(raw.badges),
  };
}

export function migrateProgressState(
  input: unknown,
  version: number | undefined
): ProgressPersistedState {
  // v1 data did not have schemaVersion or review scheduling fields.
  if (version === 1 || version === undefined) {
    return sanitizeProgressState(input);
  }

  return sanitizeProgressState(input);
}
