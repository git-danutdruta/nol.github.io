import { useTranslation } from 'react-i18next';

export function ProgressPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
        {t('progress.title')}
      </h1>
      <p className="text-slate-600 dark:text-slate-400">{t('progress.empty')}</p>
    </section>
  );
}
