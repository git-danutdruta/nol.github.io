import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import type { ProofWalkthrough as ProofWalkthroughType } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface ProofWalkthroughProps {
  proof: ProofWalkthroughType;
}

export function ProofWalkthrough({ proof }: ProofWalkthroughProps) {
  const { i18n } = useTranslation();
  const [revealedCount, setRevealedCount] = useState(1);

  useEffect(() => {
    const saved = window.localStorage.getItem(`proof-progress:${proof.id}`);
    if (!saved) return;
    try {
      const parsed = Number(JSON.parse(saved));
      if (Number.isFinite(parsed)) {
        setRevealedCount(Math.min(Math.max(parsed, 1), proof.steps.length));
      }
    } catch {
      // Ignore malformed saved state.
    }
  }, [proof.id, proof.steps.length]);

  useEffect(() => {
    window.localStorage.setItem(`proof-progress:${proof.id}`, JSON.stringify(revealedCount));
  }, [proof.id, revealedCount]);

  const completed = revealedCount >= proof.steps.length;
  const visibleSteps = useMemo(
    () => proof.steps.slice(0, revealedCount),
    [proof.steps, revealedCount]
  );

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
            Proof walkthrough
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {getLocalizedString(proof.title, i18n.language)}
          </h3>
        </div>
        <div className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-900/40 dark:bg-primary-950/30 dark:text-primary-300">
          {revealedCount}/{proof.steps.length} steps
        </div>
      </div>

      {proof.summary && (
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {getLocalizedString(proof.summary, i18n.language)}
        </p>
      )}

      <ol className="mt-6 space-y-3">
        {visibleSteps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary-100 p-2 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                {completed || index < revealedCount - 1 ? (
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {getLocalizedString(step.statement, i18n.language)}
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {getLocalizedString(step.justification, i18n.language)}
                </p>
                {step.visualHint && (
                  <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">
                    {getLocalizedString(step.visualHint, i18n.language)}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {!completed && (
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          onClick={() => setRevealedCount((count) => Math.min(count + 1, proof.steps.length))}
        >
          Reveal next step
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </section>
  );
}
