import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStatusDetail } from '../api/status.api';
import { fetchAiSummary } from '../api/ai.api';
import IndicatorBadge from '../components/status/IndicatorBadge';
import SnapshotTimeline from '../components/status/SnapshotTimeline';
import Skeleton from '../components/common/Skeleton';

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['status', slug],
    queryFn: () => fetchStatusDetail(slug!),
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

  const { company, current, history } = data;

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
        </div>

        {current && (
          <p className="mt-1 text-sm text-muted-foreground">
            {current.description}
          </p>
        )}
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

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Recent history
        </h2>
        <SnapshotTimeline history={history} />
      </div>
    </div>
  );
}
