import { BookOpen } from 'lucide-react';
import type { StoryContentBlock } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { MathBlock } from '@/components/MathBlock';

interface StoryBlockProps {
  block: StoryContentBlock;
}

function renderTextWithMath(text: string) {
  const segments = text.split(/(\$[^$]+\$)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith('$') && segment.endsWith('$')) {
      return <MathBlock key={`${segment}-${index}`} latex={segment.slice(1, -1)} />;
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
}

export function StoryBlock({ block }: StoryBlockProps) {
  const { i18n } = useTranslation();

  return (
    <section className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white p-2 shadow-sm dark:bg-slate-950">
            <BookOpen
              aria-hidden="true"
              className="h-5 w-5 text-primary-700 dark:text-primary-300"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {getLocalizedString(block.title, i18n.language)}
            </h3>
            {block.readTime && (
              <p className="text-sm text-slate-500">Read time: {block.readTime}</p>
            )}
          </div>
        </div>
        {block.characters && block.characters.length > 0 && (
          <div className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {block.characters.map((entry) => getLocalizedString(entry, i18n.language)).join(' • ')}
          </div>
        )}
      </div>

      {block.summary && (
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {getLocalizedString(block.summary, i18n.language)}
        </p>
      )}

      <div className="mt-5 space-y-4">
        {block.chapters.map((chapter, index) => (
          <div
            key={`${chapter.content}-${index}`}
            className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            {chapter.title && (
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {getLocalizedString(chapter.title, i18n.language)}
              </h4>
            )}
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {renderTextWithMath(getLocalizedString(chapter.content, i18n.language))}
            </p>
          </div>
        ))}
      </div>

      {block.moral && (
        <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50/80 p-4 dark:border-primary-900/40 dark:bg-primary-950/20">
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
            Math takeaway
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            {getLocalizedString(block.moral, i18n.language)}
          </p>
        </div>
      )}
    </section>
  );
}
