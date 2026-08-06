import { Flame } from 'lucide-react';
import { getCurrentStreak } from '@/stores/progressStore';

export function StreakDisplay() {
  const streak = getCurrentStreak();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
      <Flame aria-hidden="true" className="h-5 w-5" />
      <div>
        <p className="text-sm font-semibold">Current streak</p>
        <p className="text-sm">
          {streak} day{streak === 1 ? '' : 's'} of practice
        </p>
      </div>
    </div>
  );
}
