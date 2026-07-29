import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  label?: string;
}

export function MathInput({ value, onChange, placeholder, id, label }: MathInputProps) {
  const [mode, setMode] = useState<'math' | 'text'>('math');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current || mode !== 'math') return;
    try {
      katex.render(value || '\\square', previewRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      previewRef.current.textContent = value || '';
    }
  }, [value, mode]);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'math' ? 'text' : 'math'))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-pressed={mode === 'text'}
        >
          {mode === 'math' ? 'Use text input' : 'Use math preview'}
        </button>
      </div>
      {mode === 'math' ? (
        <>
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Type LaTeX, e.g., 2x + 3'}
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
            aria-label={label || 'Math input'}
          />
          <div
            ref={previewRef}
            className="min-h-[2.5rem] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
            aria-hidden="true"
          />
        </>
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Type your answer'}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          aria-label={label || 'Text input'}
        />
      )}
    </div>
  );
}
