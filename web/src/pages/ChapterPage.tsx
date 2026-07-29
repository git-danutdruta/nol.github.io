import { useParams, Link } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { chapters, loading } = useCurriculum();

  const chapter = chapters.find((c) => c.id === chapterId);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!chapter) return <NotFoundPage />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{chapter.title}</h1>
      <div className="space-y-3">
        {chapter.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{lesson.title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
