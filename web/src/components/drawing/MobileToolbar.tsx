import type { DrawingModeType } from '@/components/drawing/types';

interface MobileToolbarProps {
  mode: DrawingModeType;
  onModeChange: (mode: DrawingModeType) => void;
  onSave: () => void;
  onClear: () => void;
}

export function MobileToolbar({ mode, onModeChange, onSave, onClear }: MobileToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onModeChange('freehand')}
        aria-pressed={mode === 'freehand'}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          mode === 'freehand'
            ? 'bg-primary-600 text-white'
            : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        Freehand
      </button>
      <button
        type="button"
        onClick={() => onModeChange('graph')}
        aria-pressed={mode === 'graph'}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          mode === 'graph'
            ? 'bg-primary-600 text-white'
            : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        Graph
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Save drawing
        </button>
      </div>
    </div>
  );
}

