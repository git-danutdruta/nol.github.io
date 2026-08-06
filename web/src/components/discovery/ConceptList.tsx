import { Link } from 'react-router-dom';

interface ConceptNode {
  id: string;
  title: string;
  lessonId?: string;
  description?: string;
}

interface ConceptListProps {
  nodes: ConceptNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function ConceptList({ nodes, selectedId, onSelect }: ConceptListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Concept list</h3>
      <ol className="mt-4 space-y-2" aria-label="Concept map list">
        {nodes.map((node) => {
          const active = node.id === selectedId;
          return (
            <li key={node.id}>
              <button
                type="button"
                className={`flex w-full items-start justify-between rounded-lg px-3 py-2 text-left text-sm transition ${active ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                onClick={() => onSelect?.(node.id)}
              >
                <span>{node.title}</span>
                {node.lessonId ? (
                  <span className="text-xs uppercase tracking-[0.2em]">Lesson</span>
                ) : null}
              </button>
              {node.description ? (
                <p className="mt-1 px-3 text-xs text-slate-500">{node.description}</p>
              ) : null}
              {node.lessonId ? (
                <Link
                  to={`/lessons/${node.lessonId}`}
                  className="ml-3 mt-1 inline-flex text-xs font-medium text-primary-700 underline-offset-4 hover:underline dark:text-primary-300"
                >
                  Open lesson
                </Link>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
