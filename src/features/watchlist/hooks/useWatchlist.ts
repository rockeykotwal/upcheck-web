import { useQuery } from '@tanstack/react-query';
import { fetchWatchlist } from '../../../api/watchlist.api';
import { useAuthStore } from '../../../store/auth.store';

export const WATCHLIST_QUERY_KEY = ['watchlist'] as const;

export function useWatchlist() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: WATCHLIST_QUERY_KEY,
    queryFn: fetchWatchlist,
    enabled: isAuthenticated,
  });
}
