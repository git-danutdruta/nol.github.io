import { Link } from 'react-router-dom';
import { useCurriculum } from '@/hooks/useCurriculum';
import { selectDailyByte } from '@/lib/dailyByteSelector';
import { StreakDisplay } from '@/components/gamification/StreakDisplay';
import { useProgressStore } from '@/stores/progressStore';

export function DailyBytePage() {
  const { lessons, loading } = useCurriculum();
  const lessonProgress = useProgressStore((state) => state.lessons);
  const completedLessonIds = Object.values(lessonProgress)
    .filter((entry) => entry.completed)
    .map((entry) => entry.lessonId);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-slate-500">
        Loading your daily byte…
      </div>
    );
  }

  const suggestion = selectDailyByte(lessons, completedLessonIds);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <header className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
          Daily math byte
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          A short practice ritual
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Keep momentum with a tiny task that fits into a few minutes. Missed a day? The streak
          stays friendly.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {suggestion.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {suggestion.description}
          </p>
          <p className="mt-4 rounded-xl border border-primary-200 bg-primary-50/80 p-4 text-sm text-slate-700 dark:border-primary-900/40 dark:bg-primary-950/20 dark:text-slate-300">
            {suggestion.prompt}
          </p>
          {suggestion.lessonId ? (
            <Link
              to={`/lessons/${suggestion.lessonId}`}
              className="mt-5 inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Open lesson
            </Link>
          ) : null}
        </section>

        <div className="space-y-4">
          <StreakDisplay />
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Why it works</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>Short enough to finish before your next task.</li>
              <li>Uses the lessons you have already started.</li>
              <li>Supports steady progress without guilt.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
