import { useTranslation } from 'react-i18next';
import { useCurriculum } from '@/hooks/useCurriculum';
import { getLocalizedString } from '@/lib/i18n';
import { formatLocaleDate } from '@/lib/utils';
import { getCurrentStreak, useProgressStore } from '@/stores/progressStore';

const BADGE_LABELS: Record<string, string> = {
  first_steps: 'progress.badges.first_steps',
  lesson_finisher: 'progress.badges.lesson_finisher',
  streak_3: 'progress.badges.streak_3',
  mastery_5: 'progress.badges.mastery_5',
};

export function ProgressPage() {
  const { t, i18n } = useTranslation();
  const { lessons: curriculumLessons, loading } = useCurriculum();
  const { lessons, xp, badges, getDueLessonIds } = useProgressStore();

  const allLessonProgress = Object.values(lessons);
  const completedLessons = allLessonProgress.filter((lesson) => lesson.completed).length;
  const totalAttempts = allLessonProgress.reduce((sum, lesson) => sum + lesson.attempts, 0);
  const masteryPercent =
    allLessonProgress.length === 0
      ? 0
      : Math.round(
          allLessonProgress.reduce((sum, lesson) => sum + lesson.mastery, 0) / allLessonProgress.length * 100
        );
  const streak = getCurrentStreak();
  const dueLessonIds = getDueLessonIds();

  const lessonTitleById = new Map(
    curriculumLessons.map((lesson) => [lesson.id, getLocalizedString(lesson.title, i18n.language)])
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
        {t('progress.title')}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('progress.cards.xp')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{xp}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('progress.cards.streak')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{streak}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('progress.cards.completed')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{completedLessons}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('progress.cards.mastery')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{masteryPercent}%</p>
        </div>
      </div>

      {allLessonProgress.length === 0 && (
        <p className="mt-8 text-slate-600 dark:text-slate-400">{t('progress.empty')}</p>
      )}

      {badges.length > 0 && (
        <section className="mt-10" aria-label={t('progress.badges.title')}>
          <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
            {t('progress.badges.title')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-800 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
              >
                {t(BADGE_LABELS[badge] ?? badge)}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-label={t('progress.review.title')}>
        <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
          {t('progress.review.title')}
        </h2>
        {dueLessonIds.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">{t('progress.review.noneDue')}</p>
        ) : (
          <ul className="space-y-2">
            {dueLessonIds.map((lessonId) => (
              <li
                key={lessonId}
                className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-900/20"
              >
                {lessonTitleById.get(lessonId) ?? lessonId}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!loading && allLessonProgress.length > 0 && (
        <section className="mt-10" aria-label={t('progress.lessonBreakdown')}>
          <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
            {t('progress.lessonBreakdown')}
          </h2>
          <ul className="space-y-3">
            {allLessonProgress
              .slice()
              .sort((a, b) => (b.lastReviewedAt ?? 0) - (a.lastReviewedAt ?? 0))
              .map((lesson) => (
                <li
                  key={lesson.lessonId}
                  className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {lessonTitleById.get(lesson.lessonId) ?? lesson.lessonId}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {t('progress.attemptsLabel', { count: lesson.attempts })}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {Math.round(lesson.mastery * 100)}%
                    </p>
                  </div>
                  {lesson.nextReviewAt && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {t('progress.nextReview', {
                        date: formatLocaleDate(lesson.nextReviewAt, i18n.language),
                      })}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        {t('progress.totalAttempts', { count: totalAttempts })}
      </p>
    </section>
  );
}
