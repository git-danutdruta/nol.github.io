import { useMemo, useState } from 'react';
import { NotebookPen, Trash2 } from 'lucide-react';
import { useNotesStore } from '@/stores/notesStore';

interface StudyNotesProps {
  lessonId: string;
}

export function StudyNotes({ lessonId }: StudyNotesProps) {
  const { notesByLesson, setNote, clearNote } = useNotesStore();
  const existingNote = notesByLesson[lessonId] ?? '';
  const [draft, setDraft] = useState(existingNote);

  const wordCount = useMemo(() => draft.trim().split(/\s+/).filter(Boolean).length, [draft]);

  const handleSave = () => {
    setNote(lessonId, draft.trim());
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary-100 p-2 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
            <NotebookPen aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Study notes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Capture a reminder, example, or question for this lesson.
            </p>
          </div>
        </div>
        <span className="text-sm text-slate-500">{wordCount} words</span>
      </div>

      <label
        className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-300"
        htmlFor={`notes-${lessonId}`}
      >
        Your note
      </label>
      <textarea
        id={`notes-${lessonId}`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="Write the main idea in your own words..."
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Save note
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft('');
            clearNote(lessonId);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Clear
        </button>
      </div>
    </section>
  );
}
