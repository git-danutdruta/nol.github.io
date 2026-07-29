import { useParams, Link } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects, loading } = useCurriculum();

  const subject = subjects.find((s) => s.id === subjectId);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!subject) return <NotFoundPage />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{subject.title}</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">{subject.description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {subject.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/chapters/${chapter.id}`}
            className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {chapter.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {chapter.lessons.length} lessons
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
