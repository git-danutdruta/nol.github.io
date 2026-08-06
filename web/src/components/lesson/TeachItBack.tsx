import { useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useNotesStore } from '@/stores/notesStore';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import type { LocalizedString } from '@/types/curriculum';

interface TeachItBackProps {
  lessonId: string;
  points?: LocalizedString[];
}

export function TeachItBack({ lessonId, points = [] }: TeachItBackProps) {
  const { i18n } = useTranslation();
  const { notesByLesson, setNote } = useNotesStore();
  const [draft, setDraft] = useState(notesByLesson[lessonId] ?? '');

  const checklistItems = useMemo(
    () => points.map((point) => getLocalizedString(point, i18n.language)),
    [i18n.language, points]
  );

  const handleSave = () => {
    const value = draft.trim();
    if (!value) return;
    const entry = `Teach it back:\n${value}\n\nChecklist:\n${checklistItems.join('\n')}`;
    setNote(lessonId, entry);
  };

  return (
    <section className="mb-8 rounded-2xl border border-primary-200 bg-primary-50/70 p-5 shadow-sm dark:border-primary-900/40 dark:bg-primary-950/20">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2 text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300">
          <GraduationCap aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Teach it back</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Explain the lesson in your own words. This becomes a study note you can revisit later.
          </p>
        </div>
      </div>

      {checklistItems.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary-200 bg-white/70 p-4 dark:border-primary-900/40 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">What to cover</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <label
        className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-300"
        htmlFor={`teach-it-back-${lessonId}`}
      >
        Your explanation
      </label>
      <textarea
        id={`teach-it-back-${lessonId}`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="Describe the idea as if you were teaching a classmate..."
      />

      <button
        type="button"
        onClick={handleSave}
        className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        Save explanation
      </button>
    </section>
  );
}
