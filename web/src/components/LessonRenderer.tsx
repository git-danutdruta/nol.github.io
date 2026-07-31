import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lesson } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { ContentBlock } from '@/components/lesson/ContentBlock';
import { PedagogyBlock } from '@/components/lesson/PedagogyBlock';
import { ExerciseRenderer } from '@/components/exercises/ExerciseRenderer';
import { useProgressStore } from '@/stores/progressStore';

interface LessonRendererProps {
  lesson: Lesson;
}

export function LessonRenderer({ lesson }: LessonRendererProps) {
  const { i18n } = useTranslation();
  const syncLessonStructure = useProgressStore((state) => state.syncLessonStructure);
  const recordExerciseResult = useProgressStore((state) => state.recordExerciseResult);

  useEffect(() => {
    syncLessonStructure(lesson.id, lesson.exercises.length);
  }, [lesson.id, lesson.exercises.length, syncLessonStructure]);

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {getLocalizedString(lesson.title, i18n.language)}
        </h1>
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <h2 className="font-semibold">Learning objectives</h2>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {lesson.objectives.map((objective, index) => (
                <li key={index}>{getLocalizedString(objective, i18n.language)}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {lesson.pedagogy && lesson.pedagogy.length > 0 && (
        <section aria-label="Pedagogy" className="mb-8">
          {lesson.pedagogy.map((block, index) => (
            <PedagogyBlock key={index} block={block} />
          ))}
        </section>
      )}

      <section aria-label="Lesson content" className="mb-10">
        {lesson.content.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </section>

      {lesson.exercises.length > 0 && (
        <section aria-label="Exercises">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Practice</h2>
          <div className="space-y-6">
            {lesson.exercises.map((exercise, index) => (
              <div key={exercise.id}>
                <p className="mb-2 text-sm font-medium text-slate-500">Exercise {index + 1}</p>
                <ExerciseRenderer
                  exercise={exercise}
                  onEvaluated={({ exerciseId, correct }) =>
                    recordExerciseResult(lesson.id, exerciseId, correct)
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
