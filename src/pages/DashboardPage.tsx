import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchStatusList, fetchStatusSearch } from '../api/status.api';
import { useDebounce } from '../hooks/useDebounce';
import StatusCard from '../components/status/StatusCard';
import Skeleton from '../components/common/Skeleton';

function StatusSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-3">🔍</p>
      <p className="font-medium text-foreground">
        {query ? `No results for "${query}"` : 'No services found'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {query ? 'Try a different search term.' : 'Check back later.'}
      </p>
    </div>
  );
}

function formatCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const debounced = useDebounce(query);

  const isSearching = debounced.trim().length > 0;

  const listQuery = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatusList,
    enabled: !isSearching,
    refetchInterval: 60_000,
  });

  const searchQuery = useQuery({
    queryKey: ['status', 'search', debounced],
    queryFn: () => fetchStatusSearch(debounced),
    enabled: isSearching,
    refetchInterval: 60_000,
  });

  const { data, isLoading, isError, dataUpdatedAt } = isSearching
    ? searchQuery
    : listQuery;

  const categories = data
    ? [
        ...new Set(
          data.map((s) => s.company.category).filter(Boolean) as string[]
        ),
      ].sort()
    : [];

  const filtered =
    data && activeCategory
      ? data.filter((s) => s.company.category === activeCategory)
      : data;

  const degradedCount =
    data?.filter((s) => s.current && s.current.indicator !== 'none').length ??
    0;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Service Status</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live status for all monitored services.
          </p>
        </div>
        {dataUpdatedAt > 0 && (
          <p className="text-xs text-muted-foreground pt-1 shrink-0">
            Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {data && !isSearching && (
        <div
          className={`mb-4 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium ${
            degradedCount === 0
              ? 'border-green-500/20 bg-green-50/50 text-green-700 dark:bg-green-900/10 dark:text-green-400'
              : 'border-yellow-500/20 bg-yellow-50/50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-400'
          }`}
        >
          <span
            className={`size-2 rounded-full shrink-0 ${degradedCount === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}
          />
          {degradedCount === 0
            ? 'All systems operational'
            : `${degradedCount} service${degradedCount > 1 ? 's' : ''} experiencing issues`}
        </div>
      )}

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {!isSearching && categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {formatCategory(cat)}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <StatusSkeleton />
      ) : isError ? (
        <p className="text-sm text-destructive">
          Failed to load services. Is the API running?
        </p>
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState query={debounced} />
      ) : (
        <div className="space-y-2">
          {filtered.map((status) => (
            <StatusCard
              key={status.company.slug}
              status={status}
              onClick={(slug) => navigate(`/status/${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
