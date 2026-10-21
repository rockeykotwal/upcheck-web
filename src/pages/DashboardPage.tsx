import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchStatusList, fetchStatusSearch } from '../api/status.api';
import { useDebounce } from '../hooks/useDebounce';
import StatusCard from '../components/status/StatusCard';

function StatusSkeleton() {
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query);

  const isSearching = debounced.trim().length > 0;

  const listQuery = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatusList,
    enabled: !isSearching,
  });

  const searchQuery = useQuery({
    queryKey: ['status', 'search', debounced],
    queryFn: () => fetchStatusSearch(debounced),
    enabled: isSearching,
  });

  const { data, isLoading, isError } = isSearching ? searchQuery : listQuery;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Service Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live status for all monitored services.
        </p>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <StatusSkeleton />
      ) : isError ? (
        <p className="text-sm text-destructive">
          Failed to load services. Is the API running?
        </p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isSearching
            ? `No results for "${debounced}".`
            : 'No services found.'}
        </p>
      ) : (
        <div className="space-y-2">
          {data.map((status) => (
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
