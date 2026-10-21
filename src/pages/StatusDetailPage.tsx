import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStatusDetail } from '../api/status.api';
import IndicatorBadge from '../components/status/IndicatorBadge';
import SnapshotTimeline from '../components/status/SnapshotTimeline';

export default function StatusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['status', slug],
    queryFn: () => fetchStatusDetail(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">
          Service not found or API unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-primary underline underline-offset-2"
        >
          ← Back to all services
        </button>
      </div>
    );
  }

  const { company, current, history } = data;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← All services
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          {current && <IndicatorBadge indicator={current.indicator} />}
        </div>

        {current && (
          <p className="mt-1 text-sm text-muted-foreground">
            {current.description}
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
