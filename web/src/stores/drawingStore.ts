import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DrawingState } from '@/components/drawing/types';

interface DrawingStore {
  drawings: Record<string, DrawingState>;
  saveDrawing(key: string, state: DrawingState): void;
  getDrawing(key: string): DrawingState | undefined;
  deleteDrawing(key: string): void;
}

export const useDrawingStore = create<DrawingStore>()(
  persist(
    (set, get) => ({
      drawings: {},
      saveDrawing: (key, state) =>
        set((store) => ({
          drawings: { ...store.drawings, [key]: state },
        })),
      getDrawing: (key) => get().drawings[key],
      deleteDrawing: (key) =>
        set((store) => {
          const drawings = { ...store.drawings };
          delete drawings[key];
          return { drawings };
        }),
    }),
    {
      name: 'nol-drawings',
    }
  )
);
