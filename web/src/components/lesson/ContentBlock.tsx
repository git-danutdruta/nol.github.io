import { getLocalizedString } from '@/lib/i18n';
import type { ContentBlock as ContentBlockType } from '@/types/curriculum';
import { useTranslation } from 'react-i18next';
import { MathBlock } from '@/components/MathBlock';

interface ContentBlockProps {
  block: ContentBlockType;
}

export function ContentBlock({ block }: ContentBlockProps) {
  const { i18n } = useTranslation();

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="my-3 leading-relaxed">{getLocalizedString(block.content, i18n.language)}</p>
      );
    case 'heading':
      return (
        <h2 className="mb-2 mt-6 text-2xl font-bold">
          {getLocalizedString(block.content, i18n.language)}
        </h2>
      );
    case 'list':
      return (
        <ul className="my-3 list-inside list-disc space-y-1">
          {block.items?.map((item, index) => (
            <li key={index}>{getLocalizedString(item, i18n.language)}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div className="my-4 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-900 dark:bg-primary-900/20">
          {getLocalizedString(block.content, i18n.language)}
        </div>
      );
    case 'example':
      return (
        <div className="my-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <strong>Example:</strong> {getLocalizedString(block.content, i18n.language)}
        </div>
      );
    case 'math':
      return block.latex ? <MathBlock latex={block.latex} display /> : null;
    case 'image':
      return block.src ? (
        <img
          src={block.src}
          alt={getLocalizedString(block.alt, i18n.language)}
          className="my-4 max-w-full rounded-lg"
        />
      ) : null;
    case 'drawing':
      return (
        <div className="my-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
          <p>{getLocalizedString(block.prompt, i18n.language)}</p>
          <p className="mt-2 text-sm text-slate-500">Drawing mode: {block.mode || 'freehand'}</p>
        </div>
      );
    default:
      return null;
  }
}
