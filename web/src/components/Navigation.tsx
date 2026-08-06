import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, BookOpen, BarChart3, Settings, Home, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusTrap } from '@/components/FocusTrap';

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/subjects', labelKey: 'nav.subjects', icon: BookOpen },
  { to: '/use-cases', labelKey: 'nav.useCases', icon: Compass },
  { to: '/concept-map', labelKey: 'nav.conceptMap', icon: Sparkles },
  { to: '/daily-byte', labelKey: 'nav.dailyByte', icon: Sparkles },
  { to: '/progress', labelKey: 'nav.progress', icon: BarChart3 },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4"
        aria-label={t('nav.home')}
      >
        <Link
          to="/"
          className="motion-link flex items-center gap-2 text-lg font-bold text-primary-700 dark:text-primary-400"
        >
          <BookOpen aria-hidden="true" className="h-6 w-6" />
          <span>{t('app.name')}</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.menu')}
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="h-6 w-6" />
          ) : (
            <Menu aria-hidden="true" className="h-6 w-6" />
          )}
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'motion-link flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    active
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {t(item.labelKey, item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {mobileOpen && (
        <FocusTrap active={mobileOpen}>
          <div
            id="mobile-menu"
            className="border-t border-slate-200 bg-white p-4 md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'motion-link flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium',
                        active
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                      {t(item.labelKey, item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </FocusTrap>
      )}
    </header>
  );
}
