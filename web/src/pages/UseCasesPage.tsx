import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

interface UseCaseEntry {
  id: string;
  title: string;
  conceptIds: string[];
  domainTags: string[];
  difficulty: string;
  description: string;
  lessonId?: string;
}

export function UseCasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState<UseCaseEntry[]>([]);
  const [query, setQuery] = useState(searchParams.get('query') ?? '');
  const [activeDomain, setActiveDomain] = useState(searchParams.get('domain') ?? '');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}curriculum/applications/index.json`)
      .then((response) => response.json())
      .then((data: { applications: UseCaseEntry[] }) => setEntries(data.applications))
      .catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('query', query);
    if (activeDomain) next.set('domain', activeDomain);
    setSearchParams(next, { replace: true });
  }, [activeDomain, query, setSearchParams]);

  const domains = useMemo(
    () => Array.from(new Set(entries.flatMap((entry) => entry.domainTags))).sort(),
    [entries]
  );
  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesDomain = !activeDomain || entry.domainTags.includes(activeDomain);
      const haystack = [
        entry.title,
        entry.description,
        entry.conceptIds.join(' '),
        entry.domainTags.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesDomain && matchesQuery;
    });
  }, [activeDomain, entries, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
          When will I use this?
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Find real-world math applications
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Search by concept or domain and jump to the lesson that teaches it.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
        <label
          className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          htmlFor="use-case-search"
        >
          <Search aria-hidden="true" className="h-5 w-5 text-slate-500" />
          <input
            id="use-case-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full border-none bg-transparent text-sm outline-none dark:text-slate-100"
            placeholder="Search concepts like fractions or finance"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveDomain('')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${activeDomain === '' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
          >
            All domains
          </button>
          {domains.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => setActiveDomain(domain)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${activeDomain === domain ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              {domain}
            </button>
          ))}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            No use-cases match your search. Try another concept or domain.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {entry.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {entry.difficulty}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.domainTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.lessonId ? (
                    <Link
                      to={`/lessons/${entry.lessonId}`}
                      className="rounded-full bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                    >
                      Open lesson
                    </Link>
                  ) : null}
                  <span className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    {entry.conceptIds.join(', ')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
