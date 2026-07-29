import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">{t('errors.notFound')}</p>
      <Link
        to="/"
        className="rounded-md bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {t('errors.goHome')}
      </Link>
    </section>
  );
}
