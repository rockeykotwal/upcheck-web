import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchStatusList } from '../api/status.api';
import StatusCard from '../components/status/StatusCard';

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatusList,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-border bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load service statuses. Is the API running?
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Service Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live status for all monitored services.
        </p>
      </div>

      {data && data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services found.</p>
      ) : (
        <div className="space-y-2">
          {data?.map((status) => (
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
