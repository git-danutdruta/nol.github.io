import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { getLocalizedString } from '@/lib/i18n';

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { chapters, loading } = useCurriculum();
  const { i18n } = useTranslation();

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
      <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
        {getLocalizedString(chapter.title, i18n.language)}
      </h1>
      <div className="space-y-3">
        {chapter.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {getLocalizedString(lesson.title, i18n.language)}
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
