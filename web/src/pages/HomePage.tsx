import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
          {t('home.welcome')}
        </h1>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-300 md:text-xl">
          {t('home.subtitle')}
        </p>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {t('home.startLearning')}
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
