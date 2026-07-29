import { useParams } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LessonRenderer } from '@/components/LessonRenderer';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessons, loading } = useCurriculum();

  const lesson = lessons.find((l) => l.id === lessonId);

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
      <LessonRenderer lesson={lesson} />
    </div>
  );
}
