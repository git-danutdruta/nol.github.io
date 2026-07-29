import { type ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { SkipLink } from '@/components/SkipLink';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navigation />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} NOL Math. Open source under MIT License.
        </div>
      </footer>
    </div>
  );
}
