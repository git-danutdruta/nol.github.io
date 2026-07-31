import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
);
const SubjectsPage = lazy(() =>
  import('@/pages/SubjectsPage').then((module) => ({ default: module.SubjectsPage }))
);
const SubjectPage = lazy(() =>
  import('@/pages/SubjectPage').then((module) => ({ default: module.SubjectPage }))
);
const ChapterPage = lazy(() =>
  import('@/pages/ChapterPage').then((module) => ({ default: module.ChapterPage }))
);
const LessonPage = lazy(() =>
  import('@/pages/LessonPage').then((module) => ({ default: module.LessonPage }))
);
const ProgressPage = lazy(() =>
  import('@/pages/ProgressPage').then((module) => ({ default: module.ProgressPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);

const routeFallback = (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
  </div>
);

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={routeFallback}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:subjectId" element={<SubjectPage />} />
            <Route path="/chapters/:chapterId" element={<ChapterPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
