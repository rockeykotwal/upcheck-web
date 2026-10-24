import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStatusDetail, fetchPostmortems } from '../api/status.api';
import { fetchAiSummary } from '../api/ai.api';
import IndicatorBadge from '../components/status/IndicatorBadge';
import SnapshotTimeline from '../components/status/SnapshotTimeline';
import Skeleton from '../components/common/Skeleton';
import { useAuthStore } from '../store/auth.store';
import { useWatchlist } from '../features/watchlist/hooks/useWatchlist';
import { useToggleWatch } from '../features/watchlist/hooks/useToggleWatch';
import type { Postmortem } from '../types/status.types';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function PostmortemCard({ pm }: { pm: Postmortem }) {
  const [expanded, setExpanded] = useState(false);
  const start = new Date(pm.startedAt);
  const dateStr = start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = start.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {dateStr} at {timeStr}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lasted {formatDuration(pm.durationMinutes)} &middot;{' '}
            {pm.snapshotCount} data points
          </p>
        </div>
        <IndicatorBadge indicator={pm.peakIndicator} />
      </div>

      {expanded && (
        <p className="text-sm text-foreground leading-relaxed border-t border-border pt-3">
          {pm.summary}
        </p>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? 'Hide postmortem ↑' : 'View AI postmortem ↓'}
      </button>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-32" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function StatusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAllComponents, setShowAllComponents] = useState(false);
  const { data: watchlist } = useWatchlist();
  const isWatching = watchlist?.some((w) => w.company.slug === slug) ?? false;
  const toggleWatch = useToggleWatch(slug!, isWatching);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['status', slug],
    queryFn: () => fetchStatusDetail(slug!),
    enabled: !!slug,
  });

  const { data: postmortems } = useQuery({
    queryKey: ['postmortems', slug],
    queryFn: () => fetchPostmortems(slug!),
    enabled: !!slug,
  });

  const summary = useMutation({
    mutationFn: () => fetchAiSummary(slug!),
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-medium text-foreground">Service not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This service doesn't exist or the API is unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-primary underline underline-offset-2"
        >
          ← Back to all services
        </button>
      </div>
    );
  }

  const { company, current, history, uptime } = data;

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← All services
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          {current && <IndicatorBadge indicator={current.indicator} />}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }
              toggleWatch.mutate();
            }}
            disabled={toggleWatch.isPending}
            className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isWatching ? 'Unwatch' : 'Watch'}
          </button>
        </div>

        {current && (
          <p className="mt-1 text-sm text-muted-foreground">
            {current.description}
          </p>
        )}
      </div>

      {/* Uptime stats */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            ['24h', uptime.h24],
            ['7d', uptime.d7],
            ['30d', uptime.d30],
          ] as const
        ).map(([label, pct]) => (
          <div
            key={label}
            className="rounded-lg border border-border p-4 text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">{label} uptime</p>
            <p
              className={`text-xl font-bold ${pct >= 99 ? 'text-green-500' : pct >= 95 ? 'text-yellow-500' : 'text-red-500'}`}
            >
              {pct}%
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 99 ? 'bg-green-500' : pct >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm font-semibold">AI Incident Summary</h2>
          <button
            onClick={() => summary.mutate()}
            disabled={summary.isPending}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {summary.isPending
              ? 'Generating…'
              : summary.data
                ? 'Regenerate'
                : 'Generate Summary'}
          </button>
        </div>

        {summary.isPending && (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        )}

        {summary.isError && (
          <p className="text-xs text-destructive">
            Failed to generate summary. Is the AI provider running?
          </p>
        )}

        {summary.data && !summary.isPending && (
          <p className="text-sm text-foreground leading-relaxed">
            {summary.data}
          </p>
        )}

        {!summary.data && !summary.isPending && !summary.isError && (
          <p className="text-xs text-muted-foreground">
            Click "Generate Summary" to get an AI analysis of recent incidents.
          </p>
        )}
      </div>

      {/* Component breakdown */}
      {current?.components && current.components.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Components
          </h2>
          <div className="space-y-2">
            {(showAllComponents
              ? current.components
              : current.components.slice(0, 5)
            ).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <span className="text-sm text-foreground">{c.name}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.status === 'operational'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : c.status === 'under_maintenance'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : c.status === 'degraded_performance'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
          {current.components.length > 5 && (
            <button
              onClick={() => setShowAllComponents((v) => !v)}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAllComponents
                ? 'Show less'
                : `Show all ${current.components.length} components`}
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Recent history
        </h2>
        <SnapshotTimeline history={history} />
      </div>

      {postmortems && postmortems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Incident History
            </h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {postmortems.length}
            </span>
          </div>
          <div className="space-y-3">
            {postmortems.map((pm) => (
              <PostmortemCard key={String(pm._id)} pm={pm} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
