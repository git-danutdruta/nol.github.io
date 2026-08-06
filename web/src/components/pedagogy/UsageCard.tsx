import { useId, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UsageCardContentBlock } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface UsageCardProps {
  card: UsageCardContentBlock;
}

export function UsageCard({ card }: UsageCardProps) {
  const { i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  const concept = getLocalizedString(card.concept, i18n.language);
  const audience = card.audience ? getLocalizedString(card.audience, i18n.language) : 'Learners';
  const relatedConcepts =
    card.relatedConcepts?.map((entry) => getLocalizedString(entry, i18n.language)) ?? [];
  const query = new URLSearchParams();
  query.set('concept', concept);
  if (card.domain) {
    query.set('domain', card.domain);
  }

  return (
    <section className="my-5 rounded-2xl border border-primary-200 bg-primary-50/70 p-4 shadow-sm dark:border-primary-900/50 dark:bg-primary-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white p-2 text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
              {card.domain}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{concept}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{audience}</p>
          </div>
        </div>
        <Link
          to={`/use-cases?${query.toString()}`}
          className="text-sm font-medium text-primary-700 underline-offset-4 hover:underline dark:text-primary-300"
        >
          Explore more
        </Link>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {getLocalizedString(card.scenario, i18n.language)}
      </p>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary-200 px-3 py-2 text-sm font-medium text-primary-700 transition hover:bg-white dark:border-primary-900/40 dark:text-primary-300 dark:hover:bg-slate-900"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Hide details' : 'Show why it matters'}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div
          id={contentId}
          className="mt-4 space-y-3 rounded-xl bg-white/70 p-4 dark:bg-slate-900/60"
        >
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Why it matters:</span>{' '}
            {getLocalizedString(card.whyItMatters, i18n.language)}
          </p>
          {relatedConcepts.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Related concepts
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {relatedConcepts.map((conceptName) => (
                  <span
                    key={conceptName}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {conceptName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
