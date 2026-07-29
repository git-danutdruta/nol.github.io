import { useParams } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessons, loading } = useCurriculum();

  const lesson = lessons.find((l) => l.id === lessonId);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!lesson) return <NotFoundPage />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400">
          Lesson content will be rendered here by the LessonRenderer component (FE-005).
        </p>
      </div>
    </article>
  );
}
