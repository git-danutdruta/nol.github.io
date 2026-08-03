import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  variant?: 'info' | 'success' | 'error';
  durationMs?: number;
  actions?: ReactNode;
}

const VARIANT_CLASS: Record<NonNullable<ToastProps['variant']>, string> = {
  info: 'border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
  success:
    'border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200',
  error: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200',
};

export function Toast({
  open,
  message,
  onClose,
  variant = 'info',
  durationMs = 4000,
  actions,
}: ToastProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open || durationMs <= 0) return;
    const timer = window.setTimeout(() => onClose(), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onClose, open]);

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-xl rounded-lg border p-4 shadow-lg ${VARIANT_CLASS[variant]} ${
          reducedMotion ? '' : 'motion-toast-enter'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-current/30 px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/5"
          >
            Close
          </button>
        </div>
        {actions && <div className="mt-3 flex flex-wrap justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}

