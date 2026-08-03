import { useState } from 'react';
import type { DrawingModeType } from '@/components/drawing/types';

interface MobileToolbarProps {
  mode: DrawingModeType;
  onModeChange: (mode: DrawingModeType) => void;
  onSave: () => void;
  onClear: () => void;
  onOpenOptions: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function MobileToolbar({
  mode,
  onModeChange,
  onSave,
  onClear,
  onOpenOptions,
  onToggleFullscreen,
  isFullscreen,
}: MobileToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 md:flex">
        <button
          type="button"
          onClick={() => onModeChange('freehand')}
          aria-pressed={mode === 'freehand'}
          className={`min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
          className={`min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'graph'
              ? 'bg-primary-600 text-white'
              : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Graph
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear (C)
          </button>
          <button
            type="button"
            onClick={onSave}
            className="min-h-[44px] rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Save drawing (S)
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="fixed bottom-4 right-4 z-30 min-h-[44px] min-w-[44px] rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Tools
        </button>

        {open && (
          <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={onOpenOptions}
              className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Options
            </button>
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              {isFullscreen ? 'Exit full screen' : 'Full screen'}
            </button>
            <button
              type="button"
              onClick={() => onModeChange(mode === 'freehand' ? 'graph' : 'freehand')}
              className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Mode: {mode}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="min-h-[44px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onSave}
              className="min-h-[44px] rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
}
