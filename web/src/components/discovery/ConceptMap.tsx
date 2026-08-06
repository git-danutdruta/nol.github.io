import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConceptList } from '@/components/discovery/ConceptList';

interface ConceptNode {
  id: string;
  title: string;
  lessonId?: string;
  description?: string;
  x: number;
  y: number;
}

interface ConceptEdge {
  source: string;
  target: string;
  type: string;
}

interface ConceptGraphData {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}

export function ConceptMap() {
  const [graph, setGraph] = useState<ConceptGraphData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showListFallback, setShowListFallback] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}curriculum/concept-graph.json`)
      .then((response) => response.json())
      .then((data: ConceptGraphData) => {
        setGraph(data);
        if (data.nodes.length > 0) {
          setSelectedNodeId(data.nodes[0].id);
        }
      })
      .catch(() => setGraph({ nodes: [], edges: [] }));
  }, []);

  const selectedNode = useMemo(
    () => graph?.nodes.find((node) => node.id === selectedNodeId) ?? graph?.nodes[0],
    [graph, selectedNodeId]
  );

  const relatedNodeIds = useMemo(() => {
    if (!graph) return [];
    const directNeighbors = new Set<string>();
    graph.edges.forEach((edge) => {
      if (edge.source === selectedNode?.id) directNeighbors.add(edge.target);
      if (edge.target === selectedNode?.id) directNeighbors.add(edge.source);
    });
    return Array.from(directNeighbors);
  }, [graph, selectedNode?.id]);

  if (!graph) {
    return (
      <div className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
        Loading concept map…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Concept map</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Explore how ideas connect and jump to a lesson when you see a concept that matters.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowListFallback((value) => !value)}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {showListFallback ? 'Hide list view' : 'Show list view'}
            </button>
            {selectedNode && (
              <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                {selectedNode.title}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <svg viewBox="0 0 640 320" className="w-full" role="img" aria-label="Concept map graph">
            {graph.edges.map((edge, index) => {
              const source = graph.nodes.find((node) => node.id === edge.source);
              const target = graph.nodes.find((node) => node.id === edge.target);
              if (!source || !target) return null;
              const highlighted =
                selectedNode?.id === edge.source || selectedNode?.id === edge.target;
              return (
                <line
                  key={`${edge.source}-${edge.target}-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={highlighted ? '#2563eb' : '#94a3b8'}
                  strokeWidth={highlighted ? 3 : 1.5}
                  strokeDasharray={edge.type === 'related' ? '4 4' : '0'}
                />
              );
            })}
            {graph.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isRelated = relatedNodeIds.includes(node.id);
              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select concept ${node.title}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedNodeId(node.id);
                    }
                  }}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 34 : 26}
                    fill={isSelected ? '#2563eb' : isRelated ? '#bfdbfe' : '#e2e8f0'}
                    stroke={isSelected ? '#1d4ed8' : '#64748b'}
                    strokeWidth={isSelected ? 4 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#0f172a"
                    className="pointer-events-none"
                  >
                    {node.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      <div className="space-y-4">
        {selectedNode && (
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Selected concept</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {selectedNode.description}
            </p>
            {selectedNode.lessonId ? (
              <Link
                to={`/lessons/${selectedNode.lessonId}`}
                className="mt-3 inline-flex text-sm font-medium text-primary-700 underline-offset-4 hover:underline dark:text-primary-300"
              >
                Open lesson
              </Link>
            ) : null}
          </div>
        )}
        {showListFallback ? (
          <ConceptList
            nodes={graph.nodes}
            selectedId={selectedNode?.id}
            onSelect={setSelectedNodeId}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Keyboard-friendly fallback</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Use the toggle above to switch to a plain list if you prefer navigating with a keyboard or screen reader.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
