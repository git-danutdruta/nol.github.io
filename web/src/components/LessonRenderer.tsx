import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lesson, ProofWalkthrough as ProofWalkthroughType } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { ContentBlock } from '@/components/lesson/ContentBlock';
import { PedagogyBlock } from '@/components/lesson/PedagogyBlock';
import { ExerciseRenderer } from '@/components/exercises/ExerciseRenderer';
import { ReportIssue } from '@/components/ReportIssue';
import { useProgressStore } from '@/stores/progressStore';
import { StudyNotes } from '@/components/lesson/StudyNotes';
import { TeachItBack } from '@/components/lesson/TeachItBack';
import { ProofWalkthrough } from '@/components/lesson/ProofWalkthrough';

interface LessonRendererProps {
  lesson: Lesson;
}

export function LessonRenderer({ lesson }: LessonRendererProps) {
  const { i18n, t } = useTranslation();
  const syncLessonStructure = useProgressStore((state) => state.syncLessonStructure);
  const recordExerciseResult = useProgressStore((state) => state.recordExerciseResult);
  const lessonProgress = useProgressStore((state) => state.lessons[lesson.id]);
  const [proofs, setProofs] = useState<ProofWalkthroughType[]>([]);

  useEffect(() => {
    syncLessonStructure(lesson.id, lesson.exercises.length);
  }, [lesson.id, lesson.exercises.length, syncLessonStructure]);

  useEffect(() => {
    if (!lesson.proofIds?.length) {
      setProofs([]);
      return;
    }

    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}curriculum/proofs/mvp-proofs.json`)
      .then((response) => response.json())
      .then((data: ProofWalkthroughType[]) => {
        if (!cancelled) {
          const matched = data.filter((proof) => lesson.proofIds?.includes(proof.id));
          setProofs(matched);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProofs([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lesson.proofIds]);

  const isLessonCompleted = Boolean(lessonProgress?.completed);

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {getLocalizedString(lesson.title, i18n.language)}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <ReportIssue lessonId={lesson.id} kind="bug" />
          <ReportIssue lessonId={lesson.id} kind="content" />
        </div>
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <h2 className="font-semibold">{t('lesson.objectives', 'Learning objectives')}</h2>
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

      <StudyNotes lessonId={lesson.id} />

      {proofs.length > 0 && (
        <section aria-label="Proof walkthroughs" className="mb-8">
          {proofs.map((proof) => (
            <ProofWalkthrough key={proof.id} proof={proof} />
          ))}
        </section>
      )}

      {lesson.exercises.length > 0 && (
        <section aria-label="Exercises">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            {t('lesson.practice', 'Practice')}
          </h2>
          <div className="space-y-6">
            {lesson.exercises.map((exercise, index) => (
              <div key={exercise.id}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-500">
                    {t('exercise.exerciseLabel', { number: index + 1 })}
                  </p>
                  <ReportIssue lessonId={lesson.id} exerciseId={exercise.id} compact />
                </div>
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

      {isLessonCompleted && lesson.teachItBackPoints && lesson.teachItBackPoints.length > 0 && (
        <TeachItBack lessonId={lesson.id} points={lesson.teachItBackPoints} />
      )}
    </article>
  );
}
