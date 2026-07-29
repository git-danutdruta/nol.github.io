import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { SubjectsPage } from '@/pages/SubjectsPage';
import { SubjectPage } from '@/pages/SubjectPage';
import { ChapterPage } from '@/pages/ChapterPage';
import { LessonPage } from '@/pages/LessonPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <AppShell>
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
      </AppShell>
    </ErrorBoundary>
  );
}
