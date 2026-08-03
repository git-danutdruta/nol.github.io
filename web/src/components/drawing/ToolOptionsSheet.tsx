import type { DrawingModeType } from '@/components/drawing/types';

interface ToolOptionsSheetProps {
  open: boolean;
  mode: DrawingModeType;
  onClose: () => void;
  onModeChange: (mode: DrawingModeType) => void;
}

export function ToolOptionsSheet({ open, mode, onClose, onModeChange }: ToolOptionsSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-950/40 md:hidden" role="dialog" aria-modal="true">
      <div className="w-full rounded-t-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tool options</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange('freehand')}
            aria-pressed={mode === 'freehand'}
            className={`min-h-[44px] rounded-md px-3 py-2 text-sm font-medium ${
              mode === 'freehand'
                ? 'bg-primary-600 text-white'
                : 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            Freehand
          </button>
          <button
            type="button"
            onClick={() => onModeChange('graph')}
            aria-pressed={mode === 'graph'}
            className={`min-h-[44px] rounded-md px-3 py-2 text-sm font-medium ${
              mode === 'graph'
                ? 'bg-primary-600 text-white'
                : 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            Graph
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
          Palm rejection tip: if your hand causes stray strokes, zoom in and draw with short strokes.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 min-h-[44px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          Done
        </button>
      </div>
    </div>
  );
}

