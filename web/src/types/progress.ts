export const PROGRESS_SCHEMA_VERSION = 2;

export type BadgeId = 'first_steps' | 'lesson_finisher' | 'streak_3' | 'mastery_5';

export interface LessonProgress {
  lessonId: string;
  totalExercises: number;
  attemptedExerciseIds: string[];
  correctExerciseIds: string[];
  attempts: number;
  correctAttempts: number;
  mastery: number;
  completed: boolean;
  completedAt?: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  reviewLevel: number;
}

export interface ProgressPersistedState {
  schemaVersion: number;
  xp: number;
  lessons: Record<string, LessonProgress>;
  dailyActivity: Record<string, number>;
  badges: BadgeId[];
}

export interface ProgressExportPayload {
  app: 'nol-math';
  type: 'progress-export';
  schemaVersion: number;
  exportedAt: string;
  data: ProgressPersistedState;
}

