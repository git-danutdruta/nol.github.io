import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useCurriculum } from '@/hooks/useCurriculum';
import { getLocalizedString } from '@/lib/i18n';

export function SubjectsPage() {
  const { t, i18n } = useTranslation();
  const { subjects, loading, error } = useCurriculum();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-slate-600 dark:text-slate-400">{t('home.noSubjects')}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
        {t('nav.subjects')}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subjects/${subject.id}`}
            className="motion-card flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <BookOpen
              aria-hidden="true"
              className="h-8 w-8 text-primary-600 dark:text-primary-400"
            />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {getLocalizedString(subject.title, i18n.language)}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {getLocalizedString(subject.description, i18n.language)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
