interface SelfCheckOverlayProps {
  open: boolean;
  title?: string;
  solutionText?: string;
  rubric: string[];
  onClose: () => void;
}

export function SelfCheckOverlay({
  open,
  title = 'Self-check guide',
  solutionText,
  rubric,
  onClose,
}: SelfCheckOverlayProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
    >
      <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
          <div>
            <p className="mb-2 font-medium">Checklist</p>
            <ul className="list-inside list-disc space-y-1">
              {rubric.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {solutionText && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
              <p className="mb-1 font-medium text-emerald-800 dark:text-emerald-300">Expected construction</p>
              <p className="text-emerald-900 dark:text-emerald-200">{solutionText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

