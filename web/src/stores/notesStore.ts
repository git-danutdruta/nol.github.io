import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotesStore {
  notesByLesson: Record<string, string>;
  setNote: (lessonId: string, note: string) => void;
  clearNote: (lessonId: string) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notesByLesson: {},
      setNote: (lessonId, note) =>
        set((state) => ({
          notesByLesson: {
            ...state.notesByLesson,
            [lessonId]: note,
          },
        })),
      clearNote: (lessonId) =>
        set((state) => {
          const next = { ...state.notesByLesson };
          delete next[lessonId];
          return { notesByLesson: next };
        }),
    }),
    {
      name: 'nol-notes',
    }
  )
);
