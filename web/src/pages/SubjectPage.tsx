import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurriculum } from '@/hooks/useCurriculum';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { getLocalizedString } from '@/lib/i18n';
import { Seo } from '@/components/Seo';

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects, loading } = useCurriculum();
  const { i18n } = useTranslation();

  const subject = subjects.find((s) => s.id === subjectId);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!subject) return <NotFoundPage />;

  const loadedChapters = subject.chapters.filter(
    (c): c is Exclude<typeof c, string> => typeof c !== 'string'
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Seo
        title={`NOL Math | ${getLocalizedString(subject.title, i18n.language)}`}
        description={getLocalizedString(subject.description, i18n.language)}
      />
      <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
        {getLocalizedString(subject.title, i18n.language)}
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        {getLocalizedString(subject.description, i18n.language)}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {loadedChapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/chapters/${chapter.id}`}
            className="motion-card rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {getLocalizedString(chapter.title, i18n.language)}
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
