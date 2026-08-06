import type { Lesson } from '@/types/curriculum';

export interface DailyByteSuggestion {
  id: string;
  title: string;
  description: string;
  lessonId?: string;
  prompt: string;
}

export function selectDailyByte(
  lessons: Lesson[],
  completedLessonIds: string[]
): DailyByteSuggestion {
  const completedSet = new Set(completedLessonIds);
  const upcomingLesson = lessons.find((lesson) => !completedSet.has(lesson.id));

  if (completedLessonIds.length > 0 && upcomingLesson) {
    return {
      id: 'review-and-preview',
      title: 'Daily byte: review and preview',
      description: 'Spend 3 minutes revisiting a recent idea, then peek at the next lesson.',
      lessonId: upcomingLesson.id,
      prompt: `Try one quick problem from ${upcomingLesson.title} and note one idea you want to remember.`,
    };
  }

  const fallback = lessons[0];
  return {
    id: 'start-here',
    title: 'Daily byte: start small',
    description: 'A tiny warm-up to build confidence before the next lesson.',
    lessonId: fallback?.id,
    prompt: fallback
      ? `Open ${fallback.title} and solve the first exercise.`
      : 'Open your first lesson and begin.',
  };
}
