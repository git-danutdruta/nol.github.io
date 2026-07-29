import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
        {t('settings.title')}
      </h1>
      <div className="space-y-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </section>
  );
}
