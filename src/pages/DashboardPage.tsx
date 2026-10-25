import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchStatusList, fetchStatusSearch } from '../api/status.api';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/auth.store';
import {
  useMonitors,
  useDeleteMonitor,
} from '../features/monitors/hooks/useMonitors';
import StatusCard from '../components/status/StatusCard';
import IndicatorBadge from '../components/status/IndicatorBadge';
import AddMonitorModal from '../features/monitors/components/AddMonitorModal';

function ServerlessLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(100), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="relative size-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-border" />
        <div className="absolute inset-0 rounded-full border-[3px] border-t-green-500 animate-spin" />
      </div>

      <div className="text-center space-y-1.5 max-w-xs">
        <p className="text-sm font-medium text-foreground">
          Fetching live status…
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Running on serverless — cold starts can take up to 10 seconds.
        </p>
      </div>

      <div className="w-48 h-0.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all ease-out"
          style={{ width: `${progress}%`, transitionDuration: '5000ms' }}
        />
      </div>
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const monitorsQuery = useMonitors();
  const deleteMonitor = useDeleteMonitor();

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

  const myMonitors = isAuthenticated ? (monitorsQuery.data ?? []) : [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Service Status</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live status for all monitored services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground pt-1 shrink-0">
              Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </p>
          )}
          {isAuthenticated && (
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              + Add Service
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card px-4 py-4">
          <p className="text-2xl font-bold text-foreground">
            {isLoading ? '—' : (data?.length ?? 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total Services</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-50/50 dark:bg-green-900/10 px-4 py-4">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {isLoading ? '—' : (data?.length ?? 0) - degradedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Operational</p>
        </div>
        <div
          className={`rounded-lg border px-4 py-4 ${
            degradedCount > 0
              ? 'border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10'
              : 'border-border bg-card'
          }`}
        >
          <p
            className={`text-2xl font-bold ${
              degradedCount > 0
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-muted-foreground'
            }`}
          >
            {isLoading ? '—' : degradedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">With Issues</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-4">
          <p className="text-2xl font-bold text-foreground">
            {isLoading || !data
              ? '—'
              : `${(((data.length - degradedCount) / data.length) * 100).toFixed(1)}%`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Uptime Rate</p>
        </div>
      </div>

      {/* My Custom Monitors */}
      {isAuthenticated && myMonitors.length > 0 && !isSearching && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            My Services
          </h2>
          <div className="space-y-2">
            {myMonitors.map(({ company, current }) => (
              <div
                key={company.slug}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => navigate(`/status/${company.slug}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {company.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {company.statusPageUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {current && <IndicatorBadge indicator={current.indicator} />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete monitor "${company.name}"?`)) {
                        deleteMonitor.mutate(company.slug);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors px-1"
                    title="Delete monitor"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
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
        <ServerlessLoader />
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

      {showAddModal && (
        <AddMonitorModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
