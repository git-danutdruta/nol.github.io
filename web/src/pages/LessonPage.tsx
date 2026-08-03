import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LessonRenderer } from '@/components/LessonRenderer';
import { useProgressStore } from '@/stores/progressStore';
import { Seo } from '@/components/Seo';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessons, loading } = useCurriculum();
  const recordLessonVisit = useProgressStore((state) => state.recordLessonVisit);
  const { i18n } = useTranslation();

  const lesson = lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    if (lesson) {
      recordLessonVisit(lesson.id);
    }
  }, [lesson, recordLessonVisit]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!lesson) return <NotFoundPage />;

  return (
    <div className="px-4 py-16">
      <Seo
        title={`NOL Math | ${getLocalizedString(lesson.title, i18n.language)}`}
        description={`Practice ${lesson.exercises.length} exercise${lesson.exercises.length === 1 ? '' : 's'} in this lesson.`}
      />
      <LessonRenderer lesson={lesson} />
    </div>
  );
}
