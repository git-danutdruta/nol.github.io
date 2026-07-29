import { getLocalizedString } from '@/lib/i18n';
import type { PedagogyBlock as PedagogyBlockType } from '@/types/curriculum';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Zap, Brain, Target, AlertTriangle, HelpCircle } from 'lucide-react';

const ICONS = {
  tip: Lightbulb,
  trick: Zap,
  mnemonic: Brain,
  strategy: Target,
  pitfall: AlertTriangle,
  why: HelpCircle,
};

const STYLES = {
  tip: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  trick:
    'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  mnemonic:
    'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  strategy:
    'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  pitfall:
    'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  why: 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

interface PedagogyBlockProps {
  block: PedagogyBlockType;
}

export function PedagogyBlock({ block }: PedagogyBlockProps) {
  const { i18n } = useTranslation();
  const Icon = ICONS[block.type];
  const style = STYLES[block.type];

  return (
    <aside className={`my-4 rounded-lg border p-4 ${style}`}>
      <div className="flex items-center gap-2 font-semibold">
        <Icon aria-hidden="true" className="h-5 w-5" />
        <span className="capitalize">{block.type}</span>
        {block.title && <span>: {getLocalizedString(block.title, i18n.language)}</span>}
      </div>
      <p className="mt-2">{getLocalizedString(block.content, i18n.language)}</p>
    </aside>
  );
}
