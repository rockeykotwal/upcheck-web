import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../features/watchlist/hooks/useWatchlist';
import StatusCard from '../components/status/StatusCard';
import Skeleton from '../components/common/Skeleton';

function WatchlistSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useWatchlist();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Services you're following
        </p>
      </div>

      {isLoading && <WatchlistSkeleton />}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load watchlist. Please try again.
        </p>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No services watched yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-sm text-primary underline underline-offset-2"
          >
            Browse all services
          </button>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((item) => (
            <StatusCard
              key={item.company.id}
              status={item}
              onClick={(slug) => navigate(`/status/${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
